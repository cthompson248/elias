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
  title: "Donor Interview · Elias",
  description: "Blood donation eligibility triage interview",
};

export default function InterviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.variable} ${publicSans.variable} h-full`}>
      {children}
    </div>
  );
}
