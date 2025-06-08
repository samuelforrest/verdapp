"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

// Defines the structure for a navigation link object.
interface NavLink {
  href: string; // The URL path for the link.
  label: string; // The display text for the link.
  icon: string; // The path to the icon for the link.
}

// NavigationBar component provides consistent site navigation.
const NavigationBar = () => {
  // usePathname hook from Next.js to get the current URL path.
  const pathname = usePathname();

  // Array of navigation link objects used to build the navigation menu.
  const navLinks: NavLink[] = [
    { href: "/", label: "Trash Sorter", icon: "/icons/trash-sorter-icon.svg" },
    {
      href: "/carbon-quiz",
      label: "CO2 Calculator",
      icon: "/icons/calculator-icon.svg",
    },
    { href: "/history", label: "History", icon: "/icons/history-icon.svg" },
    { href: "/about", label: "About", icon: "/icons/about-icon.svg" },
  ];

  return (
    // Main navigation container with background color, text color, padding, and shadow.
    <nav className="bg-verda-green text-text-on-dark-primary p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Site logo, links to the homepage. */}
        <Link href="/" className="flex items-center">
          <Image
            src="/verda-logo cropped.png"
            alt="Verda Logo"
            width={100}
            height={32}
            priority // Prioritizes loading of the logo image.
          />
        </Link>
        {/* Unordered list for navigation links. */}
        <ul className="flex space-x-4 items-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                // Dynamically sets link styling based on whether the link is active (current path).
                className={`flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-nav-hover-bg text-nav-active-text" // Active link styles
                    : "text-text-on-dark-secondary hover:bg-nav-hover-bg hover:text-white" // Inactive link styles
                }`}
              >
                {/* Displays icon if provided for the link. */}
                {link.icon && (
                  <Image
                    src={link.icon}
                    alt={`${link.label} icon`}
                    width={16}
                    height={16}
                    className="mr-1.5"
                  />
                )}
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
