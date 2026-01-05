<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUsersController extends Controller
{
    /**
     * Display a listing of all users.
     */
    public function index()
    {
        // Fetch all users to display in the React Admin Table
        return response()->json(User::all());
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    /**
     * Create a new user from the Admin Panel.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:User,Admin',
            'status'   => 'required|in:Active,Inactive',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => $data['role'],
            'status'   => $data['status'],
        ]);

        return response()->json($user, 201);
    }

    /**
     * Update a user's details.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $currentUser = auth()->user();

        $data = $request->validate([
            'name'   => 'sometimes|string|max:255',
            'email'  => 'sometimes|email|unique:users,email,' . $id,
            'role'   => 'sometimes|in:User,Admin',
            'status' => 'sometimes|in:Active,Inactive',
        ]);

        // LOGIC: Prevent the current Admin from demoting themselves or deactivating themselves
        if ($currentUser->id == $id) {
            if (isset($data['role']) && $data['role'] !== 'Admin') {
                return response()->json(['message' => 'You cannot demote yourself from Admin.'], 403);
            }
            if (isset($data['status']) && $data['status'] !== 'Active') {
                return response()->json(['message' => 'You cannot deactivate your own Admin account.'], 403);
            }
        }

        $user->update($data);

        return response()->json([
            'message' => 'User updated successfully',
            'user'    => $user
        ]);
    }

    /**
     * Remove a user from the database.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $currentUser = auth()->user();

        // LOGIC: Prevent Admin from deleting their own account
        if ($currentUser->id == $id) {
            return response()->json(['message' => 'Deletion denied. You cannot delete your own admin account.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}