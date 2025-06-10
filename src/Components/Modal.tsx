import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useTheme } from "../Contexts/ThemeContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const ModalOverlay = styled.div<{ isOpen: boolean; theme: any }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div<{ theme: any }>`
  background-color: ${(props) => props.theme.surface};
  border-radius: 12px;
  padding: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  border: 1px solid ${(props) => props.theme.border};
`;

const ModalHeader = styled.div<{ theme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${(props) => props.theme.border};
`;

const ModalTitle = styled.h3<{ theme: any }>`
  margin: 0;
  color: ${(props) => props.theme.text};
  font-size: 1.25rem;
  font-weight: 600;
`;

const CloseButton = styled.button<{ theme: any }>`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => props.theme.textSecondary};
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.border};
    color: ${(props) => props.theme.text};
  }
`;

const ModalContent = styled.div``;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} theme={theme} onClick={handleOverlayClick}>
      <ModalContainer ref={modalRef} theme={theme}>
        {title && (
          <ModalHeader theme={theme}>
            <ModalTitle theme={theme}>{title}</ModalTitle>
            <CloseButton theme={theme} onClick={onClose}>
              ×
            </CloseButton>
          </ModalHeader>
        )}
        <ModalContent>{children}</ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};
