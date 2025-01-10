"use server";

import { saveMeal } from "./meal";
import { revalidatePath } from "next/cache";

export async function shareMeal(prevState, formData) {
  try {
    const meal = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      instructions: formData.get('instructions'),
      creator: formData.get('name'),
      creator_email: formData.get('email'),
      image: formData.get('image')
    };

    const savedMeal = await saveMeal(meal);
    
    // Revalidate paths
    revalidatePath('/meals');
    revalidatePath(`/meals/${savedMeal.slug}`);

    // Return the path instead of using redirect
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