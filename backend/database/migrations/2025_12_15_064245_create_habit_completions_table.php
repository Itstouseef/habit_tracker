<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('habit_completions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('habit_id');
            $table->date('date');
            $table->boolean('completed')->default(false);
            $table->timestamps();

            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade');

            $table->foreign('habit_id')
                  ->references('id')->on('habits')
                  ->onDelete('cascade');

            // Ensure one completion per user/habit/date
            $table->unique(['user_id', 'habit_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habit_completions');
    }
};
