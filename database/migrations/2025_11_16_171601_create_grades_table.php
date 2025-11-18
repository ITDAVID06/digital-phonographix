<?php

use App\Models\Grade;
use App\Models\PostTest;
use App\Models\PreTest;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
    {
        // grades table
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // e.g. 1.10
            $table->decimal('multiplier', 5, 2)->default(1.00);
            $table->timestamps();
        });

        // grade_student pivot
        Schema::create('grade_student', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Grade::class)
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignIdFor(Student::class)
                ->constrained()
                ->cascadeOnDelete();

            $table->boolean('active')->default(true);

            $table->timestamps();
        });

        // pre_test_student pivot
        Schema::create('pre_test_student', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(PreTest::class)
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignIdFor(Student::class)
                ->constrained()
                ->cascadeOnDelete();

            // teacher who entered the score
            $table->foreignIdFor(User::class)
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignIdFor(Grade::class)
                ->constrained()
                ->cascadeOnDelete();

            $table->unsignedInteger('raw_score');
            $table->decimal('calculated_score', 8, 2)->nullable();

            $table->timestamps();
        });

        // post_test_student pivot
        Schema::create('post_test_student', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(PostTest::class)
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignIdFor(Student::class)
                ->constrained()
                ->cascadeOnDelete();

            // teacher who entered the score
            $table->foreignIdFor(User::class)
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignIdFor(Grade::class)
                ->constrained()
                ->cascadeOnDelete();

            $table->unsignedInteger('raw_score');
            $table->decimal('calculated_score', 8, 2)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_test_student');
        Schema::dropIfExists('pre_test_student');
        Schema::dropIfExists('grade_student');
        Schema::dropIfExists('grades');
    }
};
