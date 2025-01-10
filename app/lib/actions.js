"use server";

import { revalidatePath } from "next/cache";
import { saveMeal } from "./meal";

export async function shareMeal(prevState, formData) {
  try {
    // Get image file from form data
    const image = formData.get('image');
    
    // Validate image
    if (!image || !(image instanceof File)) {
      throw new Error('Please provide a valid image.');
    }

    // Create meal object
    const meal = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      instructions: formData.get('instructions'),
      creator: formData.get('name'),
      creator_email: formData.get('email'),
      image: image  // Pass the raw file
    };

    // Save meal (this will handle Cloudinary upload)
    const savedMeal = await saveMeal(meal);

    // Revalidate paths
    revalidatePath('/meals');
    revalidatePath(`/meals/${savedMeal.slug}`);

    // Return success with redirect path
    return {
      status: 'success',
      redirectTo: `/meals/${savedMeal.slug}`
    };

  } catch (error) {
    console.error('Error in shareMeal:', error);
    return {
      status: 'error',
      message: error.message || 'Failed to share meal.'
    };
  }
}