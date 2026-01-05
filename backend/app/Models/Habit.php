<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\HabitCompletion;
use App\Models\User;

class Habit extends Model
{
    use HasFactory;

    // Added user_id so it can be saved to the database
    protected $fillable = ['user_id', 'name'];

    /**
     * Relationship: Each habit belongs to one user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: One habit has many completion check-ins.
     */
    public function completions()
    {
        return $this->hasMany(HabitCompletion::class);
    }
}