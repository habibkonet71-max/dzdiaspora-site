const html = require("eslint-plugin-html");

// Regle locale : detecte les catch qui ne font que logger (console.*) sans
// jamais agir (mettre a jour l'UI, rethrow...) — l'erreur reste alors
// invisible pour l'utilisateur (ex: mon-espace.html reste bloque sur
// "Chargement..." indefiniment). Les catch vides sont deja couverts par
// no-empty ; cette regle attrape le cas non-vide mais tout aussi silencieux.
const localRules = {
  rules: {
    "no-silent-catch": {
      meta: {
        type: "problem",
        docs: { description: "catch qui ne fait que logger, sans agir (UI, rethrow...)" },
      },
      create(context) {
        return {
          CatchClause(node) {
            const stmts = node.body.body;
            if (stmts.length === 0) return; // deja couvert par no-empty
            const utile = stmts.some((stmt) => {
              if (stmt.type === "ExpressionStatement") {
                const expr = stmt.expression;
                if (
                  expr.type === "CallExpression" &&
                  expr.callee.type === "MemberExpression" &&
                  expr.callee.object.type === "Identifier" &&
                  expr.callee.object.name === "console"
                ) {
                  return false; // console.* seul ne compte pas comme une action
                }
              }
              return true;
            });
            if (!utile) {
              context.report({
                node,
                message:
                  "catch ne fait que logger sans agir (UI, rethrow...) - l'erreur reste invisible pour l'utilisateur. Si c'est voulu (fonctionnalite non critique), annoter avec eslint-disable + justification.",
              });
            }
          },
        };
      },
    },
  },
};

module.exports = [
  {
    files: ["*.js"],
    ignores: ["node_modules/**"],
    plugins: { local: localRules },
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
      "local/no-silent-catch": "error",
    },
  },
  {
    files: ["*.html"],
    plugins: { html, local: localRules },
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
      "local/no-silent-catch": "error",
    },
  },
];
