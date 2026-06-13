<?php

namespace App\Services;

use App\Models\User;
use App\Models\Admin\Courses\CoursesModel;
use App\Models\Student\Courses\CoursesEnrolledModel;
use App\Models\Trainer\Courses\CoursesAssignedModel;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserService
{
    /**
     * Get all users with optional search, role, and status filters.
     * Supports pagination.
     *
     * @param array $filters
     * @return Collection|LengthAwarePaginator
     */
    public static function getUsers(array $filters = []): Collection|LengthAwarePaginator
    {
        $query = User::query();

        // Eager load courses if role is trainer
        if (!empty($filters['role']) && $filters['role'] === 'trainer') {
            $query->with('assignedCourses');
        }

        // Eager load courses if role is student
        if (!empty($filters['role']) && $filters['role'] === 'student') {
            $query->with('enrolledCourses');
        }

        // Apply keyword search
        if (!empty($filters['keyword'])) {
            $keyword = $filters['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('full_name', 'like', "%$keyword%")
                    ->orWhere('email', 'like', "%$keyword%");
            });
        }

        // Filter by role
        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        // Filter by status
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filter by course_id for trainers
        if (!empty($filters['courses_id']) && (!empty($filters['role']) && $filters['role'] === 'trainer')) {
            $courseId = $filters['courses_id'];
            $query->whereHas('assignedCourses', function ($q) use ($courseId) {
                $q->where('courses.courses_id', $courseId);
            });
        }

        // Filter by course_id for students
        if (!empty($filters['courses_id']) && (!empty($filters['role']) && $filters['role'] === 'student')) {
            $courseId = $filters['courses_id'];
            $query->whereHas('courses_enrolled_model', function ($q) use ($courseId) {
                $q->where('courses_id', $courseId);
            });
        }

        return $query->get();
    }

    /**
     * Get trainers with optional search, and status filters.
     * Supports pagination.
     *
     * @param array $filters
     * @return Collection|LengthAwarePaginator
     */
    public static function getTrainers(array $filters = []): Collection|LengthAwarePaginator
    {
        $query = User::query()->with('assignedCourses')->where('role', 'trainer');

        // Apply keyword search
        if (!empty($filters['keyword'])) {
            $keyword = $filters['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('full_name', 'like', "%$keyword%")
                    ->orWhere('email', 'like', "%$keyword%");
            });
        }

        // Filter by status
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filter by course_id for trainers
        if (!empty($filters['courses_id'])) {
            $courseId = $filters['courses_id'];
            $query->whereHas('assignedCourses', function ($q) use ($courseId) {
                $q->where('courses.courses_id', $courseId);
            });
        }

        return $query->get();
    }

    /**
     * Get all students with optional search, role, and status filters.
     * Supports pagination.
     *
     * @param array $filters
     * @return Collection|LengthAwarePaginator
     */
    public static function getStudents(array $filters = []): Collection|LengthAwarePaginator
    {
        $query = User::query()
            ->with([
            'courses_enrolled_model' => function ($q) {
                $q->with('courses_model');
            }
            ])
            ->where('role', 'student');

        // Filter by user_id if provided
        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        // Apply keyword search
        if (!empty($filters['keyword'])) {
            $keyword = $filters['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('full_name', 'like', "%$keyword%")
                    ->orWhere('email', 'like', "%$keyword%");
            });
        }

        // Filter by status
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }else{
            // Default to 'approved' status if not provided
            $query->whereNot('status', 'pending');
        }

        // Filter by course_id for students
        if (!empty($filters['courses_id'])) {
            $courseId = $filters['courses_id'];
            $query->whereHas('courses_enrolled_model', function ($q) use ($courseId) {
                $q->where('courses_id', $courseId);
            });
        }

        return $query->get();
    }

    /**
     * Get students assigned to a specific trainer.
     *
     * @param int $trainerId
     * @param array $filters
     * @return Collection|LengthAwarePaginator
     */
    public static function getStudentsByTrainer(int $trainerId, array $filters = []): Collection|LengthAwarePaginator
    {
        // Validate and extract filters
        $status = $filters['status'] ?? null;
        $keyword = $filters['keyword'] ?? null;
        $courseId = $filters['courses_id'] ?? null;

        // Get course IDs assigned to the trainer
        $assignedCourseIds = CoursesAssignedModel::where('trainer_id', $trainerId)
            ->pluck('courses_id')
            ->toArray();

        $students = User::where('role', 'student')
            ->when($status !== null, function ($q) use ($status) {
                $q->where('status', $status);
            })
            ->when($keyword, function ($q) use ($keyword) {
                $q->where(function ($sq) use ($keyword) {
                    $sq->where('full_name', 'like', "%{$keyword}%")
                        ->orWhere('email', 'like', "%{$keyword}%");
                });
            })
            ->when($courseId !== null, function ($q) use ($courseId) {
                $q->whereHas('courses_enrolled_model', function ($sq) use ($courseId) {
                    $sq->where('courses_id', $courseId);
                });
            }, function ($q) use ($assignedCourseIds) {
                $q->whereHas('courses_enrolled_model', function ($sq) use ($assignedCourseIds) {
                    $sq->whereIn('courses_id', $assignedCourseIds);
                });
            })
            ->with(['enrolledCourses' => function ($q) use ($courseId, $assignedCourseIds) {
                if ($courseId !== null) {
                    $q->where('courses_enrolled.courses_id', $courseId);
                } else {
                    $q->whereIn('courses.courses_id', $assignedCourseIds);
                }
            }])
            ->get();

        return $students;
    }

    /**
     * Get a specific user with related data.
     *
     * @param int $id
     * @return User|null
     */
    public static function findWithRelations(int $id): ?User
    {
        return User::with(['courses', 'classes'])->find($id);
    }

    /**
     * Get trainers assigned to a course.
     *
     * @param int $courseId
     * @return Collection
     */
    public static function getTrainersByCourse(int $courseId, array $filters = []): Collection
    {
        // Validate and extract filters
        $status = $filters['status'] ?? null;
        $keyword = $filters['keyword'] ?? null;

        $trainers = User::where('role', 'trainer')
            ->whereHas('assignedCourses', function ($query) use ($courseId) {
                $query->where('courses_assigned.courses_id', $courseId);
            })
            ->when($status !== null, function ($q) use ($status) {
                $q->where('status', $status);
            })
            ->when($keyword, function ($q) use ($keyword) {
                $q->where(function ($sq) use ($keyword) {
                    $sq->where('full_name', 'like', "%{$keyword}%")
                        ->orWhere('email', 'like', "%{$keyword}%");
                });
            })
            ->with(['assignedCourses' => function ($query) use ($courseId) {
                $query->where('courses_assigned.courses_id', $courseId)
                    ->select('trainer_id', 'courses_assigned.courses_id', 'courses_assigned.created_at', 'courses_assigned_id');
            }])
            ->get();

        return $trainers;
    }

    /**
     * Get students enrolled in a course.
     *
     * @param int $courseId
     * @return Collection
     */
    public static function getStudentsByCourse(int $courseId, array $filters = []): Collection
    {
        // Validate and extract filters
        $status = $filters['status'] ?? null;
        $keyword = $filters['keyword'] ?? null;

        $students = User::where('role', 'student')
            ->whereHas('courses_enrolled_model', function ($query) use ($courseId) {
                $query->where('courses_enrolled.courses_id', $courseId);
            })
            ->when($status !== null, function ($q) use ($status) {
                $q->where('status', $status);
            })
            ->when($keyword, function ($q) use ($keyword) {
                $q->where(function ($sq) use ($keyword) {
                    $sq->where('full_name', 'like', "%{$keyword}%")
                        ->orWhere('email', 'like', "%{$keyword}%");
                });
            })
            ->with(['courses_enrolled_model' => function ($query) use ($courseId) {
                $query->where('courses_enrolled.courses_id', $courseId)
                    ->select('courses_enrolled_id', 'student_id', 'courses_id', 'course_expires_at', 'courses_enrolled.created_at');
            }])
            ->get();

        return $students;
    }

    /**
     * Get all enrollees with optional filters.
     *
     * @param array $filters
     * @return Collection|LengthAwarePaginator
     */
    public static function getEnrollees(array $filters = []): Collection|LengthAwarePaginator
    {
        $query = CoursesEnrolledModel::query()
            ->with(['user_model_student_id', 'courses_model'])->where('status', 'pending');

        // Filter by user_id if provided
        if (!empty($filters['user_id'])) {
            $query->where('student_id', $filters['user_id']);
        }

        // Apply keyword search on user fields
        if (!empty($filters['keyword'])) {
            $keyword = $filters['keyword'];
            $query->whereHas('user_model_student_id', function ($q) use ($keyword) {
                $q->where('full_name', 'like', "%$keyword%")
                    ->orWhere('email', 'like', "%$keyword%");
            });
        }

        // Filter by course_id
        if (!empty($filters['courses_id'])) {
            $courseId = $filters['courses_id'];
            $query->where('courses_id', $courseId);
        }

        return $query->get();
    }

    public static function getEnrolleesByTrainer(array $filters = []): Collection|LengthAwarePaginator
    {
        // Get the current logged-in user (trainer)
        $trainerId = auth()->id();

        // Get the course IDs assigned to this trainer
        $assignedCourseIds = CoursesAssignedModel::where('trainer_id', $trainerId)
            ->pluck('courses_id')
            ->toArray();

        // Build the query for enrollees in those courses
        $query = CoursesEnrolledModel::query()
            ->with(['user_model_student_id', 'courses_model'])
            ->where('status', 'pending')
            ->whereIn('courses_id', $assignedCourseIds);

        // Filter by user_id if provided
        if (!empty($filters['user_id'])) {
            $query->where('student_id', $filters['user_id']);
        }

        // Apply keyword search on user fields
        if (!empty($filters['keyword'])) {
            $keyword = $filters['keyword'];
            $query->whereHas('user_model_student_id', function ($q) use ($keyword) {
                $q->where('full_name', 'like', "%$keyword%")
                    ->orWhere('email', 'like', "%$keyword%");
            });
        }

        // Filter by course_id
        if (!empty($filters['courses_id'])) {
            $courseId = $filters['courses_id'];
            $query->where('courses_id', $courseId);
        }

        return $query->get();
    }
}
