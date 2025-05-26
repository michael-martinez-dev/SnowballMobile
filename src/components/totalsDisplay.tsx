import React, { useEffect, useState } from "react";
import {
  Alert,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { usePocketbase } from "../properties/pocketbaseContext"; // Adjusted path
import { getDebtTotals } from "../services/pocketbaseService"; // Adjusted path
import { formatter } from "../properties/utils"; // Adjusted path
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TotalsDisplay() {
  const { pbSession, signedIn } = usePocketbase();
  const [loading, setLoading] = useState(false);
  const [totalsSum, setTotalsSum] = useState(0);
  const [monthlySum, setMonthlySum] = useState(0);

  const loadTotals = async () => {
    if (!pbSession?.pb || !signedIn) {
      setTotalsSum(0);
      setMonthlySum(0);
      return;
    }
    console.log("Loading totals...");
    setLoading(true);
    try {
      const { totalDebt, totalMonthlyActual } = await getDebtTotals(
        pbSession.pb,
      );
      setTotalsSum(totalDebt);
      setMonthlySum(totalMonthlyActual);
    } catch (error: any) {
      console.error("Error loading totals:", error);
      Alert.alert(
        "Error",
        "Failed to load totals: " + (error.message || "Unknown error"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTotals();
  }, [signedIn, pbSession]); // Reload if signedIn state or session changes

  if (!signedIn) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Please sign in to view totals.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
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
      <View style={styles.refreshContainer}>
        <TouchableOpacity onPress={loadTotals}>
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
