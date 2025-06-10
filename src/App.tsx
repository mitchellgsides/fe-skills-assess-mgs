import "./App.css";
import { ImageContextProvider } from "./Contexts/ImageContext";
import { ThemeProvider, useTheme } from "./Contexts/ThemeContext";
import SearchBar from "./Components/SearchBar";
import UploadButton from "./Components/UploadButton";
import ImageList from "./Components/ImageList/ImageList";
import ThemeToggle from "./Components/ThemeToggle";
import styled from "styled-components";

const AppContent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <AppContainer theme={theme}>
      <ImageContextProvider>
        <Header theme={theme}>
          <HeaderContent>
            <TitleSection>
              <Title>Image Gallery</Title>
              <Subtitle>Upload, search, and manage your images</Subtitle>
            </TitleSection>
            <ThemeToggle />
          </HeaderContent>
        </Header>

        <Controls theme={theme}>
          <ControlItem>
            <SearchBar />
          </ControlItem>
          <ControlItem>
            <UploadButton />
          </ControlItem>
        </Controls>

        <Main>
          <ImageList />
        </Main>
      </ImageContextProvider>
    </AppContainer>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

const AppContainer = styled.div<{ theme: any }>`
  min-height: 100vh;
  background-color: ${(props) => props.theme.background};
  transition: background-color 0.2s ease;
`;

const Header = styled.header<{ theme: any }>`
  background: ${(props) => props.theme.backgroundGradient};
  color: ${(props) => props.theme.white};
  padding: 2rem;
  box-shadow: 0 2px 4px ${(props) => props.theme.shadow};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
`;

const Controls = styled.div<{ theme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
  padding: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ControlItem = styled.div`
  display: flex;
  align-items: center;
  min-width: 0; /* Allow items to shrink if needed */
`;

const Main = styled.main`
  padding: 2rem 1rem;
`;
