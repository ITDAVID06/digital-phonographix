<?php

namespace Database\Seeders;

use App\Models\Grade;
use App\Models\PreTest;
use App\Models\PostTest;
use Illuminate\Database\Seeder;

class AcademicSetupSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedGrades();
        $this->seedPreTests();
        $this->seedPostTests();
    }

    private function seedGrades(): void
    {
        $grades = [
            ['name' => 'Grade 1', 'multiplier' => 1.10],
            ['name' => 'Grade 2', 'multiplier' => 1.05],
            ['name' => 'Grade 3', 'multiplier' => 1.00],
            ['name' => 'Grade 4', 'multiplier' => 0.95],
            ['name' => 'Grade 5', 'multiplier' => 0.95],
            ['name' => 'Grade 6', 'multiplier' => 0.90],
            ['name' => 'Grade 7', 'multiplier' => 0.90],
            ['name' => 'Grade 8', 'multiplier' => 0.90],
        ];

        foreach ($grades as $g) {
            Grade::updateOrCreate(
                ['name' => $g['name']],
                ['multiplier' => $g['multiplier']]
            );
        }
    }

    private function seedPreTests(): void
    {
        $tests = [
            ['test_name' => 'Blending Test', 'multiplier' => 6.66],        // 5 items? you listed "_5__ x 6.66"
            ['test_name' => 'Segmenting Test', 'multiplier' => 2.38],
            ['test_name' => 'Auditory Processing Test', 'multiplier' => 10.00],
            ['test_name' => 'Code Knowledge Test', 'multiplier' => 2.00],
        ];

        foreach ($tests as $t) {
            PreTest::updateOrCreate(
                ['test_name' => $t['test_name']],
                ['multiplier' => $t['multiplier']]
            );
        }
    }

    private function seedPostTests(): void
    {
        $tests = [
            ['test_name' => 'Blending Test', 'multiplier' => 6.66],
            ['test_name' => 'Segmenting Test', 'multiplier' => 2.38],
            ['test_name' => 'Auditory Processing Test', 'multiplier' => 10.00],
            ['test_name' => 'Code Knowledge Test', 'multiplier' => 2.00],
        ];

        foreach ($tests as $t) {
            PostTest::updateOrCreate(
                ['test_name' => $t['test_name']],
                ['multiplier' => $t['multiplier']]
            );
        }
    }
}
