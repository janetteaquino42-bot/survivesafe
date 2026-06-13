<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RouteCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rche';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Shortcut for route:cache';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->call('route:cache');
    }
}
