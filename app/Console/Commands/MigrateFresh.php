<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MigrateFresh extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migfr'; /* Migrate:fresh */

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Shortcut for migrate:fresh';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->call('migrate:fresh');
    }
}
