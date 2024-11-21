import Link from "next/link";
import classes from "./page.module.css";
import MealsGrid from "../component/meals/meals-grid";
import { getMeals } from "../lib/meal";
import { Suspense } from "react";
import MealsLoadingPage from "./loading-out";

export const metadata = {
  title: "All Meals",
  description: "Delicious meals, shared by a food-loving community.",
};

async function Meals() {
  const meals = await getMeals();
  return <MealsGrid meals={meals} />;
}
export default function MealsPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious means created
          <span className={classes.highlight}> by you </span>
        </h1>
        <p>Choose your favorite recipes and cook it yourself.</p>
        <p className={classes.cta}>
          <Link href={"/meals/share"}>Share your FAV recipe</Link>
        </p>
      </header>
      <main className={classes.main}>
        <Suspense
          fallback={
            <p className={classes.loading}>Fetching your Delicious Meals....</p>
          }
        >
          <Meals />
        </Suspense>
      </main>
    </>
  );
}
