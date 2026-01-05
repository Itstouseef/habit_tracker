<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Journal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', // CRITICAL: Added to allow saving the owner
        'title',
        'entry',
        'date',
    ];

    // In newer Laravel versions, use $casts instead of $dates
    protected $casts = [
        'date' => 'datetime',
    ];

    /**
     * Relationship: A journal entry belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}