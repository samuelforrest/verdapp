import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc"; // Helper for using legacy ESLint configurations.

// Resolve __dirname for ES modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize FlatCompat with the current directory.
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// ESLint configuration array.
const eslintConfig = [
  // Extends Next.js recommended ESLint configurations for core web vitals and TypeScript.
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
