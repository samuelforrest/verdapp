import type { Metadata } from "next";
import { Montserrat, Lora } from "next/font/google";
import "./globals.css";
import NavigationBar from "@/components/NavigationBar";
import Head from "next/head";

// Initialize Montserrat font with specified subsets, display strategy, and CSS variable.
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap", // Ensures text remains visible during font loading by swapping to the custom font once ready.
  variable: "--font-montserrat", // Assigns the font to a CSS variable for easy use in stylesheets.
});

// Initialize Lora font with specified weights, subsets, display strategy, and CSS variable.
const lora = Lora({
  weight: ["400", "500", "600", "700"], // Includes multiple weights for varied typographic emphasis.
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

// Defines metadata for the application, including title and description for SEO and browser display.
export const metadata: Metadata = {
  title: "Verda",
  description: "Scan products to find their eco-friendly alternatives!",
  icons: {
    icon: "/verda-logo.png", // Default icon
    shortcut: "/verda-logo.png", // For shortcuts
    apple: "/verda-logo.png", // For Apple touch icon
  },
};

// RootLayout is the main layout component that wraps all pages.
// It sets up the HTML structure, applies global fonts, and includes the navigation bar.
export default function RootLayout({
  children, // Represents the content of the specific page being rendered.
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <title>Verda</title>
        <meta name="description" content="An app allowing users to sort waste properly and calculate their carbon footprints" />
        <link rel="icon" href="/verda-logo.png" />
      </Head>
      <html
        lang="en"
        // Applies the CSS variables for Montserrat and Lora fonts to the html element,
        // making them available globally.
        className={`${montserrat.variable} ${lora.variable}`}
      >
        {/* Body element intentionally has no Tailwind classes to allow globals.css to control the background. */}
        <body className="">
          <NavigationBar />
          {children} {/* Page content is rendered here */}
        </body>
      </html>
    </>
  );
}
