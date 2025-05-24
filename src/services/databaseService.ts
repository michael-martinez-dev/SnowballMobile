import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { QueryResult } from "../types/database";

let db: SQLite.SQLiteDatabase | null = null;
let realPath: string = "";

export const openDatabase = (sandboxPath: string): SQLite.SQLiteDatabase => {
  // realPath = sandboxPath;
  db = SQLite.openDatabaseSync(sandboxPath);
  return db;
};

export const queryDatabase = (query: string): QueryResult => {
  if (!db) {
    throw new Error("Database is not open");
  }
  return db.getAllSync(query);
};

export const updateDatabase = (query: string) => {
  if (!db) {
    throw new Error("Database is not open");
  }
  db.runSync(query);
};

export const saveDatabase = (to: string, from: string) => {
  if (to && from) {
    try {
      FileSystem.copyAsync({
        from: from,
        to: to,
      });
      return true;
    } catch (err) {
      console.error("Failed to copy back to original database file: ", err);
      return false;
    }
  }
  return false;
};
