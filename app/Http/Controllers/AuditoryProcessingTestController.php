<?php

namespace App\Http\Controllers;

use App\Models\PostTest;
use App\Models\PreTest;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditoryProcessingTestController extends Controller
{
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

        $activeGrade = $student->activeGrade()->first();

        if (!$activeGrade) {
            abort(422, 'Student has no active grade assigned.');
        }

        $gradeId = $activeGrade->id;

        $rawScore = collect($data['results'])
            ->where('isExactMatch', true)
            ->count();

        $rawScore = max(0, min(10, $rawScore));

        if ($data['variant'] === 'pretest') {
            $test = PreTest::firstOrCreate(
                ['test_name' => 'Auditory Processing Tests'],
                ['multiplier' => 10.0]
            );

            $calculated = $this->calculateScore($rawScore, (float) $test->multiplier);

            $existingRecord = $student->preTests()
                ->where('pre_test_id', $test->id)
                ->wherePivot('grade_id', $gradeId)
                ->first();

            if ($existingRecord) {
                $student->preTests()->updateExistingPivot($test->id, [
                    'user_id'          => Auth::id(),
                    'grade_id'         => $gradeId,
                    'raw_score'        => $rawScore,
                    'calculated_score' => $calculated,
                    'updated_at'       => now(),
                ], false);
            } else {
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
                ['test_name' => 'Auditory Processing Tests'],
                ['multiplier' => 10.0]
            );

            $calculated = $this->calculateScore($rawScore, (float) $test->multiplier);

            $existingRecord = $student->postTests()
                ->where('post_test_id', $test->id)
                ->wherePivot('grade_id', $gradeId)
                ->first();

            if ($existingRecord) {
                $student->postTests()->updateExistingPivot($test->id, [
                    'user_id'          => Auth::id(),
                    'grade_id'         => $gradeId,
                    'raw_score'        => $rawScore,
                    'calculated_score' => $calculated,
                    'updated_at'       => now(),
                ], false);
            } else {
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

        return back()->with('success', 'Auditory processing test scores saved successfully.');
    }

    protected function calculateScore(int $rawScore, float $testMultiplier): float
    {
        $score = $rawScore * $testMultiplier;
        return round($score, 2);
    }
}