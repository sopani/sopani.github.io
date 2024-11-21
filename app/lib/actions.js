"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meal";
import { revalidatePath } from "next/cache";

export async  function shareMeal(formadata) {
   
    const meal = {
      title: formadata.get("title"),
      summary: formadata.get("summary"),
      image: formadata.get("image"),
      instructions: formadata.get("instructions"),
      creator:formadata.get('name'),
      creator_email:formadata.get('email')

    };
   await saveMeal(meal)
   revalidatePath('/meals');
   redirect('/meals');
    // console.log(meal);

  }