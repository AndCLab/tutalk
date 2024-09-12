<?php

namespace Database\Factories;

use App\Models\Registration;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Registration>
 */
class RegistrationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = Registration::class;

    public function definition(): array
    {
        // random start date within the next 1 to 4 weeks
        $start_date = Carbon::now()->addWeeks(fake()->numberBetween(1, 4));

        // random end date after the start date, within the same week as the start date
        $end_date = (clone $start_date)->addDays(fake()->numberBetween(1, 6));

        return [
            'start_date' => $start_date,
            'end_date' => $end_date,
        ];
    }
}
