import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";

interface ImageItem {
  id: string;
  name: string;
  url: string;
  file: File;
  uploadDate: Date;
}

interface ImageContextType {
  images: ImageItem[];
  filteredImages: ImageItem[];
  searchTerm: string;
  isUploading: boolean;
  uploadProgress: { [key: string]: number };
  uploadImage: (file: File, name: string) => Promise<void>;
  uploadMultipleImages: (files: FileList) => Promise<void>;
  uploadMultipleImagesWithNames: (
    files: { file: File; name: string }[]
  ) => Promise<void>;
  searchImages: (term: string) => void;
  deleteImage: (id: string) => Promise<void>;
  editImageName: (id: string, newName: string) => Promise<void>;
  clearSearch: () => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

interface ImageContextProviderProps {
  children: ReactNode;
}

export const ImageContextProvider: React.FC<ImageContextProviderProps> = ({
  children,
}) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  const filteredImages = images.filter((image) => {
    if (!searchTerm.trim()) return true;

    const normalizeString = (str: string) =>
      str.toLowerCase().replace(/\s+/g, "").replace(/[^\w]/g, "");

    const normalizedImageName = normalizeString(image.name);
    const normalizedSearchTerm = normalizeString(searchTerm);

    const directMatch = image.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const normalizedMatch = normalizedImageName.includes(normalizedSearchTerm);

    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
    const wordMatch = searchWords.every((word) =>
      image.name.toLowerCase().includes(word)
    );

    return directMatch || normalizedMatch || wordMatch;
  });

  // Mock API: Upload image
  const uploadImage = useCallback(
    async (file: File, name: string): Promise<void> => {
      setIsUploading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const url = URL.createObjectURL(file);

        const newImage: ImageItem = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: name || file.name,
          url,
          file,
          uploadDate: new Date(),
        };

        setImages((prev) => [...prev, newImage]);
      } catch (error) {
        console.error("Failed to upload image:", error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const uploadMultipleImages = useCallback(
    async (files: FileList): Promise<void> => {
      setIsUploading(true);
      const fileArray = Array.from(files);
      const newImages: ImageItem[] = [];

      try {
        const uploadPromises = fileArray.map(async (file, index) => {
          const fileId = `temp_${Date.now()}_${index}`;

          setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

          for (let progress = 0; progress <= 100; progress += 20) {
            setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
            await new Promise((resolve) => setTimeout(resolve, 200));
          }

          const url = URL.createObjectURL(file);

          const newImage: ImageItem = {
            id: `img_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}_${index}`,
            name: file.name.split(".")[0], // Use filename without extension
            url,
            file,
            uploadDate: new Date(),
          };

          newImages.push(newImage);

          setUploadProgress((prev) => {
            const updated = { ...prev };
            delete updated[fileId];
            return updated;
          });
        });

        await Promise.all(uploadPromises);

        setImages((prev) => [...prev, ...newImages]);
      } catch (error) {
        console.error("Failed to upload images:", error);
        throw error;
      } finally {
        setIsUploading(false);
        setUploadProgress({});
      }
    },
    []
  );

  // Mock API: Upload multiple images with custom names
  const uploadMultipleImagesWithNames = useCallback(
    async (filesWithNames: { file: File; name: string }[]): Promise<void> => {
      setIsUploading(true);
      const newImages: ImageItem[] = [];

      try {
        const uploadPromises = filesWithNames.map(
          async ({ file, name }, index) => {
            const fileId = `temp_${Date.now()}_${index}`;

            setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

            // Simulate upload progress
            for (let progress = 0; progress <= 100; progress += 20) {
              setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
              await new Promise((resolve) => setTimeout(resolve, 200));
            }

            const url = URL.createObjectURL(file);

            const newImage: ImageItem = {
              id: `img_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}_${index}`,
              name: name || file.name.split(".")[0], // Use custom name or filename without extension
              url,
              file,
              uploadDate: new Date(),
            };

            newImages.push(newImage);

            setUploadProgress((prev) => {
              const updated = { ...prev };
              delete updated[fileId];
              return updated;
            });
          }
        );

        await Promise.all(uploadPromises);

        setImages((prev) => [...prev, ...newImages]);
      } catch (error) {
        console.error("Failed to upload images:", error);
        throw error;
      } finally {
        setIsUploading(false);
        setUploadProgress({});
      }
    },
    []
  );

  const searchImages = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  // Mock API: Delete image
  const deleteImage = useCallback(async (id: string): Promise<void> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setImages((prev) => {
        const imageToDelete = prev.find((img) => img.id === id);
        if (imageToDelete) {
          URL.revokeObjectURL(imageToDelete.url);
        }
        return prev.filter((img) => img.id !== id);
      });
    } catch (error) {
      console.error("Failed to delete image:", error);
      throw error;
    }
  }, []);

  const editImageName = useCallback(
    async (id: string, newName: string): Promise<void> => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));

        setImages((prev) =>
          prev.map((img) => (img.id === id ? { ...img, name: newName } : img))
        );
      } catch (error) {
        console.error("Failed to edit image name:", error);
        throw error;
      }
    },
    []
  );

  const value: ImageContextType = {
    images,
    filteredImages,
    searchTerm,
    isUploading,
    uploadProgress,
    uploadImage,
    uploadMultipleImages,
    uploadMultipleImagesWithNames,
    searchImages,
    deleteImage,
    editImageName,
    clearSearch,
  };

  return (
    <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
  );
};

export const useImageContext = (): ImageContextType => {
  const context = useContext(ImageContext);

  if (context === undefined) {
    throw new Error(
      "useImageContext must be used within an ImageContextProvider"
    );
  }

  return context;
};
