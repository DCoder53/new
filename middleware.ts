import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY, // Ensure this is set in your environment variables
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
