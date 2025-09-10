export const JWT_SECRET: string = process.env.JWT_SECRET || (() => {
  throw new Error('Missing JWT_SECRET in environment variables');
})();

export const GOOGLE_CLIENT_ID : string = process.env.GOOGLE_CLIENT_ID || (() => {
  throw new Error('Missing GOOGLE_CLIENT_ID in environment variables');
})();
