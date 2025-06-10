import React, { useState } from "react";
import styled from "styled-components";
import { useImageContext } from "../../Contexts/ImageContext";
import { useTheme } from "../../Contexts/ThemeContext";
import ImageCardComponent from "./ImageCard";

const ImageList: React.FC = () => {
  const { filteredImages, deleteImage, editImageName, searchTerm } =
    useImageContext();
  const { theme } = useTheme();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteImage(id);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete image. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditName = async (id: string, newName: string) => {
    try {
      await editImageName(id, newName);
    } catch (error) {
      console.error("Edit failed:", error);
      alert("Failed to edit image name. Please try again.");
    }
  };

  if (filteredImages.length === 0) {
    return (
      <EmptyState theme={theme}>
        {searchTerm ? (
          <>
            <EmptyMessage theme={theme}>
              No images found matching "{searchTerm}"
            </EmptyMessage>
            <EmptySubtext theme={theme}>
              Try a different search term or upload some images
            </EmptySubtext>
          </>
        ) : (
          <>
            <EmptyMessage theme={theme}>No images uploaded yet</EmptyMessage>
            <EmptySubtext theme={theme}>
              Upload your first image to get started
            </EmptySubtext>
          </>
        )}
      </EmptyState>
    );
  }

  return (
    <Container theme={theme}>
      <Header>
        <Title theme={theme}>
          {searchTerm
            ? `Search Results (${filteredImages.length})`
            : `${filteredImages.length} Images`}
        </Title>
        <SearchIndicator theme={theme}>
          {searchTerm ? `Showing results for: "${searchTerm}"` : "\u00A0"}
        </SearchIndicator>
      </Header>

      <ImageGrid>
        {filteredImages.map((image) => (
          <ImageCardComponent
            key={image.id}
            image={image}
            onDelete={handleDelete}
            onEditName={handleEditName}
            isDeleting={deletingId === image.id}
          />
        ))}
      </ImageGrid>
    </Container>
  );
};

const Container = styled.div<{ theme: any }>`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Title = styled.h2<{ theme: any }>`
  margin: 0 0 0.5rem 0;
  color: ${(props) => props.theme.text};
  font-size: 1.5rem;
`;

const SearchIndicator = styled.p<{ theme: any }>`
  margin: 0;
  color: ${(props) => props.theme.textSecondary};
  font-style: italic;
`;

const EmptyState = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  min-height: 50vh;
`;

const EmptyMessage = styled.h3<{ theme: any }>`
  margin: 0 0 0.5rem 0;
  color: ${(props) => props.theme.textSecondary};
  font-size: 1.25rem;
`;

const EmptySubtext = styled.p<{ theme: any }>`
  margin: 0;
  color: ${(props) => props.theme.textSecondary};
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export default ImageList;
