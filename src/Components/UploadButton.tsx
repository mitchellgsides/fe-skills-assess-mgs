import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useImageContext } from "../Contexts/ImageContext";
import { useTheme } from "../Contexts/ThemeContext";
import Button from "./Button";
import { Modal } from "./Modal";

interface SelectedImage {
  file: File;
  name: string;
  preview: string;
}

export const UploadButton: React.FC = () => {
  const { uploadMultipleImagesWithNames } = useImageContext();
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [fileId: string]: number;
  }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [selectedImages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        name: file.name.split(".")[0],
        preview: URL.createObjectURL(file),
      }));

      setSelectedImages((prev) => [...prev, ...newImages]);
      setIsModalOpen(true);
    }
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      setUploadProgress({});

      const filesWithNames = selectedImages.map((image) => ({
        file: image.file,
        name: image.name,
      }));

      await uploadMultipleImagesWithNames(filesWithNames);

      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image(s). Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const resetForm = () => {
    selectedImages.forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });
    setSelectedImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  const updateImageName = (index: number, newName: string) => {
    setSelectedImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, name: newName } : img))
    );
  };

  const removeImage = (index: number) => {
    const imageToRemove = selectedImages[index];
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    return validTypes.includes(file.type);
  };

  const handleFileValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!isValidFileType(file)) {
          alert(
            `Please select valid image files only (JPEG, PNG, GIF, or WebP). "${file.name}" is not a valid image file.`
          );
          e.target.value = "";
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          // 10MB limit
          alert(
            `File size must be less than 10MB. "${file.name}" is too large.`
          );
          e.target.value = "";
          return;
        }
      }
      handleFileSelect(e);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    resetForm();
    setIsModalOpen(false);
  };

  return (
    <UploadContainer>
      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileValidation}
      />

      <Button
        label={isUploading ? "Uploading..." : "UPLOAD"}
        onClick={handleButtonClick}
        disabled={isUploading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`Upload ${selectedImages.length} Image${
          selectedImages.length > 1 ? "s" : ""
        }`}
      >
        <UploadForm theme={theme}>
          <FileInfo>
            <FileName theme={theme}>
              Selected: {selectedImages.length} image
              {selectedImages.length > 1 ? "s" : ""}
            </FileName>
            <FileSize theme={theme}>
              Total size:{" "}
              {(
                selectedImages.reduce(
                  (total, img) => total + img.file.size,
                  0
                ) /
                1024 /
                1024
              ).toFixed(2)}{" "}
              MB
            </FileSize>
          </FileInfo>

          <ImagesList theme={theme}>
            {selectedImages.map((image, index) => (
              <ImageItem key={index} theme={theme}>
                <ImageThumbnail
                  theme={theme}
                  src={image.preview}
                  alt={image.file.name}
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = "none";
                  }}
                />
                <ImageDetails>
                  <ImageFileName theme={theme}>{image.file.name}</ImageFileName>
                  <ImageFileSize theme={theme}>
                    {(image.file.size / 1024 / 1024).toFixed(2)} MB
                  </ImageFileSize>
                </ImageDetails>
                <NameInput
                  theme={theme}
                  type="text"
                  placeholder="Enter custom name"
                  value={image.name}
                  onChange={(e) => updateImageName(index, e.target.value)}
                />
                <RemoveButton theme={theme} onClick={() => removeImage(index)}>
                  ×
                </RemoveButton>
              </ImageItem>
            ))}
          </ImagesList>

          {Object.keys(uploadProgress).length > 0 && (
            <ProgressContainer>
              <ProgressLabel theme={theme}>Upload Progress:</ProgressLabel>
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <ProgressBar key={fileId} theme={theme}>
                  <ProgressFill progress={progress} theme={theme} />
                  <ProgressText theme={theme}>{progress}%</ProgressText>
                </ProgressBar>
              ))}
            </ProgressContainer>
          )}

          <ButtonGroup>
            <Button
              label="Add More Images"
              onClick={handleAddMore}
              disabled={isUploading}
              variant="secondary"
            />
            <Button
              label={
                isUploading
                  ? "Uploading..."
                  : `Upload ${selectedImages.length} Image${
                      selectedImages.length > 1 ? "s" : ""
                    }`
              }
              onClick={handleUpload}
              disabled={
                isUploading || selectedImages.some((img) => !img.name.trim())
              }
              variant="success"
            />
            <Button
              label="Cancel"
              onClick={handleCancel}
              disabled={isUploading}
              variant="danger"
            />
          </ButtonGroup>
        </UploadForm>
      </Modal>
    </UploadContainer>
  );
};

export default UploadButton;

const UploadContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadForm = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const FileName = styled.span<{ theme: any }>`
  font-weight: bold;
  color: ${(props) => props.theme.text};
`;

const FileSize = styled.span<{ theme: any }>`
  font-size: 0.9rem;
  color: ${(props) => props.theme.textSecondary};
`;

const NameInput = styled.input<{ theme: any }>`
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 4px;
  font-size: 1rem;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  flex: 1;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
    box-shadow: 0 0 0 2px ${(props) => `${props.theme.primary}40`};
  }

  &::placeholder {
    color: ${(props) => props.theme.textSecondary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ProgressContainer = styled.div`
  margin-top: 0.5rem;
`;

const ProgressLabel = styled.div<{ theme: any }>`
  font-size: 0.9rem;
  color: ${(props) => props.theme.text};
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div<{ theme: any }>`
  position: relative;
  width: 100%;
  height: 20px;
  background-color: ${(props) => props.theme.border};
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.25rem;
`;

const ProgressFill = styled.div<{ progress: number; theme: any }>`
  height: 100%;
  background-color: ${(props) => props.theme.primary};
  width: ${(props) => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div<{ theme: any }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  color: ${(props) => props.theme.text};
  font-weight: bold;
`;

const ImagesList = styled.div<{ theme: any }>`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 8px;
  padding: 0.5rem;
  margin: 0.5rem 0;
  background: ${(props) => props.theme.background};
`;

const ImageItem = styled.div<{ theme: any }>`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid ${(props) => props.theme.border};
  gap: 0.75rem;

  &:last-child {
    border-bottom: none;
  }
`;

const ImageThumbnail = styled.img<{ theme: any }>`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme.border};
  flex-shrink: 0;
`;

const ImageDetails = styled.div`
  flex: 1;
  min-width: 0;
  margin-right: 0.5rem;
`;

const ImageFileName = styled.div<{ theme: any }>`
  font-weight: 600;
  color: ${(props) => props.theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
`;

const ImageFileSize = styled.div<{ theme: any }>`
  font-size: 0.8rem;
  color: ${(props) => props.theme.textSecondary};
`;

const RemoveButton = styled.button<{ theme: any }>`
  background: ${(props) => props.theme.danger};
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.2s ease;

  &:hover {
    background: #c82333;
  }
`;
