// import sql from "better-sqlite3";
import { Pool } from 'pg';
import { v2 as cloudinary } from 'cloudinary';
import slugify from "slugify";
import { resolve } from "styled-jsx/css";
import xss from "xss";
import fs from "node:fs";
import { error } from "node:console";
import path from 'path'; 

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true
  }
});

// Test database connection
async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected:', result.rows[0]);
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

testConnection();
// let path= process.env.DB_PATH||"meals.db"
// const db = sql(path);
export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  try {
    const extension = meal.image.name.split(".").pop();
    const fileName = `${meal.slug}.${extension}`;

    // Save locally
    const localImagePath = path.join(process.cwd(), 'public', 'images', fileName);
    const bufferImage = await meal.image.arrayBuffer();
    
    // Ensure directory exists
    const directory = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    // Write to local storage
    fs.writeFileSync(localImagePath, Buffer.from(bufferImage));

    // Upload to Cloudinary
    const cloudinaryResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'meals',
          public_id: meal.slug,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Convert ArrayBuffer to Buffer and pipe to Cloudinary
      const buffer = Buffer.from(bufferImage);
      const stream = require('stream');
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);
      bufferStream.pipe(uploadStream);
    });

    // Save to database with both URLs
    const result = await pool.query(
      `INSERT INTO meals(
        title, 
        summary, 
        instructions, 
        creator, 
        creator_email, 
        image, 
        cloud_image,
        slug
      )
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        meal.title,
        meal.summary,
        meal.instructions,
        meal.creator,
        meal.creator_email,
        `/images/${fileName}`,
        cloudinaryResponse.secure_url,
        meal.slug
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error saving meal:', error);
    throw new Error('Failed to save meal');
  }
}

// Update getMeal and getMeals to return cloud_image
export async function getMeal(slug) {
  try {
    const result = await pool.query(
      'SELECT * FROM meals WHERE slug = $1',
      [slug]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Failed to fetch meal');
  }
}

export async function getMeals() {
  try {
    const result = await pool.query('SELECT * FROM meals');
    return result.rows;
  } catch (error) {
    throw new Error('Failed to fetch meals');
  }
}