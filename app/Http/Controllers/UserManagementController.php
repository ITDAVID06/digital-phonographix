<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\Grade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('users-management', [
            'users' => User::query()
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'created_at']),

            'students' => Student::query()
                ->with('grades:id,name') // assuming belongsToMany
                ->orderBy('name')
                ->get(['id', 'name']),

            'grades' => Grade::query()
                ->orderBy('name')
                ->get(['id', 'name', 'multiplier']),
        ]);
    }

    public function storeUser(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        return back()->with('success', 'User created successfully.');
    }

    public function updateUser(Request $request, User $user)
    {
        $data = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);

        $user->update($data);

        return back()->with('success', 'User updated successfully.');
    }

    public function destroyUser(User $user)
    {
        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }


    
    // ---------- STUDENTS ----------

    public function storeStudent(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        Student::create([
            'name' => $data['name'],
        ]);

        return back()->with('success', 'Student created successfully.');
    }

    public function updateStudent(Request $request, Student $student)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $student->update($data);

        return back()->with('success', 'Student updated successfully.');
    }

    public function destroyStudent(Student $student)
    {
        // grade_student pivot will be cascade-deleted thanks to FK definition
        $student->delete();

        return back()->with('success', 'Student deleted successfully.');
    }

    /**
     * Assign / update a student's grade.
     * For now: single grade per student => sync with one grade id.
     */
    public function assignGrade(Request $request, Student $student)
    {
        $data = $request->validate([
            'grade_id' => ['required', 'exists:grades,id'],
        ]);

        // If you want exactly ONE active grade per student:
        $student->grades()->sync([$data['grade_id']]);

        // If you want to allow multiple grades, use syncWithoutDetaching instead:
        // $student->grades()->syncWithoutDetaching([$data['grade_id']]);

        return back()->with('success', 'Student grade updated.');
    }
}
