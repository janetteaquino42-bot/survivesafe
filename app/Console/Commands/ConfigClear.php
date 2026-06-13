<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ConfigClear extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cfgclr';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Shortcut for config:clear';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->call('config:clear');
    }
}
