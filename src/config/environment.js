import 'dotenv/config'

export const env = {
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,

  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,

  BUILD_MODE: process.env.BUILD_MODE,

  AUTHOR: process.env.AUTHOR,
  GEMINI_KEY: process.env.GEMINI_KEY,

  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}