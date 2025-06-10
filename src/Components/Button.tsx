import React from "react";
import styled from "styled-components";
import { useTheme } from "../Contexts/ThemeContext";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "success" | "danger";
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
}) => {
  const { theme } = useTheme();

  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      type={type}
      variant={variant}
      theme={theme}
    >
      {label}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  variant: "primary" | "secondary" | "success" | "danger";
  theme: any;
}>`
  padding: 0.5rem 1rem;
  background-color: ${(props) => {
    switch (props.variant) {
      case "primary":
        return props.theme.primary;
      case "secondary":
        return props.theme.secondary;
      case "success":
        return props.theme.success;
      case "danger":
        return props.theme.danger;
      default:
        return props.theme.primary;
    }
  }};
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${(props) => {
      switch (props.variant) {
        case "primary":
          return "#18082a";
        case "secondary":
          return "#5a6268";
        case "success":
          return "#218838";
        case "danger":
          return "#c82333";
        default:
          return "#18082a";
      }
    }};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    background-color: ${(props) => {
      switch (props.variant) {
        case "primary":
          return "#18082a";
        case "secondary":
          return "#495057";
        case "success":
          return "#1e7e34";
        case "danger":
          return "#bd2130";
        default:
          return "#18082a";
      }
    }};
    transform: translateY(0);
  }

  &:disabled {
    background-color: ${(props) => props.theme.secondary};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default Button;
