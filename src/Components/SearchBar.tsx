import React, { useState } from "react";
import styled from "styled-components";
import { useImageContext } from "../Contexts/ImageContext";
import { useTheme } from "../Contexts/ThemeContext";
import Button from "./Button";

const SearchBar: React.FC = () => {
  const { searchImages, clearSearch, searchTerm } = useImageContext();
  const { theme } = useTheme();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchImages(localSearchTerm);
  };

  const handleClear = () => {
    setLocalSearchTerm("");
    clearSearch();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);

    if (value === "") {
      clearSearch();
    } else {
      searchImages(value);
    }
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSearch}>
        <SearchInput
          type="text"
          placeholder="Search images by name..."
          value={localSearchTerm}
          onChange={handleInputChange}
          theme={theme}
        />
        <ButtonGroup>
          <Button
            label="Search"
            onClick={() => searchImages(localSearchTerm)}
          />
          <ClearButtonContainer>
            {searchTerm ? (
              <Button label="Clear" onClick={handleClear} variant="secondary" />
            ) : (
              <PlaceholderButton />
            )}
          </ClearButtonContainer>
        </ButtonGroup>
      </SearchForm>
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchInput = styled.input<{ theme: any }>`
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 4px;
  font-size: 1rem;
  min-width: 300px;
  background: ${(props) => props.theme.surface};
  color: ${(props) => props.theme.text};
  transition: all 0.2s ease;

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
`;

const ClearButtonContainer = styled.div`
  min-width: 80px; /* Reserve space for Clear button */
  display: flex;
  justify-content: center;
`;

const PlaceholderButton = styled.div`
  width: 80px; /* Same width as Clear button */
  height: 40px; /* Same height as button */
`;

export default SearchBar;
