import React, { useState } from "react";
import styled from "styled-components";
import { useTheme } from "../../Contexts/ThemeContext";

interface ImageItem {
  id: string;
  name: string;
  url: string;
  file: File;
  uploadDate: Date;
}

interface ImageCardProps {
  image: ImageItem;
  onDelete: (id: string) => Promise<void>;
  onEditName: (id: string, newName: string) => Promise<void>;
  isDeleting?: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onDelete,
  onEditName,
  isDeleting = false,
}) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState("");

  const handleEditStart = () => {
    setIsEditing(true);
    setEditingName(image.name);
  };

  const handleEditSave = async () => {
    if (editingName.trim()) {
      try {
        await onEditName(image.id, editingName.trim());
        setIsEditing(false);
        setEditingName("");
      } catch (error) {
        console.error("Edit failed:", error);
        alert("Failed to edit image name. Please try again.");
      }
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditingName("");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await onDelete(image.id);
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete image. Please try again.");
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <CardContainer theme={theme}>
      <ImageWrapper>
        <Image src={image.url} alt={image.name} />
        <ImageOverlay theme={theme}>
          <ButtonGroup>
            <EditButton
              theme={theme}
              onClick={handleEditStart}
              disabled={isEditing}
              title="Edit image name"
            >
              ✏️
            </EditButton>
            <DeleteButton
              theme={theme}
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete image"
            >
              {isDeleting ? "⏳" : "🗑️"}
            </DeleteButton>
          </ButtonGroup>
        </ImageOverlay>
      </ImageWrapper>

      <ImageInfo>
        {isEditing ? (
          <EditForm>
            <EditInput
              theme={theme}
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEditSave();
                } else if (e.key === "Escape") {
                  handleEditCancel();
                }
              }}
              autoFocus
            />
            <EditButtons>
              <SaveButton theme={theme} onClick={handleEditSave}>
                ✓
              </SaveButton>
              <CancelButton theme={theme} onClick={handleEditCancel}>
                ✕
              </CancelButton>
            </EditButtons>
          </EditForm>
        ) : (
          <ImageName theme={theme} title={image.name}>
            {image.name}
          </ImageName>
        )}
        <ImageMeta theme={theme}>
          <UploadDate>{formatDate(image.uploadDate)}</UploadDate>
          <FileSize>{(image.file.size / 1024 / 1024).toFixed(2)} MB</FileSize>
        </ImageMeta>
      </ImageInfo>
    </CardContainer>
  );
};

const CardContainer = styled.div<{ theme: any }>`
  background: ${(props) => props.theme.surface};
  border-radius: 8px;
  box-shadow: 0 2px 8px ${(props) => props.theme.shadow};
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px ${(props) => props.theme.shadow};
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div<{ theme: any }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${(props) => props.theme.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const DeleteButton = styled.button<{ theme: any }>`
  background: rgba(220, 53, 69, 0.9);
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.danger};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled.button<{ theme: any }>`
  background: rgba(0, 123, 255, 0.9);
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const EditForm = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`;

const EditInput = styled.input<{ theme: any }>`
  flex: 1;
  padding: 0.25rem 0.5rem;
  border: 1px solid ${(props) => props.theme.primary};
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  background: ${(props) => props.theme.surface};
  color: ${(props) => props.theme.text};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
    box-shadow: 0 0 0 2px ${(props) => `${props.theme.primary}40`};
  }
`;

const EditButtons = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const SaveButton = styled.button<{ theme: any }>`
  background: ${(props) => props.theme.success};
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #218838;
  }
`;

const CancelButton = styled.button<{ theme: any }>`
  background: ${(props) => props.theme.secondary};
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #5a6268;
  }
`;

const ImageInfo = styled.div`
  padding: 1rem;
`;

const ImageName = styled.h4<{ theme: any }>`
  margin: 0 0 0.5rem 0;
  color: ${(props) => props.theme.text};
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ImageMeta = styled.div<{ theme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${(props) => props.theme.textSecondary};
`;

const UploadDate = styled.span``;

const FileSize = styled.span`
  font-weight: 500;
`;

export default ImageCard;
