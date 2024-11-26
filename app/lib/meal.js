import sql from "better-sqlite3";
import slugify from "slugify";
import { resolve } from "styled-jsx/css";
import xss from "xss";
import fs from "node:fs";
import { error } from "node:console";

let path= process.env.DB_PATH||"meals.db"
const db = sql(path);

export async function getMeals() {
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
  //   throw new Error('ahh');
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  //   throw new Error('ahh');
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;
  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferImage = await meal.image.arrayBuffer();

  stream.write(Buffer.from(bufferImage), (error) => {
    if (error) {
      throw new Error("saving image error");
    }
  });

  meal.image = `/images/${fileName}`;
  db.prepare(
    `INSERT INTO meals(title, summary,instructions, creator, creator_email,image,slug)
    VALUES(  
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug)
    `
  ).run(meal);
}
