<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecurringSchedule extends Model
{
    use HasFactory;

    protected $table = 'recurring_schedules';

    protected $fillable = [
        'schedule_id',
        'dates',
    ];

    public function schedules()
    {
        return $this->belongsTo(Schedule::class, 'schedule_id');
    }

}
