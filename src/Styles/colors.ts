export const baseColors = {
  primary: "#661dbb",
  secondary: "#6c757d",
  success: "#28a745",
  danger: "#dc3545",
  warning: "#ffc107",
  info: "#17a2b8",
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
  backgroundGradient: "linear-gradient(90deg, #661dbb 0%, #18082a 100%)",
};

export const lightTheme = {
  ...baseColors,
  background: "#f8f9fa",
  surface: "#ffffff",
  text: "#343a40",
  textSecondary: "#6c757d",
  border: "#dee2e6",
  overlay: "rgba(0, 0, 0, 0.5)",
  shadow: "rgba(0, 0, 0, 0.1)",
};

export const darkTheme = {
  ...baseColors,
  background: "#1a1a1a",
  surface: "#2d2d2d",
  text: "#ffffff",
  textSecondary: "#b0b0b0",
  border: "#404040",
  overlay: "rgba(0, 0, 0, 0.7)",
  shadow: "rgba(0, 0, 0, 0.3)",
};

export type Theme = typeof lightTheme;
