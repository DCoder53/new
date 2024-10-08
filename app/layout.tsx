// layout.tsx
import "./global.css"
import Navbar from "@/components/Navbar";
import { ClerkProvider , RedirectToSignUp , SignedOut } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header>
            <SignedOut>
              <RedirectToSignUp />
            </SignedOut>
          </header>
          <Navbar />
          <main className="pt-24">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
