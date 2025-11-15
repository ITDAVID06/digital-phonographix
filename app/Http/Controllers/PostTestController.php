<?php

namespace App\Http\Controllers;

use App\Models\PostTest;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostTestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $studentId = $request->query('student');
        $student = Student::find($studentId);

        return Inertia::render('posttest/Index', [
            'student' => $student,
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
    public function show(PostTest $postTest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PostTest $postTest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PostTest $postTest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PostTest $postTest)
    {
        //
    }
}
