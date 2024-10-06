declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VERCEL?: "1";
      NEXTAUTH_URL?: string;
      NEXTAUTH_SECRET?: string;
      DB_NAME?: string;
      DB_USER?: string;
      DB_PASSWORD?: string;
      DB_PORT?: string;
    }
  }
}
export {};
