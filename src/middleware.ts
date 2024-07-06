import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    return NextResponse.rewrite(new URL("/", req.url));
  },
  {
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|login|_next/image|.*\\.png$).*)"],
};
