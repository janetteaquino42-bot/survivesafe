<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ViewClear extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vwclr';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Shortcut for view:clear';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->call('view:clear');
    }
}
