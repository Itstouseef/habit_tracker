<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Journal;

class JournalController extends Controller
{
    /**
     * GET /api/journals
     * Fetch only the logged-in user's journal entries.
     */
    public function index(Request $request)
    {
        // Get entries belonging to the user, ordered by latest
        $journals = $request->user()->journals()
                                    ->orderBy('created_at', 'desc')
                                    ->get();
        return response()->json($journals);
    }

    /**
     * POST /api/journals
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'entry' => 'required|string',
        ]);

        // Automatically links the entry to the user via the relationship
        $journal = $request->user()->journals()->create([
            'title' => $request->title,
            'entry' => $request->entry,
            'date' => $request->date ?? now(),
        ]);

        return response()->json($journal, 201);
    }

    /**
     * PUT /api/journals/{id}
     */
    public function update(Request $request, $id)
    {
        // Ensure the journal entry actually belongs to this user
        $journal = $request->user()->journals()->findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'entry' => 'required|string',
        ]);

        $journal->update([
            'title' => $request->title,
            'entry' => $request->entry,
            'date' => $request->date ?? $journal->date,
        ]);

        return response()->json($journal);
    }

    /**
     * DELETE /api/journals/{id}
     */
    public function destroy(Request $request, $id)
    {
        // Prevent users from deleting journals that aren't theirs
        $journal = $request->user()->journals()->findOrFail($id);
        $journal->delete();

        return response()->json(['message' => 'Journal entry deleted']);
    }
}