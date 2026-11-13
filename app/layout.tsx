import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoxArena | Independent Public Opinion",
  description: "A civic, non-binding public opinion platform. Your voice, on the record.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}