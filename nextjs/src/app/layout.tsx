import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Windows 95",
  description: "DevOps Playground for educational purposes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
