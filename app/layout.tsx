import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lead Capture | Secco Squared",
  description: "Get in touch with the Secco Squared team.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-gray-50 font-[family-name:var(--font-geist-sans)]">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
            <Link
              href="/"
              className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
            >
              Secco Squared
            </Link>
            <nav>
              <Link
                href="/leads"
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                View Leads
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex flex-1 flex-col">{children}</main>

        <footer className="border-t border-gray-200 bg-white py-6">
          <p className="text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Secco Squared. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
