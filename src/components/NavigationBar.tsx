"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TrashIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.032 3.287.094M5.116 5.79l-.007-.004M5.116 5.79S5.151 5.011 5.151 4.468c0-1.977 1.594-3.57 3.57-3.57h1.008c1.977 0 3.57 1.593 3.57 3.57v1.327c0 .54-.034 1.323-.034 1.323m-6.364 0h6.364"
    />
  </svg>
);

export default function NavigationBar() {
  const pathname = usePathname();

  return (
    <footer className="w-full max-w-md mt-auto sticky bottom-0 bg-pale-leaf border-t border-stone-gray shadow-t-lg mx-auto">
      <div className="flex justify-around items-stretch">
        <Link
          href="/"
          className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-sm 
            ${
              pathname === "/"
                ? "border-t-4 border-leaf-green text-forest-green bg-leaf-green/20"
                : "border-t-4 border-transparent text-bark-brown hover:text-forest-green hover:bg-leaf-green/10"
            } 
            focus:outline-none focus:bg-leaf-green/30 transition-colors duration-150 font-medium`}
          title="Trash Sorter"
        >
          <TrashIcon className="w-6 h-6 mb-1" />
          <span>Sort</span>
        </Link>
        <Link
          href="/carbon-quiz"
          className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-sm 
            ${
              pathname === "/carbon-quiz"
                ? "border-t-4 border-leaf-green text-forest-green bg-leaf-green/20"
                : "border-t-4 border-transparent text-bark-brown hover:text-forest-green hover:bg-leaf-green/10"
            } 
            focus:outline-none focus:bg-leaf-green/30 transition-colors duration-150 font-medium`}
          title="Carbon Footprint Quiz"
        >
          <span className="text-xl font-semibold mb-1">CO₂</span>
          <span>Quiz</span>
        </Link>
      </div>
    </footer>
  );
}
