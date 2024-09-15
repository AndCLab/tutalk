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
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained('tutor')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->string('class_name');
            $table->text('class_description');
            $table->json('class_fields');
            $table->enum('class_type', ['virtual', 'physical']);
            $table->enum('class_category', ['individual', 'group']);
            $table->string('class_location');
            $table->integer('class_students')->default(1);
            $table->decimal('class_fee')->default(0);

            // 1 = opened, 0 = closed
            $table->boolean('class_status')->default(1);

            $table->foreignId('schedule_id')
                ->constrained('schedules')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreignId('registration_id')
                ->nullable()
                ->constrained('registrations')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
