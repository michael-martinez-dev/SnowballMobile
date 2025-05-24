import React, { useEffect, useState } from "react";
import {
  Alert,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useFile } from "../properties/fileContext";
import { openDatabase, queryDatabase } from "../services/databaseService";
import { QueryResult, SumResult } from "../types/database";
import { formatter } from "../properties/utils";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TotalsDisplay() {
  const { selectedFile } = useFile();
  const [loading, setLoading] = useState(false);
  const [dbOpened, setDbOpened] = useState(false);
  const [totalsSum, setTotalsSum] = useState(0);
  const [monthlySum, setMonthlySum] = useState(0);

  const loadDatabase = async () => {
    if (selectedFile) {
      setLoading(true);
      try {
        openDatabase(selectedFile.localPath);
        setDbOpened(true);

        const totalsResult: QueryResult = queryDatabase(
          "SELECT SUM(total) FROM debt_records",
        );
        const totalsSum = totalsResult[0] as SumResult;
        setTotalsSum(totalsSum["SUM(total)"]);

        const monthlyResult: QueryResult = queryDatabase(
          "SELECT SUM(monthly_actual) FROM debt_records",
        );
        const sumMonthly = monthlyResult[0] as SumResult;
        setMonthlySum(sumMonthly["SUM(monthly_actual)"]);
      } catch (err) {
        console.error("Error opening database:", err);
        Alert.alert("Error", "Error occured while opening the database");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  if (!selectedFile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Please select a SQLite file.</Text>
      </View>
    );
  }

  if (!dbOpened) {
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "white" }}>Database is not opened.</Text>
    </View>;
  }

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.contentContainer}>
      <View style={styles.debtRow}>
        <Text style={[styles.infoText, styles.key]}>Total Debt:</Text>
        <Text style={[styles.infoText, styles.value]}>
          {formatter.format(totalsSum)}
        </Text>
      </View>
      <View style={styles.debtRow}>
        <Text style={[styles.infoText, styles.key]}>Monthly Payment:</Text>
        <Text style={[styles.infoText, styles.value]}>
          {formatter.format(monthlySum)}
        </Text>
      </View>
      {dbOpened ? (
        ""
      ) : (
        <Text style={styles.infoText}>
          WARNING: Not connected to the database!
        </Text>
      )}
      <View style={styles.refreshContainer}>
        <TouchableOpacity onPress={loadDatabase}>
          <Ionicons name="refresh" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    color: "white",
    fontSize: 16,
  },
  key: {
    flex: 2,
    fontWeight: "bold",
  },
  value: {
    flex: 1,
    textAlign: "right",
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#25292e",
    alignItems: "center",
    width: "100%",
  },
  debtRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    borderTopWidth: 1,
    borderTopColor: "#444",
    width: "100%",
  },
  refreshContainer: {
    paddingVertical: 4,
    alignItems: "center",
    backgroundColor: "#25292e",
  },
});
