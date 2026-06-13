<?php

namespace App\Helpers;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Log;

class HandleImageHelper
{

    public static function questionImageUpload($request, $questionBankModel, $exam_sets_code, $question_type, $suffix = null)
    {
        if ($request->hasFile('question_image')) {
            // Validate the uploaded file
            $validatedImage = $request->validate([
                'question_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:3072',
            ], [
                'question_image.image' => 'File must be a jpeg, png, jpg, gif or webp.',
                'question_image.max' => 'File size should not exceed 3MB.',
            ]);

            $questionImg = $questionBankModel->question_image;  // Get current profile image name

            if ($questionImg) {
                $newImageFileName = $validatedImage['question_image']->getClientOriginalName();

                if ($newImageFileName !== $questionImg) {
                    $oldImagePath = public_path("storage/uploads/questionbank/questionimage/{$questionImg}");

                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);  // Delete the old image file
                    }

                    // Process the new image
                    $uploadedFile = $validatedImage['question_image'];
                    $manager = new ImageManager(new Driver());  // Create ImageManager instance
                    $editedImage = $manager->read($uploadedFile);  // Read the uploaded file
                    $timestamp = now()->format('YmdHis');
                    $extension = $uploadedFile->getClientOriginalExtension();
                    $fileName = "{$exam_sets_code}-{$question_type}-{$suffix}-{$timestamp}.{$extension}";
                    // Save the new image to the profile folder
                    $editedImage->save("storage/uploads/questionbank/questionimage/{$fileName}");
                    return $fileName;
                } else {
                    return $questionImg; // If the file name is the same, return the existing image name
                }
            } else {
                /* Process new question Image */
                $uploadedFile = $validatedImage['question_image'];
                $manager = new ImageManager(new Driver());  // Create ImageManager instance
                $editedImage = $manager->read($uploadedFile);  // Read the uploaded file
                $timestamp = now()->format('YmdHis');  // Create a timestamp for unique naming
                $extension = $uploadedFile->getClientOriginalExtension();  // Get file extension
                $fileName = "{$exam_sets_code}-{$question_type}-{$suffix}-{$timestamp}.{$extension}";
                // Save the new image to the profile folder
                $editedImage->save("storage/uploads/questionbank/questionimage/{$fileName}");
                return $fileName;
            }
        } else {
            // If no file is uploaded, use the existing file path
            return $questionBankModel->question_image; // Return existing image path
        }
    }

    public static function choicesImageUpload($request, $questionBankModel, $exam_sets_code, $question_type)
    {
        $choices = $request->input('choices', []);
        $processedChoices = [];

        // Get existing choices from database
        $existingChoices = [];
        if ($questionBankModel->choices) {
            $existingChoices = json_decode($questionBankModel->choices, true) ?: [];
        }


        foreach ($choices as $index => $choice) {
            $processedChoice = [
                'text' => $choice['text'] ?? null,
                'image' => null,
                'response' => $choice['response'] ?? null, /* if question_type was matching_type */
            ];

            $existingImageName = $existingChoices[$index]['image'] ?? null;

            // Check if this choice has a new image with dataUrl (newly uploaded)
            if (isset($choice['image']) && is_array($choice['image']) && isset($choice['image']['dataUrl'])) {
                try {
                    $imageData = $choice['image'];
                    $base64Data = $imageData['dataUrl'];

                    // Extract the base64 data (remove data:image/...;base64, prefix)
                    $base64String = preg_replace('#^data:image/\w+;base64,#i', '', $base64Data);
                    $decodedImage = base64_decode($base64String);

                    if ($decodedImage !== false) {
                        // Delete existing image if it exists
                        if ($existingImageName) {
                            $oldImagePath = public_path("storage/uploads/questionbank/choices/{$existingImageName}");
                            if (file_exists($oldImagePath)) {
                                unlink($oldImagePath);  // Delete the old image file
                            }
                        }

                        // Process the new image
                        $manager = new ImageManager(new Driver());
                        $editedImage = $manager->read($decodedImage);

                        // Generate filename
                        $timestamp = now()->format('YmdHis') . substr(microtime(true), 11, 3);
                        $extension = pathinfo($imageData['name'], PATHINFO_EXTENSION) ?: 'jpg';
                        $fileName = "{$exam_sets_code}-{$question_type}-{$timestamp}.{$extension}"; //-{$index}
                        Log::info($fileName);

                        // Create directory if it doesn't exist
                        $uploadPath = public_path('storage/uploads/questionbank/choices');
                        if (!file_exists($uploadPath)) {
                            mkdir($uploadPath, 0755, true);
                        }

                        // Save the image
                        $editedImage->save("{$uploadPath}/{$fileName}");
                        $processedChoice['image'] = $fileName;
                    }
                } catch (\Exception $e) {
                    Log::error('Error processing choice image', [
                        'error' => $e->getMessage(),
                        'choice_index' => $index
                    ]);
                    // Keep existing image if new upload fails
                    $processedChoice['image'] = $existingImageName;
                }
            }
            // Check if choice has existing image (string filename) - keep it
            else if (isset($choice['image']) && is_string($choice['image'])) {
                $processedChoice['image'] = $choice['image'];
            }
            // Check if choice image is null (image was removed)
            else if (isset($choice['image']) && $choice['image'] === null) {
                // Delete existing image if it exists
                if ($existingImageName) {
                    $oldImagePath = public_path("storage/uploads/questionbank/choices/{$existingImageName}");
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);  // Delete the old image file
                    }
                }
                $processedChoice['image'] = null;
            }
            // No image data in choice, keep existing image if available
            else {
                $processedChoice['image'] = $existingImageName;
            }

            $processedChoices[] = $processedChoice;
        }

        return $processedChoices;
    }
}
