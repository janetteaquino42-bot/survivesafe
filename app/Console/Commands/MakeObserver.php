<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MakeObserver extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'obs {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Shortcut for make:observer';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');
        $this->call('make:observer', ['name' => $name]);
    }
}
