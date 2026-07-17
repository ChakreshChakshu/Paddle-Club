const sharedConfig = require('@paddle-club/tailwind-config');

module.exports = {
  ...sharedConfig,
  darkMode: 'class',
  content: [
    ...sharedConfig.content,
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ]
};
