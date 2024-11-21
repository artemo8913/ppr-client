declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VERCEL?: "1";
      NEXTAUTH_URL?: string;
      NEXTAUTH_SECRET?: string;
      ENVIRONMENT?: "PROD" | "DEV";
      DB_NAME?: string;
      DB_USER?: string;
      DB_HOST?: string;
      DB_PASSWORD?: string;
      DB_PORT?: string;
    }
  }
}
export {};
