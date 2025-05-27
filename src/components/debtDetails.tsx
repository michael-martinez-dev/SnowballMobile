import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { formatter } from "../properties/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DebtRecord } from "../types/database";
import { useState, useEffect } from "react";
import EditableField from "./editableField";
import useEffectAfterMount from "../utils/helpers";

type DataDisplayProps = {
  showDebtDetails: boolean;
  debtDetails: DebtRecord;
  onPressHandler: () => void;
  saveDebt: (debt: DebtRecord) => void;
};

export default function DebtDetails(props: DataDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [debt, setDebt] = useState<DebtRecord | null>(null);

  useEffectAfterMount(() => {
    if (props.showDebtDetails && props.debtDetails) {
      setDebt({ ...props.debtDetails });
    }
  }, [props.showDebtDetails, props.debtDetails]);

  useEffectAfterMount(() => {
    console.log("Debt change...");
    if (debt !== null) {
      props.saveDebt(debt);
    }
  }, [debt]);

  const updateDebtField = (key: keyof DebtRecord, value: number | string) => {
    setDebt((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <Modal visible={props.showDebtDetails}>
      <View style={styles.contentContainer}>
        <View style={styles.debtDetailsRow}>
          <Text style={[styles.header, styles.debtText, styles.debtDetailKey]}>
            Name:
          </Text>
          <Text style={[styles.debtText, styles.debtDetailVal]}>
            {props.debtDetails.name}
          </Text>
        </View>
        <View style={styles.debtDetailsRow}>
          <Text style={[styles.header, styles.debtText, styles.debtDetailKey]}>
            Type:
          </Text>
          <Text style={styles.debtText}>{props.debtDetails.debt_type}</Text>
        </View>
        <View style={styles.debtDetailsRow}>
          <Text style={[styles.header, styles.debtText, styles.debtDetailKey]}>
            Total:
          </Text>
          <EditableField
            value={debt?.total}
            onChange={(val) => {
              updateDebtField("total", val);
            }}
            format={formatter.format}
            placeholder="Enter total..."
          />
        </View>
        <View style={styles.debtDetailsRow}>
          <Text style={[styles.header, styles.debtText, styles.debtDetailKey]}>
            Min:
          </Text>
          <EditableField
            value={debt?.monthly_min}
            onChange={(val) => {
              updateDebtField("monthly_min", val);
            }}
            format={formatter.format}
            placeholder="Enter monthly min..."
          />
        </View>
        <View style={styles.debtDetailsRow}>
          <Text style={[styles.header, styles.debtText, styles.debtDetailKey]}>
            Actual:
          </Text>
          <EditableField
            value={debt?.monthly_actual}
            onChange={(val) => {
              updateDebtField("monthly_actual", val);
            }}
            format={formatter.format}
            placeholder="Enter monthly actual..."
          />
        </View>
        <View style={styles.debtDetailsRow}>
          <Text style={[styles.header, styles.debtText, styles.debtDetailKey]}>
            Interest:
          </Text>
          <Text style={[styles.debtText, styles.debtDetailVal]}>
            {props.debtDetails.interest}%
          </Text>
        </View>
        <View style={styles.debtDetailsRow}>
          <Text style={[styles.header, styles.debtText, styles.debtDetailKey]}>
            Due:
          </Text>
          <Text style={[styles.debtText, styles.debtDetailVal]}>
            {props.debtDetails.due_day}
          </Text>
        </View>
        <View style={styles.circleButtonContainer}>
          <Pressable style={styles.circleButton} onPress={props.onPressHandler}>
            <Ionicons size={24} name={"close"} color={"white"} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#25292e",
    alignItems: "center",
    width: "100%",
  },
  debtDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
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
  debtDetailKey: {
    flex: 2,
    textAlign: "left",
  },
  debtDetailVal: {
    flex: 1,
    textAlign: "right",
  },
  circleButtonContainer: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 24,
    position: "absolute",
    bottom: 40,
  },
  circleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
