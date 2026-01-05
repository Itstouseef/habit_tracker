<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use Illuminate\Http\Request;

class HabitController extends Controller
{
    /**
     * GET /api/habits
     * Fetch ONLY the habits for the currently logged-in user.
     */
    public function index(Request $request) {
        // Instead of Habit::all(), we fetch only the user's habits
        return response()->json($request->user()->habits);
    }

    /**
     * POST /api/habits
     * Create a new habit linked to the authenticated user.
     */
    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            // Add other fields here if your UI has them (e.g., 'color', 'icon')
        ]);

        // Using the relationship ensures user_id is set automatically
        $habit = $request->user()->habits()->create($data);

        return response()->json($habit, 201);
    }

    /**
     * PUT /api/habits/{id}
     * Update the habit ONLY if it belongs to the user.
     */
    public function update(Request $request, $id) {
        // We find the habit within the user's specific collection for security
        $habit = $request->user()->habits()->findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
        ]);

        $habit->update($data);

        return response()->json($habit);
    }

    /**
     * DELETE /api/habits/{id}
     */
    public function destroy(Request $request, $id) {
        $habit = $request->user()->habits()->findOrFail($id);
        $habit->delete();

        return response()->json(['message' => 'Habit deleted successfully'], 200);
    }
}