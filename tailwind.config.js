module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1700px",
      xl: "1440px",
    },

    extend: {
      colors: {
        myBlue: "#0A32B3",
        myPink: "#BD365D",
      },
      backgroundImage: (theme) => ({
        pattern:
          "url('https://garden.spoonflower.com/c/18180550/p/f/m/F9f1lHd9-or0-qZhoU5_jth7_41Rk2smeFurgQRDhp84nln78O3eIyY/Bigger%20Happy%20Face%20Checkers%20Cloud%20Grey.jpg')",
      }),
    },
  },
  plugins: [],
};
