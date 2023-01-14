export type ThemeType = typeof light;

const light = {
  colors: {
    primary: "#7c7ce4",
  },
  text: {
    primary: "#3c3c3c",
    hint: "rgb(150, 150, 150)",
  },
  layout: {
    primary: "#fff",
    secondary: "#f3f3f3",
    gray: "#e4e4e4",
  },
};

const dark: ThemeType = {
  colors: {
    primary: "#7c7ce4",
  },
  text: {
    primary: "#e6e6e6",
    hint: "rgb(150, 150, 150)",
  },
  layout: {
    primary: "#3c3c3c",
    secondary: "#454545",
    gray: "#68676f",
  },
};

export const theme = {
  light,
  dark,
};
