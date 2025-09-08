declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VERCEL?: "1";
      NEXTAUTH_URL?: string;
      NEXTAUTH_SECRET?: string;
      ENVIRONMENT?: "PROD" | "DEV";

      // DB SETTINGS
      DB_HOST?: string;
      DB_NAME?: string;
      DB_PORT?: number;
      DB_USER?: string;
      DB_PASSWORD?: string;
    }
  }
}
export {};
