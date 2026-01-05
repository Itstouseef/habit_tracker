<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// Import the User model for the relationship
use App\Models\User;

class Goal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',      // CRITICAL: Must be here to save the owner
        'title', 
        'description', 
        'completed', 
        'duration_ms',
        'started_at',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'started_at' => 'datetime',
    ];

    /**
     * Relationship: A goal belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}