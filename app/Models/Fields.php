<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User;

class Fields extends Model
{
    use HasFactory;

    protected $table = 'fields';

    protected $fillable = ['user_id', 'field_name', 'active_in', 'class_count'];

    public function users()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
