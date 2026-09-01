import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Cognibloom — AI-Powered Adaptive Learning Platform",
  description:
    "Master complex concepts through intelligent AI conversations, interactive learning modes, and real-time activity analytics with Cognibloom.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full bg-slate-50`}>
      <body className="h-full font-sans antialiased text-slate-900 bg-slate-50 flex flex-col min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
