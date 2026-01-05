<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Goal; 
use App\Models\Habit;
use App\Models\Journal;
use App\Models\HabitCompletion;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * RELATIONSHIPS
     */

    public function goals()
    {
        return $this->hasMany(Goal::class);
    }

    public function habits()
    {
        return $this->hasMany(Habit::class);
    }

    public function journals()
    {
        return $this->hasMany(Journal::class);
    }

    public function habitCompletions()
    {
        return $this->hasMany(HabitCompletion::class);
    }
}