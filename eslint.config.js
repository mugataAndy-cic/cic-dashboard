// ESLint configuration for ESLint 9+
export default [
  {
    ignores: ["**/node_modules/**", "**/dist/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        React: "readonly"
      }
    },
    plugins: {
      // Add plugins here if needed
    },
    rules: {
      // Add or override rules here
    },
  },
];
