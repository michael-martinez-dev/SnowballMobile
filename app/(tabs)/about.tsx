import { Text, View, StyleSheet } from "react-native";
import { useFile } from "@/src/properties/fileContext";

export default function AboutScreen() {
  const dbPath = null;
  const { selectedFile } = useFile();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debt Snowball</Text>
      <Text style={styles.version}>Version 1.0.0</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Database</Text>
        <Text style={styles.dbPath}>
          {selectedFile ? selectedFile.name : "No database selected"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to use</Text>
        <Text style={styles.text}>1. Select database file</Text>
        <Text style={styles.text}>2. View debts</Text>
        <Text style={styles.text}>3. View totals</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 20,
  },
  version: {
    color: "#aaa",
    marginBottom: 24,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 24,
    alignItems: "center",
  },
  sectionTitle: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 16,
  },
  dbPath: {
    fontFamily: "monospace",
    backgroundColor: "#444",
    color: "white",
    padding: 8,
    borderRadius: 8,
  },
  header: {
    color: "white",
    fontSize: 24,
    paddingTop: 20,
  },
  text: {
    color: "white",
    alignSelf: "flex-start",
  },
});
