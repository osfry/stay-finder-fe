import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Providers from "@/components/Providers";
import AuthHeader from "@/components/AuthHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stay Finder",
  description: "Find a place to stay",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Providers>
          <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
            <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-xl font-bold">
                Stay Finder
              </Link>
              <Link
                href="/host/properties/new"
                className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
              >
                List a stay
              </Link>
              <Link
                href="/host/properties"
                className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
              >
                My properties
              </Link>
              <AuthHeader/>
            </div>
          </header>
          {children}
          <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
            <div className="mx-auto w-full max-w-3xl px-6 py-6 text-sm text-zinc-600 dark:text-zinc-400">
              © {new Date().getFullYear()} Stay Finder
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
