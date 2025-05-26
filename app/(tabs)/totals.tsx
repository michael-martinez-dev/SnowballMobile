import { Text, View, StyleSheet } from "react-native";
// Removed useFile as it's no longer needed
import TotalsDisplay from "@/src/components/totalsDisplay";

export default function TotalsScreen() {
  // selectedFile is no longer needed here as TotalsDisplay handles its own data fetching
  // based on signedIn state from usePocketbase, which it uses internally.

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
    // justifyContent: "flex-start", // TotalsDisplay will center its content if not signed in
    alignItems: "center",
    paddingTop: 20, // Added padding to give space from top
  },
  // text style was not used, removed
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20, // Increased margin for better separation
    // marginTop: 20, // This is handled by paddingTop in container now
  },
});
