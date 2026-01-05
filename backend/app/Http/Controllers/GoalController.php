<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Goal;

class GoalController extends Controller
{
    /**
     * Fetch ONLY the goals belonging to the logged-in user.
     */
    public function index(Request $request)
    {
        // This automatically filters the database by user_id
        $goals = $request->user()->goals; 
        return response()->json($goals);
    }

    /**
     * Create a new goal for the logged-in user.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean',
            'duration_ms' => 'nullable|integer',
            'started_at' => 'nullable|date',
        ]);

        // This automatically injects the 'user_id' into the new goal
        $goal = $request->user()->goals()->create($data);

        return response()->json($goal, 201);
    }

    /**
     * Update a goal (but only if it belongs to the user).
     */
   public function update(Request $request, $id)
{
    // 1. Find the goal belonging to this user
    $goal = $request->user()->goals()->findOrFail($id);

    // 2. Validate the data
    $data = $request->validate([
        'title' => 'sometimes|string|max:255',
        'description' => 'nullable|string',
        'completed' => 'boolean', // This is what the "tick" sends
        'duration_ms' => 'nullable|integer',
        'started_at' => 'nullable|date',
    ]);

    // 3. Perform the update
    $goal->update($data);

    // 4. IMPORTANT: Return the fresh data from the database
    return response()->json($goal->fresh(), 200); 
}

    /**
     * Delete a goal.
     */
    public function destroy(Request $request, $id)
    {
        $goal = $request->user()->goals()->findOrFail($id);
        $goal->delete();

        return response()->json(['message' => 'Goal deleted']);
    }
}