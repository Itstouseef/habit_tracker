<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Habit;
use App\Models\Goal;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create the Admin
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name'     => 'Super Admin',
                'password' => Hash::make('admin123'),
                'role'     => 'Admin', 
                'status'   => 'Active',
            ]
        );

        // 2. Create a Regular User for testing persistence
        $testUser = User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name'     => 'Test User',
                'password' => Hash::make('password123'),
                'role'     => 'User',
                'status'   => 'Active',
            ]
        );

        // 3. Give the Test User a sample Habit
        $testUser->habits()->updateOrCreate(
            ['name' => 'Morning Meditation'],
            []
        );

        // 4. Give the Test User a sample Goal
        $testUser->goals()->updateOrCreate(
            ['title' => 'Complete React Project'],
            [
                'description' => 'Finish the persistence logic and admin panel.',
                'completed' => false
            ]
        );

        $this->command->info('Admin and Test User created with sample data!');
    }
}