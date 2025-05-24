import React, { createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Pocketbase, { AsyncAuthStore } from "pocketbase";
import {
  PocketbaseContextType,
  PocketbaseSession,
  UserInfo,
} from "../types/pocketbase";

const PocketbaseContext = createContext<PocketbaseContextType | undefined>(
  undefined,
);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [pbSession, setPbSession] = useState<PocketbaseSession | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  const store = new AsyncAuthStore({
    save: async (serialized) => {
      AsyncStorage.setItem("pb_auth", serialized);
    },
    initial: AsyncStorage.getItem("pb_auth"),
  });

  const pb = new Pocketbase("http://10.0.0.35:8090", store);
  setPbSession({ pb });

  return (
    <PocketbaseContext.Provider
      value={{ signedIn, setSignedIn, pbSession, setPbSession }}
    >
      {children}
    </PocketbaseContext.Provider>
  );
};

export const usePocketbase = (): PocketbaseContextType => {
  const context = useContext(PocketbaseContext);

  if (context === undefined) {
    throw new Error("useFile must be used within a FileProvider");
  }
  return context;
};
