import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/login",
    "/signup",
    "/email-verification",
    "/sso-callback",
    "/api/trpc(.*)",
    "/api/webhook(.*)"
  ],
  // Routes that can always be accessed, and have no authentication information
  ignoredRoutes: [
    "/api/webhook(.*)",
    "/_next(.*)",
    "/static(.*)",
    "/favicon.ico",
    "/images(.*)"
  ],
  // Enable debug for OAuth troubleshooting
  debug: true,
  afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const loginUrl = new URL('/login', req.url);
      return Response.redirect(loginUrl);
    }

    // If user is signed in and trying to access auth pages or root, redirect to home
    if (auth.userId && ['/login', '/signup', '/'].includes(req.nextUrl.pathname)) {
      return Response.redirect(new URL('/home', req.url));
    }

    // If user is not signed in and trying to access protected routes, redirect to login
    if (!auth.userId && ['/home', '/zoning', '/insights'].includes(req.nextUrl.pathname)) {
      return Response.redirect(new URL('/login', req.url));
    }
  }
});

// Stop Middleware running on static files and API routes
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ]
}; 