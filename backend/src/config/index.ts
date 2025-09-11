export const JWT_SECRET: string = process.env.JWT_SECRET || (() => {
  throw new Error('Missing JWT_SECRET in environment variables');
})();

// Google
export const GOOGLE_CLIENT_ID : string = process.env.GOOGLE_CLIENT_ID || (() => {
  throw new Error('Missing GOOGLE_CLIENT_ID in environment variables');
})();

// Cloudinary
export const CLOUDINARY_CLOUD_NAME : string = process.env.CLOUDINARY_CLOUD_NAME || (() => {
  throw new Error('Missing GOOGLE_CLIENT_ID in environment variables');
})();

export const CLOUDINARY_API_KEY : string = process.env.CLOUDINARY_API_KEY || (() => {
  throw new Error('Missing CLOUDINARY_API_KEY in environment variables');
})();

export const CLOUDINARY_API_SECRET : string = process.env.CLOUDINARY_API_SECRET || (() => {
  throw new Error('Missing CLOUDINARY_API_SECRET in environment variables');
})();

//Redis
export const REDIS_HOST : string = process.env.REDIS_HOST || '127.0.0.1';

export const REDIS_PORT : number =  Number(process.env.REDIS_PORT) || 6379;

export const REDIS_USERNAME : string = process.env.REDIS_USERNAME || (() => {
  throw new Error('Missing REDIS_USERNAME in environment variables');
})();

export const REDIS_PASSWORD : string = process.env.REDIS_PASSWORD || (() => {
  throw new Error('Missing REDIS_PASSWORD in environment variables');
})();

