<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // User must be authenticated first
        if (!$request->user()) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    // MATCH THE CASING: 'Admin' (capital A)
    if (strtolower($request->user()->role) !== 'admin') {
        return response()->json(['message' => 'Forbidden - Admin only'], 403);
    }

        return $next($request);
    }
}
