<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $variant = $request->query('variant', 'pretest');
        $studentId = $request->query('student_id');

        $student = $studentId ? Student::find($studentId) : null;

        return Inertia::render('tests/code/teacher/Index', [
            'student' => $student,
            'variant' => $variant,
        ]);
    }

    /**
     * Composite Reading Score for a student & variant, with selectable grade.
     */
    public function composite(Request $request)
    {
        $variant   = $request->query('variant', 'pretest'); // "pretest" | "posttest"
        $studentId = $request->query('student_id');
        $gradeId   = $request->query('grade_id'); // optional

        abort_if(!$studentId, 404);

        $student = Student::with(['grades', 'preTests', 'postTests'])->findOrFail($studentId);

        // All grades ever attached to this student (with pivot.active)
        $grades      = $student->grades->values();
        $activeGrade = $student->activeGrade()->first();

        // Determine which grade is selected:
        $selectedGrade = null;

        if ($gradeId) {
            $selectedGrade = $grades->firstWhere('id', (int) $gradeId);
        }

        if (!$selectedGrade) {
            // Default: active grade if any, otherwise first grade, otherwise null
            $selectedGrade = $activeGrade ?: $grades->first();
        }

        $selectedGradeId = $selectedGrade?->id;

        // Decide which tests collection to use (pre or post)
        $tests = $variant === 'pretest'
            ? $student->preTests
            : $student->postTests;

        // Filter tests by selected grade_id from pivot
        if ($selectedGradeId) {
            $tests = $tests->filter(fn ($test) => (int) $test->pivot->grade_id === (int) $selectedGradeId);
        }

        $byName = $tests->keyBy('test_name');

        // These test_name strings must match your seeder
        $blending   = optional($byName->get('Blending Test'))->pivot?->calculated_score ?? 0;
        $segmenting = optional($byName->get('Segmenting Test'))->pivot?->calculated_score ?? 0;
        $auditory   = optional($byName->get('Auditory Processing Tests'))->pivot?->calculated_score ?? 0;
        $code       = optional($byName->get('Code Knowledge Test'))->pivot?->calculated_score ?? 0;

        $totalScore   = $blending + $segmenting + $auditory + $code;
        $averageScore = $totalScore / 4; // Total Score of the four test ( total score / 4 )

        // Grade multiplier (from selected grade)
        $gradeMultiplier = $selectedGrade?->multiplier ?? 1.00;

        // Composite × grade multiplier (this is your "grade total")
        $gradeComposite = round($averageScore * $gradeMultiplier, 2);

        return Inertia::render('tests/composite-reading-score', [
            'variant' => $variant,
            'student' => [
                'id'   => $student->id,
                'name' => $student->name,
            ],
            'scores'  => [
                'blending'   => $blending,
                'segmenting' => $segmenting,
                'auditory'   => $auditory,
                'code'       => $code,
                'total'      => $totalScore,
                'average'    => $averageScore,
            ],
            'grades' => $grades->map(fn ($g) => [
                'id'         => $g->id,
                'name'       => $g->name,
                'multiplier' => (float) $g->multiplier,
                'active'     => (bool) $g->pivot->active,
            ]),
            'selected_grade_id' => $selectedGradeId,
            'gradeComposite'    => $gradeComposite,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
