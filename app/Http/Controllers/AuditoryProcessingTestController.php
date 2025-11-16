<?php

namespace App\Http\Controllers;

use App\Models\PostTest;
use App\Models\PreTest;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditoryProcessingTestController extends Controller
{
    /**
     * Store a full Auditory Processing Test result.
     *
     * Expected payload:
     * {
     *   "variant": "pretest" | "posttest",
     *   "student_id": 1,
     *   "results": [
     *     {
     *       "variant": "pretest",
     *       "part": 1 | 2 | 3,
     *       "baseWord": "pim",
     *       "removed": "p",
     *       "prompt": "say pim w/o the 'p'",
     *       "response": "im",
     *       "expected": "im",
     *       "isExactMatch": true,
     *       "timestamp": 123456789
     *     },
     *     ...
     *   ]
     * }
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'variant'              => 'required|in:pretest,posttest',
            'student_id'           => 'required|exists:students,id',
            'results'              => 'required|array',
            'results.*.part'       => 'required|integer|in:1,2,3',
            'results.*.baseWord'   => 'required|string',
            'results.*.removed'    => 'required|string',
            'results.*.prompt'     => 'required|string',
            'results.*.response'   => 'nullable|string',
            'results.*.expected'   => 'required|string',
            'results.*.isExactMatch' => 'required|boolean',
            'results.*.timestamp'  => 'required|integer',
        ]);

        $student = Student::with('grades')->findOrFail($data['student_id']);

        // RAW SCORE: 1 point per correct item.
        $rawScore = collect($data['results'])
            ->where('isExactMatch', true)
            ->count();

        // You currently have 3 + 3 + 4 = 10 items, so clamp 0–10 just in case.
        $rawScore = max(0, min(10, $rawScore));

        if ($data['variant'] === 'pretest') {
            $test = PreTest::firstOrCreate(
                ['test_name' => 'Auditory Processing Test'],
                ['multiplier' => 10.0] // from your seeder spec
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
                ['test_name' => 'Auditory Processing Test'],
                ['multiplier' => 10.0]
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

        return back()->with('success', 'Auditory processing test scores saved successfully.');
    }

    /**
     * Compute final score with test + grade multipliers.
     */
    protected function calculateScore(int $rawScore, float $testMultiplier, Student $student): float
    {
        $gradeMultiplier = optional($student->grades()->first())->multiplier ?? 1.00;

        $score = $rawScore * $testMultiplier * $gradeMultiplier;

        return round($score, 2);
    }
}
