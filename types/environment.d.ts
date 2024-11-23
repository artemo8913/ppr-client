declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VERCEL?: "1";
      NEXTAUTH_URL?: string;
      NEXTAUTH_SECRET?: string;
      ENVIRONMENT?: "PROD" | "DEV";

      // DATABASE SETTINGS
      DB_LOCATION?: "LOCAL" | "REMOTE";

      // DB LOCAL SETTINGS
      DB_HOST_LOCAL?: string;
      DB_NAME_LOCAL?: string;
      DB_PORT_LOCAL?: number;
      DB_USER_LOCAL?: string;
      DB_PASSWORD_LOCAL?: string;

      // DB LOCAL SETTINGS
      DB_HOST_REMOTE?: string;
      DB_NAME_REMOTE?: string;
      DB_PORT_REMOTE?: number;
      DB_USER_REMOTE?: string;
      DB_PASSWORD_REMOTE?: string;
    }
  }
}
export {};
