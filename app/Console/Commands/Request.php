<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class Request extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'req {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Shortcut for make:request';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');
        $this->call('make:request', ['name' => $name]);
    }
}
