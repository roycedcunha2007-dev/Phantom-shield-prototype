import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phantom Shield",
  description: "Cybersecurity dashboard frontend migration",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
