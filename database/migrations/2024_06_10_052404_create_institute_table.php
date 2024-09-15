<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('institute', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutee_id')->constrained('tutee')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->date('from');
            $table->date('to');
            $table->string('institute');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institute');
    }
};
