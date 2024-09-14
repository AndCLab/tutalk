<?php

namespace Database\Factories;

use App\Models\Classes;
use App\Models\Registration;
use App\Models\Schedule;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    // 'class_fields' => json_encode(Field::inRandomOrder()->limit(3)->pluck('field_name')->toArray())
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $prefix = $this->faker->numberBetween(200, 999);
        $lineNumber = $this->faker->numberBetween(1000, 9999);

        return [
            'fname' => fake()->firstName(),
            'lname' => fake()->lastName(),
            'name' => function (array $attributes) {
                return $attributes['fname'] . ' ' . $attributes['lname'];
            },
            'email' => fake()->unique()->safeEmail(),
            'address' => fake()->address(),
            'zip_code' => fake()->randomNumber(5, true),
            'phone_prefix' => '+63',
            'phone_number' => '956' . $prefix . $lineNumber,
            'is_stepper' => false,
            'user_type' => $this->faker->randomElement(['tutee', 'tutor']),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (User $user) {
            if ($user->user_type == 'tutee') {
                $user->tutees()->create([
                    'user_id' => $user->id,
                    'grade_level' => fake()->randomElement(['highschool', 'college']),
                ]);
            } elseif ($user->user_type == 'tutor') {
                $user->tutors()->create([
                    'user_id' => $user->id,
                    'bio' => fake()->paragraph(2),
                    'work' => fake()->word(),
                ]);
            }
        });
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}