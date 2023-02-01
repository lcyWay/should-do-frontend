export type ThemeType = typeof light;

const light = {
  colors: {
    primary: "#7c7ce4",
  },
  text: {
    primary: "#3c3c3c",
    hint: "#969696",
  },
  layout: {
    primary: "#fff",
    secondary: "#f9f9fa",
    gray: "#e4e4e4",
  },
};

const dark: ThemeType = {
  colors: {
    primary: "#7c7ce4",
  },
  text: {
    primary: "#e6e6e6",
    hint: "#969696",
  },
  layout: {
    primary: "#3e3d3e",
    secondary: "#444444",
    gray: "#68676f",
  },
};

export const theme = {
  light,
  dark,
};
