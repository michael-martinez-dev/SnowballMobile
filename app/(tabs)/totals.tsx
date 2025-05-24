import { Text, View, StyleSheet } from "react-native";
import { useFile } from "@/src/properties/fileContext";
import TotalsDisplay from "@/src/components/totalsDisplay";

export default function TotalsScreen() {
  const { selectedFile } = useFile();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Totals</Text>
      <TotalsDisplay />
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
  text: {
    color: "white",
    fontSize: 24,
    paddingTop: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 20,
  },
});
