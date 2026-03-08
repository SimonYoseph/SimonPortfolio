import type { Metadata } from "next";
import { Montserrat, Roboto_Mono } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simon Yoseph",
  description: "Interactive Portfolio of Simon Yoseph",
  // icons now set in head.tsx for maximum control
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-black text-white">
      <body
        className={`${montserrat.variable} ${robotoMono.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}

