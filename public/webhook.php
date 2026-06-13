<?php

/**
 * GitHub Webhook Handler for Auto Deployment
 */

define('WEBHOOK_SECRET', 'b66631b0c77aa496cfa03ae7d7c0b4edda39e3f732c27ba9cb509fd57664edad');
define('DEPLOY_SCRIPT', '/home/u369488440/domains/creativac.com/laravel/deploy.sh');
define('LOG_FILE', '/home/u369488440/domains/creativac.com/laravel/deployment.log');
define('OUTPUT_LOG', '/home/u369488440/domains/creativac.com/laravel/deployment-output.log');
define('DEPLOY_BRANCH', 'refs/heads/live');

// Verify GitHub signature
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
$payload = file_get_contents('php://input');

if (empty($signature)) {
    http_response_code(403);
    die(json_encode(['error' => 'Missing signature']));
}

$expected_signature = 'sha256=' . hash_hmac('sha256', $payload, WEBHOOK_SECRET);
if (!hash_equals($expected_signature, $signature)) {
    http_response_code(403);
    logMessage('Invalid signature from ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    die(json_encode(['error' => 'Invalid signature']));
}

// Parse payload
$data = json_decode($payload, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid JSON payload']));
}

// Check if push to deploy branch
$ref = $data['ref'] ?? '';
$pusher = $data['pusher']['name'] ?? 'unknown';
$commits = count($data['commits'] ?? []);

if ($ref === DEPLOY_BRANCH) {
    $message = "Deployment triggered by {$pusher} ({$commits} commit" . ($commits != 1 ? 's' : '') . ")";
    logMessage($message);

    if (!file_exists(DEPLOY_SCRIPT)) {
        http_response_code(500);
        logMessage('ERROR: Deploy script not found: ' . DEPLOY_SCRIPT);
        die(json_encode(['status' => 'error', 'message' => 'Deploy script not found']));
    }

    $command = 'cd /home/u369488440/domains/creativac.com/laravel && bash ' . DEPLOY_SCRIPT . ' > ' . OUTPUT_LOG . ' 2>&1 &';
    exec($command);

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Deployment started',
        'branch' => 'live',
        'pusher' => $pusher,
        'commits' => $commits,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} else {
    http_response_code(200);
    logMessage("Ignored push to {$ref}");
    echo json_encode(['status' => 'ignored', 'message' => 'Not the deploy branch', 'branch' => $ref]);
}

function logMessage($message)
{
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $logEntry = "[{$timestamp}] [{$ip}] {$message}\n";
    file_put_contents(LOG_FILE, $logEntry, FILE_APPEND);
}
