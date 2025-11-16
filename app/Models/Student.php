<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function grades()
    {
        return $this->belongsToMany(Grade::class, 'grade_student')
            ->withTimestamps();
    }

    public function preTests()
    {
        return $this->belongsToMany(PreTest::class, 'pre_test_student')
            ->withPivot(['user_id', 'raw_score', 'calculated_score'])
            ->withTimestamps();
    }

    public function postTests()
    {
        return $this->belongsToMany(PostTest::class, 'post_test_student')
            ->withPivot(['user_id', 'raw_score', 'calculated_score'])
            ->withTimestamps();
    }
}
