import React, { createContext, useContext, useState, ReactNode } from "react";

type Database = {
  name: string;
  uri: string;
};

type DatabaseContextType = {
  openedDB: Database | null;
  setDB: (db: Database | null) => void;
};

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const [openedDB, setDB] = useState<Database | null>(null);

  return (
    <DatabaseContext.Provider value={{ openedDB, setDB }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);

  if (context === undefined) {
    throw new Error("useFile must be used within a FileProvider");
  }
  return context;
};
