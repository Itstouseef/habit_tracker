<?php

namespace App\Http\Controllers;

use App\Models\HabitCompletion;
use Illuminate\Http\Request;

class HabitCompletionController extends Controller
{
    // GET /api/habit-completions?date=YYYY-MM-DD
    public function index(Request $request) {
        $date = $request->query('date');
        $userId = $request->user()->id;

        // Only return completions that belong to the logged-in user
        return HabitCompletion::where('user_id', $userId)
                                ->where('date', $date)
                                ->get();
    }

    // POST /api/habit-completions
    public function store(Request $request) {
        $request->validate([
            'habit_id' => 'required|exists:habits,id',
            'date' => 'required|date',
            'completed' => 'required|boolean'
        ]);

        $userId = $request->user()->id;

        // Security check: Ensure the habit being completed actually belongs to this user
        $habit = $request->user()->habits()->findOrFail($request->habit_id);

        $completion = HabitCompletion::updateOrCreate(
            [
                'user_id' => $userId, // Link to the user
                'habit_id' => $habit->id,
                'date' => $request->date
            ],
            [
                'completed' => $request->completed
            ]
        );

        return response()->json($completion, 201);
    }
}