import type { Metadata } from "next";
import { Inter, Public_Sans } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Design System · Elias",
  description: "Clinical Precision design system — tokens, styles, and component reference",
};

export default function DesignSystemLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.variable} ${publicSans.variable} min-h-screen`}>
      {children}
    </div>
  );
}
