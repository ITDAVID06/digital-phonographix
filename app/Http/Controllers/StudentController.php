<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Store a newly created student in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'grade' => 'required|string|in:Grade 1,Grade 2,Grade 3,Grade 4,Grade 5,Grade 6,Grade 7,Grade 8',
        ]);

        Student::create($validated);

        return redirect()->back()->with('success', 'Student added successfully!');
    }

    /**
     * Display all students (optional, for later use).
     */
    public function index()
    {
        $students = \App\Models\Student::orderBy('name')->get();
        return \Inertia\Inertia::render('dashboard', [
            'students' => $students,
        ]);
    }
}
