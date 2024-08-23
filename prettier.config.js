/**
 * @type {import("prettier").Config &
 *   import("prettier-plugin-svelte").PluginConfig &
 *   import("@ianvs/prettier-plugin-sort-imports").PluginConfig}
 */
export default {
  printWidth: 100,
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-svelte",
    "prettier-plugin-jsdoc",
    "prettier-plugin-packagejson",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "<TYPES>",
    "<BUILTIN_MODULES>",
    "^(svelte/(.*)$)|^(svelte$)",
    "^@",
    "<THIRD_PARTY_MODULES>",
    "^\\$(?!lib/)",
    "^\\$lib/",
    "^[.]",
  ],
  importOrderTypeScriptVersion: "5.5.4",
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
};
