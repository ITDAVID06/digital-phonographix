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
            'variant'                 => 'required|in:pretest,posttest',
            'student_id'              => 'required|exists:students,id',
            'results'                 => 'required|array',
            'results.*.isExactMatch'  => 'required|boolean',
            'results.*.target'        => 'required|string',
            'results.*.response'      => 'nullable|string',
            'results.*.part'          => 'required|integer|in:1,2',
            'results.*.timestamp'     => 'required|integer',
        ]);

        $student = Student::with('grades')->findOrFail($data['student_id']);

        // Find active grade for this student (grade_student.active = true)
        $activeGrade = $student->activeGrade()->first();

        if (!$activeGrade) {
            abort(422, 'Student has no active grade assigned.');
        }

        $gradeId = $activeGrade->id;

        // 15 items total (9 in Part One, 6 in Part Two)
        $rawScore = collect($data['results'])
            ->where('isExactMatch', true)
            ->count();

        // Hard cap between 0–15
        $rawScore = max(0, min(15, $rawScore));

        if ($data['variant'] === 'pretest') {
            $test = PreTest::firstOrCreate(
                ['test_name' => 'Blending Test'],
                ['multiplier' => 6.66]   // from your seeder
            );

            // Only test multiplier here, no grade multiplier
            $calculated = $this->calculateScore($rawScore, (float) $test->multiplier);

            // Check if a record exists for this student, test, and current active grade
            $existingRecord = $student->preTests()
                ->where('pre_test_id', $test->id)
                ->wherePivot('grade_id', $gradeId)
                ->first();

            if ($existingRecord) {
                // Update existing record for the same grade
                $student->preTests()->updateExistingPivot($test->id, [
                    'user_id'          => Auth::id(),
                    'grade_id'         => $gradeId,
                    'raw_score'        => $rawScore,
                    'calculated_score' => $calculated,
                    'updated_at'       => now(),
                ], false);
            } else {
                // Create new record for different grade
                $student->preTests()->attach($test->id, [
                    'user_id'          => Auth::id(),
                    'grade_id'         => $gradeId,
                    'raw_score'        => $rawScore,
                    'calculated_score' => $calculated,
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ]);
            }
        } else {
            $test = PostTest::firstOrCreate(
                ['test_name' => 'Blending Test'],
                ['multiplier' => 6.66]
            );

            $calculated = $this->calculateScore($rawScore, (float) $test->multiplier);

            // Check if a record exists for this student, test, and current active grade
            $existingRecord = $student->postTests()
                ->where('post_test_id', $test->id)
                ->wherePivot('grade_id', $gradeId)
                ->first();

            if ($existingRecord) {
                // Update existing record for the same grade
                $student->postTests()->updateExistingPivot($test->id, [
                    'user_id'          => Auth::id(),
                    'grade_id'         => $gradeId,
                    'raw_score'        => $rawScore,
                    'calculated_score' => $calculated,
                    'updated_at'       => now(),
                ], false);
            } else {
                // Create new record for different grade
                $student->postTests()->attach($test->id, [
                    'user_id'          => Auth::id(),
                    'grade_id'         => $gradeId,
                    'raw_score'        => $rawScore,
                    'calculated_score' => $calculated,
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ]);
            }
        }

        return back()->with('success', 'Blending test scores saved successfully.');
    }

    /**
     * Test-level scoring: raw × testMultiplier.
     * Grade multiplier is applied later at the composite level.
     */
    protected function calculateScore(int $rawScore, float $testMultiplier): float
    {
        $score = $rawScore * $testMultiplier;

        return round($score, 2);
    }
}