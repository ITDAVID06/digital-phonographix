<?php

namespace App\Http\Controllers;

use App\Models\PostTest;
use App\Models\PreTest;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CodeKnowledgeTestController extends Controller
{
    /**
     * Store Code Knowledge Test result.
     *
     * Expected payload:
     * {
     *   "variant": "pretest" | "posttest",
     *   "student_id": 1,
     *   "results": [
     *     {
     *       "variant": "pretest",
     *       "grapheme": "a",
     *       "known": true,
     *       "examples": "a as in apple",
     *       "timestamp": 123456789
     *     },
     *     ...
     *   ]
     * }
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'variant'             => 'required|in:pretest,posttest',
            'student_id'          => 'required|exists:students,id',
            'results'             => 'required|array',
            'results.*.variant'   => 'required|in:pretest,posttest',
            'results.*.grapheme'  => 'required|string',
            'results.*.known'     => 'required|boolean',
            'results.*.examples'  => 'nullable|string',
            'results.*.timestamp' => 'required|integer',
        ]);

        $student = Student::with('grades')->findOrFail($data['student_id']);

        // 🔎 Use the active grade from the grade_student pivot
        $activeGrade = $student->activeGrade()->first();

        if (! $activeGrade) {
            abort(422, 'Student has no active grade assigned.');
        }

        $gradeId = $activeGrade->id;

        // RAW SCORE: 1 point per known grapheme
        $rawScore = collect($data['results'])
            ->where('known', true)
            ->count();

        // Clamp just in case (max items in STUDENT_ORDER from the frontend)
        $maxItems = count($data['results']);
        $rawScore = max(0, min($maxItems, $rawScore));

        if ($data['variant'] === 'pretest') {
            $test = PreTest::firstOrCreate(
                ['test_name' => 'Code Knowledge Test'],
                ['multiplier' => 2.0] // from your seeder spec
            );

            // Only test multiplier here (grade multiplier is applied later in composite view)
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
                ['test_name' => 'Code Knowledge Test'],
                ['multiplier' => 2.0]
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

        return back()->with('success', 'Code knowledge test scores saved successfully.');
    }

    /**
     * Test-level score only: raw × test multiplier.
     * Grade multiplier is handled later in the composite reading score.
     */
    protected function calculateScore(int $rawScore, float $testMultiplier): float
    {
        $score = $rawScore * $testMultiplier;

        return round($score, 2);
    }
}
