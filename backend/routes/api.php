<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\HabitCompletionController;
use App\Http\Controllers\AdminUsersController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| AUTH (PUBLIC)
|--------------------------------------------------------------------------
*/
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| AUTHENTICATED USER ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // -------- Auth --------
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // -------- Goals --------
    Route::get('/goals', [GoalController::class, 'index']);
    Route::post('/goals', [GoalController::class, 'store']);
    Route::put('/goals/{id}', [GoalController::class, 'update']);
    Route::delete('/goals/{id}', [GoalController::class, 'destroy']);

    // -------- Journals --------
    Route::get('/journals', [JournalController::class, 'index']);
    Route::post('/journals', [JournalController::class, 'store']);
    Route::put('/journals/{id}', [JournalController::class, 'update']);
    Route::delete('/journals/{id}', [JournalController::class, 'destroy']);

    // -------- Habits --------
    Route::apiResource('habits', HabitController::class);

    // -------- Habit Completions --------
    Route::get('/habit-completions', [HabitCompletionController::class, 'index']);
    Route::post('/habit-completions', [HabitCompletionController::class, 'store']);

    /*
    |--------------------------------------------------------------------------
    | ADMIN ONLY ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('admin')->prefix('admin')->group(function () {

        Route::get('users', [AdminUsersController::class, 'index']);
        Route::get('users/{id}', [AdminUsersController::class, 'show']);
        Route::post('users', [AdminUsersController::class, 'store']);
        Route::put('users/{id}', [AdminUsersController::class, 'update']);
        Route::delete('users/{id}', [AdminUsersController::class, 'destroy']);

    });
});
