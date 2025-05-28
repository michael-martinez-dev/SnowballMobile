import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { usePocketbase } from "../properties/pocketbaseContext"; // Adjusted path
import {
  getAllDebtRecords,
  updateDebtRecord,
} from "../services/pocketbaseService"; // Adjusted path
import { DebtRecord } from "../types/database"; // Adjusted path
import { formatter } from "../properties/utils"; // Adjusted path
import Ionicons from "@expo/vector-icons/Ionicons";
import DebtDetails from "./debtDetails";

export default function DataDisplay() {
  const { pbSession, signedIn } = usePocketbase();
  const [dbContent, setDbContent] = useState<DebtRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDebtDetails, setShowDebtDetails] = useState<boolean>(false);
  const [selectedDebtRecord, setSelectedDebtRecord] =
    useState<DebtRecord | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDebtRecords = useCallback(async () => {
    if (!pbSession?.pb || !signedIn) {
      setDbContent([]);
      return;
    }
    setLoading(true);
    try {
      const records = await getAllDebtRecords(pbSession.pb);
      setDbContent(records);
    } catch (error: any) {
      console.error("Error loading debt records:", error);
      Alert.alert(
        "Error",
        "Failed to load debt records: " + (error.message || "Unknown error"),
      );
    } finally {
      setLoading(false);
    }
  }, [pbSession, signedIn]);

  useEffect(() => {
    loadDebtRecords();
  }, [loadDebtRecords]);

  const handleSaveDebtRecord = async (debtDetailsToSave: DebtRecord) => {
    if (!pbSession?.pb) {
      Alert.alert("Error", "Pocketbase session not available.");
      return;
    }
    if (Object.keys(debtDetailsToSave).length > 0 && debtDetailsToSave.id) {
      const { id, user, ...dataToUpdate } = debtDetailsToSave; // Exclude id and user
      try {
        await updateDebtRecord(pbSession.pb, id, dataToUpdate);
        loadDebtRecords(); // Refresh data
      } catch (error: any) {
        console.error("Error updating record:", error);
        Alert.alert(
          "Error",
          "Failed to save debt record: " + (error.message || "Unknown error"),
        );
      }
    }
  };

  const addDebtRecord = () => {};

  const onPressHandler = (debtItem?: DebtRecord) => {
    if (debtItem) {
      setSelectedDebtRecord(debtItem);
    }
    setShowDebtDetails(!showDebtDetails);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDebtRecords();
    setRefreshing(false);
  }, [loadDebtRecords]);

  if (!signedIn) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Text style={styles.infoText}>Please sign in to view your debts.</Text>
      </View>
    );
  }

  if (loading && !refreshing && dbContent.length === 0) {
    return (
      <View style={styles.centeredMessageContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
      >
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
        {dbContent.length === 0 && !loading ? (
          <Text style={styles.infoText}>No debt records found.</Text>
        ) : (
          dbContent.map((item) => {
            // item is already DebtRecord
            const name = item.name;
            const total = formatter.format(item.total);
            const monthlyMin = formatter.format(item.monthly_min);
            const monthlyActual = formatter.format(item.monthly_actual);

            return (
              <View key={item.id} style={styles.debtRow}>
                <TouchableOpacity
                  style={styles.name}
                  onPress={() => onPressHandler(item)}
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
          })
        )}
        {selectedDebtRecord && (
          <DebtDetails
            showDebtDetails={showDebtDetails}
            debtDetails={selectedDebtRecord}
            onPressHandler={() => onPressHandler()} // To close
            saveDebt={handleSaveDebtRecord}
          />
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  centeredMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
  },
  infoText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
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
});
