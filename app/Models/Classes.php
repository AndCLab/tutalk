<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classes extends Model
{
    use HasFactory;

    protected $table = 'classes';

    protected $fillable = [
        'tutor_id',
        'class_name',
        'class_description',
        'class_fields',
        'class_type',
        'class_category',
        'class_location',
        'class_students',
        'class_fee',
        'class_status',
        'schedule_id',
        'registration_id'
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class, 'schedule_id');
    }

    public function registration()
    {
        return $this->belongsTo(Registration::class, 'registration_id');
    }
}
