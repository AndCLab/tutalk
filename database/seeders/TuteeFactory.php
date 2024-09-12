<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Tutee;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tutee>
 */
class TuteeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

     protected $model = Tutee::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'grade_level' => $this->faker->randomElement(['highschool', 'college']),
        ];
    }
}
