<?php

namespace App\Http\Controllers;

use App\Models\PostTest;
use App\Models\PreTest;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PhonemeSegmentationTestController extends Controller
{
    /**
     * Store a full Phoneme Segmentation Test result.
     *
     * Expected payload (JSON from Inertia):
     * {
     *   "variant": "pretest" | "posttest",
     *   "student_id": 1,
     *   "results": [
     *     {
     *       "variant": "pretest",
     *       "part": 1,
     *       "target": "dog",
     *       "perLetterCorrect": [true, true, true],
     *       "soundedCount": 3,
     *       "totalLetters": 3,
     *       "accuracyPct": 100,
     *       "isPerfect": true,
     *       "timestamp": 123456789
     *     },
     *     ...
     *   ]
     * }
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'variant'                     => 'required|in:pretest,posttest',
            'student_id'                  => 'required|exists:students,id',
            'results'                     => 'required|array',
            'results.*.part'              => 'required|integer|in:1,2',
            'results.*.target'            => 'required|string',
            'results.*.perLetterCorrect'  => 'required|array',
            'results.*.perLetterCorrect.*'=> 'required|boolean',
            'results.*.soundedCount'      => 'required|integer|min:0',
            'results.*.totalLetters'      => 'required|integer|min:0',
            'results.*.accuracyPct'       => 'required|numeric|min:0',
            'results.*.isPerfect'         => 'required|boolean',
            'results.*.timestamp'         => 'required|integer',
        ]);

        $student = Student::with('grades')->findOrFail($data['student_id']);

        // 🔎 Find active grade from grade_student pivot
        $activeGrade = $student->activeGrade()->first();

        if (!$activeGrade) {
            abort(422, 'Student has no active grade assigned.');
        }

        $gradeId = $activeGrade->id;

        // RAW SCORE: total number of correctly sounded letters across all words.
        $rawScore = collect($data['results'])->sum('soundedCount');

        // Guard against negative
        $rawScore = max(0, $rawScore);

        if ($data['variant'] === 'pretest') {
            // Use the "Segmenting Test" row from pre_tests
            $test = PreTest::firstOrCreate(
                ['test_name' => 'Segmenting Test'],
                ['multiplier' => 2.38] // from your seeder spec
            );

            // Test-only multiplier here; grade multiplier is used in composite
            $calculated = $this->calculateScore($rawScore, (float) $test->multiplier);

            $student->preTests()->syncWithoutDetaching([
                $test->id => [
                    'user_id'          => Auth::id(),
                    'grade_id'         => $gradeId,      // ✅ persist grade_id
                    'raw_score'        => $rawScore,
                    'calculated_score' => $calculated,
                ],
            ]);
        } else {
            // Post-test segmenting
            $test = PostTest::firstOrCreate(
                ['test_name' => 'Segmenting Test'],
                ['multiplier' => 2.38]
            );

            $calculated = $this->calculateScore($rawScore, (float) $test->multiplier);

            $student->postTests()->syncWithoutDetaching([
                $test->id => [
                    'user_id'          => Auth::id(),
                    'grade_id'         => $gradeId,      // ✅ persist grade_id
                    'raw_score'        => $rawScore,
                    'calculated_score' => $calculated,
                ],
            ]);
        }

        return back()->with('success', 'Phoneme segmentation scores saved successfully.');
    }

    /**
     * Test-level score only: raw × test multiplier.
     * Grade multiplier is applied later at the composite reading score level.
     */
    protected function calculateScore(int $rawScore, float $testMultiplier): float
    {
        $score = $rawScore * $testMultiplier;

        return round($score, 2);
    }
}
