import { getMeal } from "@/app/lib/meal";
import classes from "./page.module.css";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const meal = await getMeal(params.slug);
  
  if (!meal) {
    return {
      title: 'Meal not found',
      description: 'This meal does not exist.'
    };
  }

  return {
    title: meal.title,
    description: meal.summary,
    openGraph: {
      title: meal.title,
      description: meal.summary,
      images: [meal.cloud_image || meal.image]
    },
  };
}

export default async function MealDetails({ params }) {
  const meal = await getMeal(params.slug);

  if (!meal) {
    notFound();
  }

  const formattedInstructions = meal.instructions ? meal.instructions.replace(/\n/g, "<br/>") : '';

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image 
            src={meal.cloud_image || meal.image} 
            alt={meal.title} 
            fill 
            priority
          />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{
            __html: formattedInstructions
          }}
        ></p>
      </main>
    </>
  );
}
