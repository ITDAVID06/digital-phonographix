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
            'variant'                 => 'required|in:pretest,posttest',
            'student_id'              => 'required|exists:students,id',
            'results'                 => 'required|array',
            'results.*.part'          => 'required|integer|in:1,2,3',
            'results.*.baseWord'      => 'required|string',
            'results.*.removed'       => 'required|string',
            'results.*.prompt'        => 'required|string',
            'results.*.response'      => 'nullable|string',
            'results.*.expected'      => 'required|string',
            'results.*.isExactMatch'  => 'required|boolean',
            'results.*.timestamp'     => 'required|integer',
        ]);

        $student = Student::with('grades')->findOrFail($data['student_id']);

        // 🔎 Use the active grade from the grade_student pivot
        $activeGrade = $student->activeGrade()->first();

        if (! $activeGrade) {
            abort(422, 'Student has no active grade assigned.');
        }

        $gradeId = $activeGrade->id;

        // RAW SCORE: 1 point per correct item.
        $rawScore = collect($data['results'])
            ->where('isExactMatch', true)
            ->count();

        // You currently have 3 + 3 + 4 = 10 items; clamp 0–10 just in case.
        $rawScore = max(0, min(10, $rawScore));

        // NOTE: using "Auditory Processing Tests" (plural) to match seeder + composite controller
        if ($data['variant'] === 'pretest') {
            $test = PreTest::firstOrCreate(
                ['test_name' => 'Auditory Processing Tests'],
                ['multiplier' => 10.0]
            );

            // Test-only multiplier here; grade multiplier is applied later in composite view
            $calculated = $this->calculateScore($rawScore, (float) $test->multiplier);

            $student->preTests()->syncWithoutDetaching([
                $test->id => [
                    'user_id'          => Auth::id(),
                    'grade_id'         => $gradeId,   // ✅ persist grade_id
                    'raw_score'        => $rawScore,
                    'calculated_score' => $calculated,
                ],
            ]);
        } else {
            $test = PostTest::firstOrCreate(
                ['test_name' => 'Auditory Processing Tests'],
                ['multiplier' => 10.0]
            );

            $calculated = $this->calculateScore($rawScore, (float) $test->multiplier);

            $student->postTests()->syncWithoutDetaching([
                $test->id => [
                    'user_id'          => Auth::id(),
                    'grade_id'         => $gradeId,   // ✅ persist grade_id
                    'raw_score'        => $rawScore,
                    'calculated_score' => $calculated,
                ],
            ]);
        }

        return back()->with('success', 'Auditory processing test scores saved successfully.');
    }

    /**
     * Test-level score only: raw × test multiplier.
     * Grade multiplier is handled later when computing the composite reading score.
     */
    protected function calculateScore(int $rawScore, float $testMultiplier): float
    {
        $score = $rawScore * $testMultiplier;

        return round($score, 2);
    }
}
