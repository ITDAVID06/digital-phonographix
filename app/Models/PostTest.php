<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostTest extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function students()
    {
        return $this->belongsToMany(Student::class, 'post_test_student')
            ->withPivot(['user_id', 'raw_score', 'calculated_score'])
            ->withTimestamps();
    }
}
