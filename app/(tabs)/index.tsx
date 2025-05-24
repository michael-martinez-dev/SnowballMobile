import { useState } from "react";
import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
import DatabasePicker from "@/src/components/databasePicker";
import DataDisplay from "@/src/components/dataDisplay";
import { usePocketbase } from "@/src/properties/pocketbaseContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthFront from "@/src/components/authFront";

const DATABASE_FILE_INFO = "DatabaseFileInfo";

export default function Index() {
  const { signedIn, setSignedIn, pbSession, setPbSession } = usePocketbase();
  const [signUp, setSignUp] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debts</Text>

      <View style={styles.fileContainer}>
        {signedIn ? (
          <Text>Logout</Text>
        ) : (
          <View>
            <Button
              color="#444"
              title="Sign In"
              onPress={() => {
                setSignUp(false);
              }}
            />
            <Button
              color="#444"
              title="Sign Up"
              onPress={() => {
                setSignUp(true);
              }}
            />
            <AuthFront signup={signUp} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  debtsContainer: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#25292e",
    paddingBottom: 20,
  },
  fileContainer: {
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
});
