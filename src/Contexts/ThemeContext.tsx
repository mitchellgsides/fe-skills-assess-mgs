import React, { createContext, useContext, useState, ReactNode } from "react";
import { Theme, lightTheme, darkTheme } from "../Styles/colors";

interface ThemeContextType {
  theme: Theme;
  lightTheme: Theme;
  darkTheme: Theme;
  isDarkMode: boolean;
  setTheme: (bool: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const setTheme = (bool: boolean) => {
    setIsDarkMode(bool);
  };

  const value: ThemeContextType = {
    theme,
    lightTheme,
    darkTheme,
    isDarkMode,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
