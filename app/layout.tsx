import './global.css';
import Navbar from '@/components/Navbar';
import { ClerkProvider, RedirectToSignUp, SignedOut } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      secretKey={process.env.CLERK_SECRET_KEY} // Ensure this matches your Clerk setup
    >
      <html lang="en">
        <body>
          <SignedOut>
            <RedirectToSignUp />
          </SignedOut>
          <Navbar />
          <main className="pt-24">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
