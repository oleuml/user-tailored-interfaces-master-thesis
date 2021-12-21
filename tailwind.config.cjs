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
        '13': '3.25rem',
        '18': '4.5rem',
        '11/12': '91.66666%'
      },
      maxHeight: {
        '4/6': '66.66666%',
        '5/6': '83.33333%'
      },
      borderRadius: {
        '4xl': '3rem'
      },
    }
  },

  plugins: []
};

module.exports = config;
