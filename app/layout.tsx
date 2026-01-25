import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-inter", // Reusing the variable name to match globals.css or I should update globals.css. I'll stick to variable name usage.
  display: 'swap',
});

export const metadata: Metadata = {
  title: "AI Idea Validator",
  description: "Get a brutal, honest, AI-powered evaluation of your startup idea.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
