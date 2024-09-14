<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Fields;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Fields>
 */
class FieldsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = Fields::class;

    public function definition(): array
    {
        $fields = [
            'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
            'Engineering', 'Medicine', 'Psychology', 'Economics', 'Sociology',
            'History', 'Geography', 'Political Science', 'Philosophy', 'Arts',
            'Literature', 'Law', 'Business Administration', 'Statistics',
            'Environmental Science', 'Architecture', 'Music', 'Theatre',
            'Cultural Studies', 'Religious Studies', 'Anthropology', 'Public Health',
            'Criminal Justice', 'Journalism', 'Education', 'Social Work',
            'International Relations', 'Mathematical Finance', 'Nursing',
            'Biochemistry', 'Neuroscience', 'Veterinary Medicine', 'Marine Biology',
            'Astronomy', 'Astronautics', 'Robotics', 'Artificial Intelligence',
            'Data Science', 'Cybersecurity', 'Genetics', 'Environmental Engineering',
            'Urban Planning', 'Agriculture', 'Forestry', 'Meteorology', 'Linguistics',
            'Film Studies', 'Graphic Design', 'Interior Design', 'Fashion Design',
            'Sports Science', 'Biomedical Engineering', 'Materials Science',
            'Oceanography', 'Quantum Physics', 'Microbiology', 'Zoology',
            'Ecology', 'Public Administration', 'Supply Chain Management',
            'Hospitality Management', 'Tourism Studies'
        ];

        $fieldCount = 3; // Number of unique fields to select

        // ensure we don't exceed the number of available fields
        $fieldCount = min($fieldCount, count($fields));

        // shuffle the array to ensure randomness
        shuffle($fields);

        // get the first $fieldCount elements
        $selectedFields = array_slice($fields, 0, $fieldCount);

        return [
            'user_id' => $this->faker->numberBetween(1, 50),
            'field_name' => $this->faker->randomElement($selectedFields),
            'active_in' => $this->faker->randomElement(['tutor', 'tutee'])
        ];
    }
}
