<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'CED Teacher',
            'email' => 'ced@gmail.com',
            'password' => Hash::make('ced_12345'),
            'email_verified_at' => now(),
        ]);
    }
}
