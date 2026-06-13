<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class Controller extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ctrl {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Shortcut for make:controller';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');
        $this->call('make:controller', ['name' => $name]);
    }
}
