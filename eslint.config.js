const html = require("eslint-plugin-html");

module.exports = [
  {
    files: ["*.js"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        location: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        fetch: "readonly",
        alert: "readonly",
        prompt: "readonly",
        confirm: "readonly",
        require: "readonly",
        module: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "error",
      "no-empty": "error",
    },
  },
  {
    files: ["*.html"],
    plugins: { html },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        location: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        fetch: "readonly",
        alert: "readonly",
        prompt: "readonly",
        confirm: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "error",
      "no-empty": "error",
    },
  },
];
