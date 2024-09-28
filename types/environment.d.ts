declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VERCEL?: "1";
      NEXT_PUBLIC_API_DEV?: string;
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
