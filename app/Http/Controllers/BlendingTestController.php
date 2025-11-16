<?php

namespace App\Http\Controllers;

use App\Models\PostTest;
use App\Models\PreTest;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlendingTestController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'variant' => 'required|in:pretest,posttest',
            'student_id' => 'required|exists:students,id',
            'results' => 'required|array',
            'results.*.isExactMatch' => 'required|boolean',
            'results.*.target' => 'required|string',
            'results.*.response' => 'nullable|string',
            'results.*.part' => 'required|integer|in:1,2',
            'results.*.timestamp' => 'required|integer',
        ]);

        $student = Student::with('grades')->findOrFail($data['student_id']);

        // 15 items total (9 in Part One, 6 in Part Two)
        $rawScore = collect($data['results'])
            ->where('isExactMatch', true)
            ->count();

        // Hard cap between 0–15
        $rawScore = max(0, min(15, $rawScore));

        if ($data['variant'] === 'pretest') {
            $test = PreTest::firstOrCreate(
                ['test_name' => 'Blending Test'],
                ['multiplier' => 6.66]   // or whatever you seeded
            );

            $calculated = $this->calculateScore($rawScore, $test->multiplier, $student);

            $student->preTests()->syncWithoutDetaching([
                $test->id => [
                    'user_id'          => Auth::id(),
                    'raw_score'        => $rawScore,
                    'calculated_score' => $calculated,
                ],
            ]);
        } else {
            $test = PostTest::firstOrCreate(
                ['test_name' => 'Blending Test'],
                ['multiplier' => 6.66]
            );

            $calculated = $this->calculateScore($rawScore, $test->multiplier, $student);

            $student->postTests()->syncWithoutDetaching([
                $test->id => [
                    'user_id'          => Auth::id(),
                    'raw_score'        => $rawScore,
                    'calculated_score' => $calculated,
                ],
            ]);
        }

        // ✅ Redirect back so Inertia stays on the same page
        return back()->with('success', 'Blending test scores saved successfully.');
    }

    protected function calculateScore(int $rawScore, float $testMultiplier, Student $student): float
    {
        $gradeMultiplier = optional($student->grades()->first())->multiplier ?? 1.00;

        $score = $rawScore * $testMultiplier * $gradeMultiplier;

        return round($score, 2);
    }
}
