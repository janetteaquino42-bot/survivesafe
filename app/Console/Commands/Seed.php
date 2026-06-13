<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class Seed extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Shortcut for db:seed';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');
        $this->call('db:seed', ['--class' => $name]);
    }
}
