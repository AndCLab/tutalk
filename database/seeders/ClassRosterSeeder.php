<?php

namespace Database\Seeders;

use App\Models\ClassRoster;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassRosterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ClassRoster::factory()->times(450)->create();
    }
}
