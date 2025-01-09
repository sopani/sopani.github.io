"use server";

import { redirect } from "next/navigation";
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

    // Save the meal and get the returned data including the slug
    const savedMeal = await saveMeal(meal);
    
    // Revalidate both the meals list and the new meal page
    revalidatePath('/meals');
    revalidatePath(`/meals/${savedMeal.slug}`);

    // Redirect to the newly created meal's page
    redirect(`/meals/${savedMeal.slug}`);
    
  } catch (error) {
    console.error('Error in shareMeal:', error);
    return {
      message: error.message || 'Failed to share meal.'
    };
  }
}