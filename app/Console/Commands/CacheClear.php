<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CacheClear extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'checlr';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Shortcut for cache:clear';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->call('cache:clear');
    }
}
