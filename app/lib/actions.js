"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meal";
import { revalidatePath } from 'next/cache';

export async function shareMeal(prevState, formData) {
  try {
    // Check if formData exists
    if (!formData) {
      throw new Error('No form data received');
    }

    // Log all form data entries to debug
    console.log('Form data entries:');
    for (const [key, value] of formData.entries()) {
      console.log(key, ':', value);
    }

    const meal = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      instructions: formData.get('instructions'),
      image: formData.get('image'),
      creator: formData.get('name'),
      creator_email: formData.get('email'),
    };

    // Validate all required fields
    if (!meal.title) throw new Error('Title is required');
    if (!meal.summary) throw new Error('Summary is required');
    if (!meal.instructions) throw new Error('Instructions are required');
    if (!meal.creator) throw new Error('Name is required');
    if (!meal.creator_email) throw new Error('Email is required');
    if (!meal.image || !(meal.image instanceof File)) {
      throw new Error('Please provide a valid image');
    }

    await saveMeal(meal);
    revalidatePath('/meals');
    redirect('/meals');
    
  } catch (error) {
    console.error('Error in shareMeal:', error);
    return {
      message: error.message || 'Failed to share meal.'
    };
  }
}