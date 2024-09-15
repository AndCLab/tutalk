<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tutee extends Model
{
    use HasFactory;

    const GRADE_LEVELS = [
        'Preschool',
        'Kindergarten',
        'Elementary School',
        'Middle School',
        'Highschool',
        'Undergraduate',
        'College'
    ];

    protected $table = 'tutee';

    protected $fillable = ['user_id', 'grade_level'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
