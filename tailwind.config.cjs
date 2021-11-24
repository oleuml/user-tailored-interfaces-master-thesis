const config = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      minHeight: {
        '20': '5rem',
        '24': '6rem'
      },
      height: {
        '18': '4.5rem',
      }

    }
  },

  plugins: []
};

module.exports = config;
