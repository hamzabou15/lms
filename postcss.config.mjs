const config = {
  plugins: {
    'postcss-import': {},
    '@tailwindcss/postcss': {
      tailwindConfig: './tailwind.config.js' // Path to your Tailwind config
    },
    'autoprefixer': {},
  }
};

export default config;