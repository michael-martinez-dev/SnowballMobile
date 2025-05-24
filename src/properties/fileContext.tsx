import React, { createContext, useContext, useState, ReactNode } from "react";
import { FileInfo, FileContextType } from "../types/database";

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);

  return (
    <FileContext.Provider value={{ selectedFile, setSelectedFile }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFile = (): FileContextType => {
  const context = useContext(FileContext);

  if (context === undefined) {
    throw new Error("useFile must be used within a FileProvider");
  }
  return context;
};
