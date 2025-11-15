<?php

use App\Http\Controllers\GamesController;
use App\Http\Controllers\PostTestController;
use App\Http\Controllers\PreTestController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [StudentController::class, 'index'])->name('dashboard');

    Route::controller(PreTestController::class)->group(function () {
        Route::get('/pre-test', 'index')->name('pre-test');
    });

    Route::controller(GamesController::class)->group(function () {
        Route::get('/games', 'index')->name('games');
        Route::get('/games/answer-key', 'answerKey')->name('games.answer-key');
    });

    Route::controller(PostTestController::class)->group(function () {
        Route::get('/post-test', 'index')->name('post-test');
    });

    Route::controller(TestController::class)->group(function () {
        Route::get('/tests/code/teacher', 'index')->name('tests.code.teacher');
    });

    Route::controller(StudentController::class)->group(function () {
        Route::get('/students', 'index')->name('students.index');     
        Route::post('/students', 'store')->name('students.store');    
    });
});

require __DIR__ . '/settings.php';
