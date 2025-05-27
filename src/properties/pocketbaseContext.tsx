import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Pocketbase, { AsyncAuthStore } from "pocketbase";
import Constants from "expo-constants";
import {
  PocketbaseContextType,
  PocketbaseSession,
  UserInfo,
} from "../types/pocketbase";

const PocketbaseContext = createContext<PocketbaseContextType | undefined>(
  undefined,
);

export const PocketbaseProvider = ({ children }: { children: ReactNode }) => {
  const [pbSession, setPbSession] = useState<PocketbaseSession | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const store = new AsyncAuthStore({
      save: async (serialized) => {
        AsyncStorage.setItem("pb_auth", serialized);
      },
      initial: AsyncStorage.getItem("pb_auth"),
    });

    const POCKETBASE_URL =
      process.env.EXPO_PUBLIC_POCKETBASE_URL ||
      Constants.expoConfig?.extra?.pocketbaseUrl ||
      "http://127.0.0.1:8090";

    const pb = new Pocketbase(POCKETBASE_URL, store);

    setPbSession({ pb });
  }, []);

  const contextValue = useMemo(
    () => ({
      signedIn,
      setSignedIn,
      pbSession,
      setPbSession,
    }),
    [signedIn, pbSession],
  );

  return (
    <PocketbaseContext.Provider value={contextValue}>
      {children}
    </PocketbaseContext.Provider>
  );
};

export const usePocketbase = (): PocketbaseContextType => {
  const context = useContext(PocketbaseContext);

  if (context === undefined) {
    throw new Error("usePocketbase must be used within a PocketbaseProvider");
  }
  return context;
};
