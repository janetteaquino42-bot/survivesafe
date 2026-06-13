<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RouteClear extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rclr';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Shortcut for route:clear';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->call('route:clear');
    }
}
