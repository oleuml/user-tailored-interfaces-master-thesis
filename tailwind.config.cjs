const config = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      height: {
        '18': '4.5rem',

      }

    }
  },

  plugins: []
};

module.exports = config;
