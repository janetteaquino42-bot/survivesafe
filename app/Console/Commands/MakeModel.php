<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MakeModel extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'model {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Shortcut for make:model';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');
        $this->call('make:model', ['name' => $name]);
    }
}
