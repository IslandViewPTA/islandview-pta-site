module.exports = {
  important: true,
  theme: {
    columnCount: [1, 2, 3],
    columnGap: {
      // will fallback to 'gap' || 'gridGap' values
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem"
    },
    columnWidth: {
      sm: "120px",
      md: "240px",
      lg: "360px"
    },
    columnRuleColor: false, // will fallback to `borderColor` values
    columnRuleWidth: false, // will fallback to `borderWidth` values
    columnRuleStyle: [
      "none",
      "hidden",
      "dotted",
      "dashed",
      "solid",
      "double",
      "groove",
      "ridge",
      "inset",
      "outset"
    ],
    columnFill: ["auto", "balance", "balance-all"],
    columnSpan: ["none", "all"],
    fontFamily: {
      heading: ["Playfair Display", "serif"]
    },
    extend: {
      colors: {
        primary: "#000c4e",
        gold: "#ffd700"
      },
      width: {
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem"
      },
      screens: {
        print: { raw: "print" }
      }
    },
    inset: {
      "0": 0,
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1.0rem",
      "1/2": "50%"
    },
    maxWidth: {
      xs: "20rem",
      sm: "24rem",
      md: "28rem",
      lg: "32rem",
      xl: "36rem",
      "2xl": "42rem",
      "3xl": "48rem",
      "4xl": "56rem",
      "5xl": "64rem",
      "6xl": "72rem",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      "90": "90%",
      full: "100%"
    }
  },
  variants: {
    display: ["responsive", "hover", "focus", "active", "group-hover"],
    textColor: ["responsive", "hover", "focus", "active", "group-hover"],
    borderColor: ["responsive", "hover", "focus", "active", "group-hover"],
    borderWidth: ["responsive", "hover"],
    visibility: ["responsive", "hover", "focus", "group-hover"],
    columnCount: ["responsive"],
    columnGap: ["responsive"],
    columnWidth: ["responsive"],
    columnRuleColor: ["responsive"],
    columnRuleWidth: ["responsive"],
    columnRuleStyle: ["responsive"],
    columnFill: ["responsive"],
    columnSpan: ["responsive"]
  },
  plugins: [
    require("tailwindcss-multi-column")(),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography")
  ]
};
