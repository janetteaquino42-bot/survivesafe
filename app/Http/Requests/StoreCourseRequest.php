<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'course_title' => 'required|string|max:255',
            'course_subtitle' => 'nullable|string|max:255',
            'course_code' => 'required|string|max:20|unique:courses,course_code',
            // Add other rules as needed
        ];
        }

        /**
         * Get custom messages for validator errors.
         *
         * @return array<string, string>
         */
        public function messages(): array
        {
        return [
            'course_title.required' => 'The course title is required.',
            'course_title.string' => 'The course title must be a string.',
            'course_title.max' => 'The course title may not be greater than 255 characters.',
            'course_subtitle.string' => 'The course subtitle must be a string.',
            'course_subtitle.max' => 'The course subtitle may not be greater than 255 characters.',
            'course_code.required' => 'The course code is required.',
            'course_code.string' => 'The course code must be a string.',
            'course_code.max' => 'The course code may not be greater than 20 characters.',
            'course_code.unique' => 'The course code has already been taken.',
        ];
    }
}
