const MONGODB_DB: string = process.env.DB_NAME!;
const MONGO_URI: string = process.env.MONGO_URI!;
const DEVELOPMENT_ENV: string = process.env.NODE_ENV!;

export { MONGODB_DB, MONGO_URI, DEVELOPMENT_ENV };
