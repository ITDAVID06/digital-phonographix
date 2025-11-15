<?php

namespace App\Http\Controllers;

use App\Models\Games;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GamesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('games/Index');
    }

    public function answerKey(Request $request)
    {
        $game = (string) $request->query('game', 'fat-cat-sat');
        $variant = $request->query('variant', 'pretest');

        // Two-column word lists, per your spec
        switch ($game) {
            case 'bug-on-jug':
                $title = 'Bug on Jug';
                $columns = [
                    ['rug', 'bug', 'dug', 'dig', 'rig'],
                    // Note: original message had "bbig"; using "big" to match your data elsewhere.
                    ['big', 'jig', 'jug', 'hug'],
                ];
                break;

            case 'ben-bun':
                $title = 'Ben Bun';
                $columns = [
                    ['let', 'wet', 'vet', 'net', 'nut'],
                    ['but', 'buzz', 'bun', 'Ben', 'bell'],
                ];
                break;

            case 'fat-cat-sat':
            default:
                $title = 'Fat Cat Sat';
                $columns = [
                    ['cot', 'pot', 'pat', 'fat', 'mat', 'cat', 'sat', 'sap'],
                    ['tap', 'cap', 'map', 'mop', 'sop', 'cop', 'top', 'pop'],
                ];
                break;
        }

        return Inertia::render('tests/code/games/Index', [
            'title' => $title,
            'columns' => $columns,
            'variant' => $variant,
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
    public function show(Games $games)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Games $games)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Games $games)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Games $games)
    {
        //
    }
}
