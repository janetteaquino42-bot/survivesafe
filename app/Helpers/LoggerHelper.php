<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;
use App\Helpers\AuthUserHelper;

class LoggerHelper
{
    public static function info(string $message, array $additionalContext = [])
    {
        $context = self::getStandardContext();
        Log::info($message, array_merge($context, $additionalContext));
    }

    public static function error(string $message, array $additionalContext = [])
    {
        $context = self::getStandardContext();
        Log::error($message, array_merge($context, $additionalContext));
    }

    public static function warning(string $message, array $additionalContext = [])
    {
        $context = self::getStandardContext();
        Log::warning($message, array_merge($context, $additionalContext));
    }

    private static function getStandardContext(): array
    {
        return [
            'user_id' => AuthUserHelper::getAuthUserAttribute('user_id'),
            'full_name' => AuthUserHelper::getAuthUserAttribute('full_name'),
            'role' => AuthUserHelper::getAuthUserAttribute('role'),
            // Add any other standard context you want in all logs
        ];
    }
}
