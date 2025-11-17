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
     * Composite Reading Score for a student & variant.
     */
    public function composite(Request $request)
    {
        $variant = $request->query('variant', 'pretest'); // "pretest" | "posttest"
        $studentId = $request->query('student_id');

        abort_if(!$studentId, 404);

        $student = Student::with(['grades', 'preTests', 'postTests'])->findOrFail($studentId);

        // Decide which tests collection to use
        $testsCollection = $variant === 'pretest'
            ? $student->preTests   // belongsToMany PreTest
            : $student->postTests; // belongsToMany PostTest

        $byName = $testsCollection->keyBy('test_name');

        // These test_name strings must match your seeder/test creation
        $blending   = optional($byName->get('Blending Test'))->pivot?->calculated_score ?? 0;
        $segmenting = optional($byName->get('Segmenting Test'))->pivot?->calculated_score ?? 0;
        $auditory   = optional($byName->get('Auditory Processing Tests'))->pivot?->calculated_score ?? 0;
        $code       = optional($byName->get('Code Knowledge Test'))->pivot?->calculated_score ?? 0;

        $totalScore = $blending + $segmenting + $auditory + $code;
        $averageScore = $totalScore / 4; // "Total Score of the four test ( total score / 4 )"

        // Grade & grade multiplier
        $grade = $student->grades()->first(); // assume one active grade
        $gradeMultiplier = $grade?->multiplier ?? 1.00;

        // "Then show the grade total as well ... multiply the total score by that multiplier."
        $gradeComposite = round($averageScore * $gradeMultiplier, 2);

        return Inertia::render('tests/composite-reading-score', [
            'variant' => $variant,
            'student' => $student,
            'scores'  => [
                'blending'   => $blending,
                'segmenting' => $segmenting,
                'auditory'   => $auditory,
                'code'       => $code,
                'total'      => $totalScore,
                'average'    => $averageScore,
            ],
            'grade'           => $grade,
            'gradeComposite'  => $gradeComposite,
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
