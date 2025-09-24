import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SaaS Notes",
  description: "Multi-tenant SaaS Notes app with Next.js + Prisma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
