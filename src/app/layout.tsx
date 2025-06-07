import type { Metadata } from "next";
import { Nunito_Sans, Merriweather } from "next/font/google";
import "./globals.css";
import NavigationBar from "@/components/NavigationBar";

// Font configuration for Nunito Sans
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito-sans", // CSS variable for Nunito Sans
});

// Font configuration for Merriweather
const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-merriweather", // CSS variable for Merriweather
});

// Metadata for the application
export const metadata: Metadata = {
  title: "EcoScan",
  description: "Scan products to find their eco-friendly alternatives!",
};

// Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunitoSans.variable} ${merriweather.variable}`} // Apply font variables to HTML element
    >
      <body>
        <NavigationBar />
        {children}
      </body>
    </html>
  );
}
