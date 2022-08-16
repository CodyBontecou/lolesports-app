const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        dark: "0px 2px 8px 0px rgb(99, 99, 99 / 0.1)",
        light: "0px 2px 8px 0px rgb(99, 99, 99 / 0.2)",
      },
      colors: {
        light: {
          bg: "#FAF9FA",
          block: "#FFFFFF",
          innerblock: "#E9EAEB",
          footer: "#E9EAEB",
          btn: {
            primary: {
              base: "#000000",
              hover: "#71D1F3",
            },
            secondary: {
              base: "#646464",
              hover: "#71D1F3",
            },
          },
          font: {
            navbar: {
              base: "#646464",
              hover: "#000000",
            },
            primary: "#191919",
            secondary: "#646464",
            tertiary: "#AAAAAA",
          },
        },
        dark: {
          bg: "#101428",
          block: "#171B32",
          innerblock: "#1C213D",
          footer: "#1C213D",
          btn: {
            primary: {
              base: {
                1: "#8148e5",
                2: "#251345",
              },
              hover: "#000000",
            },
            secondary: {
              base: "#979DC6",
              hover: "#000000",
            },
          },
          font: {
            navbar: {
              base: "#979DC6",
              hover: "#FFFFFF",
            },
            primary: "#FFFFFF",
            secondary: "#979DC6",
            tertiary: "#3E405A",
          },
        },
        gradients: {
          orange: {
            1: "#f0c24a",
            2: "#ef804b",
          },
          blue: {
            1: "#6ab8f9",
            2: "#4970f6",
          },
          green: {
            1: "#79db72",
            2: "#71cca4",
          },
        },
        palette: {
          blue: "#0d6efd",
          indigo: "#6610f2",
          purple: "#6f42c1",
          pink: "#d63384",
          red: "#dc3545",
          orange: "#fd7e14",
          yellow: "#ffc107",
          green: "#198754",
          teal: "#20c997",
          cyan: "#0dcaf0",
          gray: "#757575",
          gray_dark: "#4f4f4f",
          primary: "#1266f1",
          secondary: "#b23cfd",
          success: "#00b74a",
          info: "#39c0ed",
          warning: "#ffa900",
          danger: "#f93154",
          light: "#fbfbfb",
          dark: "#262626",
          white: "#fff",
          black: "#000",
        },
      },
    },
    screens: {
      xs: "420px",
      ...defaultTheme.screens,
    },
  },
  plugins: [],
};
