"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Navigation bar component
const NavigationBar = () => {
  const pathname = usePathname(); // Get the current path

  // Define navigation links
  const navLinks = [
    { href: "/", label: "Trash Sorter" }, // Updated label
    { href: "/carbon-quiz", label: "CO2 Calculator" }, // Updated label
    { href: "/history", label: "History" }, // Added History tab
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="bg-forest-green text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or brand name */}
        <Link
          href="/"
          className="text-2xl font-bold font-serif hover:text-pine-green transition-colors"
        >
          EcoScan
        </Link>
        {/* Navigation links */}
        <ul className="flex space-x-6 items-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`hover:text-pine-green transition-colors ${
                  pathname === link.href
                    ? "text-pine-green font-semibold border-b-2 border-pine-green"
                    : "text-gray-200"
                }`}
              >
                {/* Placeholder for icons - you can add actual icons here */}
                {link.label === "History" && <span className="mr-1">📊</span>}
                {link.label === "About" && <span className="mr-1">ℹ️</span>}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
