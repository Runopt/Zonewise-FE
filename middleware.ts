import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Only these routes will be accessible without authentication
  publicRoutes: [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/sso-callback",
  ],
  
  // Routes that don't require authentication information
  ignoredRoutes: [
    "/api/webhook(.*)",
    "/_next(.*)",
    "/static(.*)",
    "/favicon.ico",
    "/images(.*)",
  ],

  // Enable debug for OAuth troubleshooting
  debug: true,

  afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      // Redirect them to login
      const loginUrl = new URL('/login', req.url);
      return Response.redirect(loginUrl);
    }

    // If the user is signed in and trying to access auth pages, redirect them home
    if (auth.userId && ['/login', '/signup', '/'].includes(req.nextUrl.pathname)) {
      const homeUrl = new URL('/home', req.url);
      return Response.redirect(homeUrl);
    }

    // If user is on the root path (/), redirect to home
    if (auth.userId && req.nextUrl.pathname === '/') {
      const homeUrl = new URL('/home', req.url);
      return Response.redirect(homeUrl);
    }
  }
});

// Configure matcher to handle all routes
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 