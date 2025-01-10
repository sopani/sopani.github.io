import { Pool } from 'pg';
import { v2 as cloudinary } from 'cloudinary';
import slugify from "slugify";
import { resolve } from "styled-jsx/css";
import xss from "xss";
import { error } from "node:console";

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

export async function saveMeal(meal) {
  try {
    // 1. Create slug and sanitize
    const slug = slugify(meal.title, { lower: true });
    const sanitizedInstructions = xss(meal.instructions);

    // 2. Upload image directly to Cloudinary
    let cloudinaryResponse;
    try {
      const imageBuffer = await meal.image.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const dataURI = `data:${meal.image.type};base64,${base64Image}`;
      
      cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
        folder: 'meals',
        public_id: slug,
        resource_type: 'auto'
      });
    } catch (uploadError) {
      console.error('Cloudinary upload failed:', uploadError);
      throw new Error('Image upload failed');
    }

    // 3. Save to database using Cloudinary URL only
    const result = await pool.query(
      `INSERT INTO meals (
        slug,
        title,
        summary,
        instructions,
        creator,
        creator_email,
        image,
        cloud_image
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
      RETURNING *`,
      [
        slug,
        meal.title,
        meal.summary,
        sanitizedInstructions,
        meal.creator,
        meal.creator_email,
        cloudinaryResponse.secure_url
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error in saveMeal:', error);
    throw new Error(`Failed to save meal: ${error.message}`);
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