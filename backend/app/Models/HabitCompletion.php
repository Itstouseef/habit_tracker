<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Habit;
use App\Models\User;

class HabitCompletion extends Model
{
    use HasFactory;

    // Added user_id to allow saving the owner of this completion
    protected $fillable = ['user_id', 'habit_id', 'date', 'completed'];

    /**
     * Relationship: A completion belongs to a specific user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: A completion belongs to a specific habit.
     */
    public function habit()
    {
        return $this->belongsTo(Habit::class);
    }
}