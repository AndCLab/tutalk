<?php

namespace Database\Factories;

use App\Models\Classes;
use App\Models\ClassRoster;
use App\Models\Tutee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClassRoster>
 */
class ClassRosterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = ClassRoster::class;

    public function definition(): array
    {
        $tutee = Tutee::inRandomOrder()->first();
        $class = null;

        // loop until a class that meets the condition is found
        do {
            $class = Classes::inRandomOrder()->first();

            if ($class->class_category == 'individual' && $class->class_students > 0) {
                $indi_class = $class;
                $class->class_students--;
                $class->save();
                break;
            } elseif ($class->class_category == 'group' && $class->class_students > 0) {
                $group_class = $class;
                $class->class_students--;
                $class->save();
                break;
            }
        } while (true);

        return [
            'class_id' => $group_class->id ?? $indi_class->id,
            'tutee_id' => $tutee->id,
            'attendance' => false,
            'payment_status' => false,
        ];
    }

}
