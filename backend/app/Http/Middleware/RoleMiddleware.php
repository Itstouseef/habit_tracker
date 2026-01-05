<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // 1. Check if user is logged in
        // 2. Check if their role matches (Admin or User)
        if (!$request->user() || $request->user()->role !== $role) {
            return response()->json([
                'message' => 'Unauthorized. You do not have ' . $role . ' access.'
            ], 403);
        }

        return $next($request);
    }
}