import React from "react";
import styled from "styled-components";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useTheme } from "../Contexts/ThemeContext";
import { Theme } from "../Styles/colors";

const ThemeToggle: React.FC = () => {
  const { isDarkMode, setTheme, darkTheme } = useTheme();

  return (
    <SwitchContainer theme={darkTheme}>
      <OptionButton
        onClick={() => setTheme(false)}
        theme={darkTheme}
        isSelected={!isDarkMode}
        aria-label="Switch to light mode"
      >
        <ToggleIcon>
          <LightMode fontSize="small" />
        </ToggleIcon>
        <ToggleText>Light</ToggleText>
      </OptionButton>

      <OptionButton
        onClick={() => setTheme(true)}
        theme={darkTheme}
        isSelected={isDarkMode}
        aria-label="Switch to dark mode"
      >
        <ToggleIcon>
          <DarkMode fontSize="small" />
        </ToggleIcon>
        <ToggleText>Dark</ToggleText>
      </OptionButton>
    </SwitchContainer>
  );
};

const SwitchContainer = styled.div<{ theme: Theme }>`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
`;

const OptionButton = styled.button<{ theme: Theme; isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.8rem;
  background: ${(props) =>
    props.isSelected ? props.theme.primary : props.theme.surface};
  color: ${(props) =>
    props.isSelected ? props.theme.white : props.theme.text};
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  position: relative;
  min-width: 70px;
  justify-content: center;

  &:hover {
    background: ${(props) =>
      props.isSelected ? props.theme.primary : props.theme.border};
  }

  &:active {
    transform: translateY(0);
  }

  ${(props) =>
    props.isSelected &&
    `
    box-shadow: 0 2px 4px ${props.theme.shadow};
    z-index: 1;
  `}
`;

const ToggleIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const ToggleText = styled.span`
  font-weight: 500;
  font-size: 0.8rem;
`;

export default ThemeToggle;
