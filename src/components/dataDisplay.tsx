import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  RefreshControl,
} from "react-native";
import { useFile } from "../properties/fileContext";
import {
  openDatabase,
  queryDatabase,
  saveDatabase,
  updateDatabase,
} from "../services/databaseService";
import { DebtRecord, QueryResult } from "../types/database";
import { formatter } from "../properties/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import DebtDetails from "./debtDetails";

export default function DataDisplay() {
  const { selectedFile } = useFile();
  const [dbContent, setDbContent] = useState<QueryResult>([] as QueryResult);
  const [loading, setLoading] = useState(false);
  const [dbOpened, setDbOpened] = useState(false);
  const [showDebtDetails, setShowDebtDetails] = useState<boolean>(false);
  const [debtDetails, setDebtDetails] = useState<DebtRecord>({} as DebtRecord);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log("Change to selectedFile...");
    loadDatabase();
  }, [selectedFile]);

  const loadDatabase = async () => {
    console.log("Loading database...");
    if (selectedFile) {
      setLoading(true);
      try {
        openDatabase(selectedFile.uri);
        setDbOpened(true);

        const result: QueryResult = queryDatabase(
          "SELECT * FROM debt_records ORDER BY total * 1;",
        );

        setDbContent(result);
      } catch (err) {
        console.error("Error opening database:", err);
        Alert.alert("Error", "Error occured while opening the database");
      } finally {
        setLoading(false);
      }
    }
  };

  const saveData = async (debtDetails: DebtRecord) => {
    console.log("Save?");
    if (Object.keys(debtDetails).length > 0) {
      console.log("Saving data...");
      console.log(debtDetails);
      // TODO: add validation to DebtRecord
      if (selectedFile) {
        try {
          openDatabase(selectedFile.uri);
          setDbOpened(true);

          updateDatabase(`
            UPDATE debt_records
            SET total = '${debtDetails.total}',
                monthly_min = '${debtDetails.monthly_min}',
                monthly_actual = '${debtDetails.monthly_actual}',
                interest = '${debtDetails.interest}',
                due_day = '${debtDetails.due_day}'
            WHERE id = ${debtDetails.id};
          `);
          if (selectedFile?.localPath && selectedFile?.uri) {
            const success = saveDatabase(
              selectedFile.uri,
              selectedFile.localPath,
            );
            if (success) {
              Alert.alert("Success", "Database exported successfully.");
            } else {
              Alert.alert("Error", "No valid file paths found to export.");
            }
          }
        } catch (err) {
          console.error("Error opening database:", err);
          Alert.alert("Error", "Error occured while opening the database");
        }
      }
    }
    loadDatabase();
  };

  const onPressHandler = () => {
    setShowDebtDetails(!showDebtDetails);
  };

  const onRefresh = useCallback(async () => {
    console.log("Refreshing...");
    setRefreshing(true);
    await loadDatabase();
    setRefreshing(false);
  }, [selectedFile]);

  if (!selectedFile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Please select a SQLite file.</Text>
      </View>
    );
  }

  if (!dbOpened) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Database is not opened.</Text>
      </View>
    );
  }

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.debtRow}>
          <Text style={[styles.debtText, styles.header, styles.name]}>
            Name
          </Text>
          <Text style={[styles.debtText, styles.header, styles.amount]}>
            Total
          </Text>
          <Text style={[styles.debtText, styles.header, styles.payment]}>
            Monthly
          </Text>
        </View>
        {dbContent.length === 0 ? (
          <Text style={styles.infoText}>No data found.</Text>
        ) : (
          dbContent.map((item, index) => {
            if ("id" in item) {
              const name = item.name;
              const total = formatter.format(item.total);
              const monthlyMin = formatter.format(item.monthly_min);
              const monthlyActual = formatter.format(item.monthly_actual);

              return (
                <View key={index} style={styles.debtRow}>
                  <TouchableOpacity
                    style={styles.name}
                    onPress={() => {
                      onPressHandler();
                      setDebtDetails(item);
                    }}
                  >
                    <Text style={styles.debtText}>{name}</Text>
                  </TouchableOpacity>
                  <Text style={[styles.debtText, styles.amount]}>{total}</Text>
                  <Text style={[styles.debtText, styles.payment]}>
                    {monthlyMin}
                    {monthlyMin !== monthlyActual ? `/ ${monthlyActual}` : ""}
                  </Text>
                </View>
              );
            }
          })
        )}
        <DebtDetails
          showDebtDetails={showDebtDetails}
          debtDetails={debtDetails}
          onPressHandler={onPressHandler}
          saveDebt={saveData}
        />
      </ScrollView>
      <View style={styles.refreshContainer}>
        <TouchableOpacity onPress={loadDatabase}>
          <Ionicons name="refresh" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  infoText: {
    color: "white",
    fontSize: 16,
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
    width: "100%",
  },
  debtText: {
    color: "white",
    fontSize: 16,
  },
  header: {
    fontWeight: "bold",
    fontSize: 18,
  },
  name: {
    flex: 2,
    textAlign: "left",
  },
  amount: {
    flex: 1,
    textAlign: "right",
  },
  payment: {
    flex: 1,
    textAlign: "right",
  },
  refreshContainer: {
    paddingVertical: 4,
    alignItems: "center",
    backgroundColor: "#25292e",
  },
});
