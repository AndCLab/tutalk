<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $table = 'schedules';

    protected $fillable = [
        'start_time',
        'end_time',
        'occurrences',
        'frequency',
        'interval',
        'interval_unit'
    ];

    /**
     * Get all of the comments for the Schedule
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function recurring_schedule()
    {
        return $this->hasMany(RecurringSchedule::class);
    }

}
