<?php

namespace Database\Factories;

use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Schedule>
 */
class ScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = Schedule::class;

    public function definition(): array
    {
        // random start date within the next month
        $start_date = Carbon::now()->addDays(fake()->numberBetween(1, 30));

        // random end date after the start date, within the next two months
        $end_date = (clone $start_date)->addDays(fake()->numberBetween(1, 30));

        return [
            'start_date' => $start_date,
            'end_date' => $end_date,
        ];
    }
}
