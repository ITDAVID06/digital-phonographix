<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $grades = [
            'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
            'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'
        ];

        $students = [
            'John Mark Dizon',
            'Angela Bautista',
            'Christian Reyes',
            'Nicole Dela Cruz',
            'Joshua Santos',
            'Patricia Mendoza',
            'Kevin Ramirez',
            'Althea Garcia',
            'Jerome Villanueva',
            'Hannah Cruz',
        ];

        foreach ($students as $student) {
            Student::firstOrCreate(
                ['name' => $student],
                [
                    'grade' => $grades[array_rand($grades)],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
