import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AppInitializer } from "@/components/web/app-initializer";
import { cookies } from "next/headers";

import React from "react";

import type { Metadata } from "next";

import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quick Cart",
  description: "No Description",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function userGet() {
  const cookieStore = await cookies();

  const response = await fetch(`${API_URL}/api/users`, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
    credentials: "include",
    cache: "no-store",
  });

  const { success, data, error } = await response.json();

  if (success) {
    return data;
  } else {
    console.error(error);
  }
}

async function productsGet() {
  const response = await fetch(`${API_URL}/api/products`, {
    cache: "no-store",
  });
  const { success, data, error } = await response.json();
  if (success) {
    return data;
  } else {
    console.error(error);
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await userGet();
  const products = await productsGet();

  return (
    <html
      lang="en"
      className={`${geistSans.className} ${geistMono.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full grid grid-rows-[auto_1fr]">
        {children}
        <AppInitializer user={user} products={products} />
        <Toaster />
      </body>
    </html>
  );
}
