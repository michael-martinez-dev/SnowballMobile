import { useState } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native"; // Removed ScrollView
import DataDisplay from "@/src/components/dataDisplay";
import { usePocketbase } from "@/src/properties/pocketbaseContext";
import AuthFront from "@/src/components/authFront";

export default function Index() {
  const { signedIn, setSignedIn, pbSession, setPbSession } = usePocketbase();
  const [signUp, setSignUp] = useState(false);

  const handleLogout = () => {
    if (pbSession) {
      pbSession.pb.authStore.clear();
    }
    setSignedIn(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debts</Text>

      {signedIn ? (
        <>
          <View style={styles.authActionContainer}>
            <Button title="Logout" onPress={handleLogout} color="#c70000" />
          </View>
          <DataDisplay />
        </>
      ) : (
        <View style={styles.authFormContainer}>
          <AuthFront signup={signUp} />
          <View style={styles.authToggleContainer}>
            <Button
              color="#444"
              title={signUp ? "Switch to Sign In" : "Switch to Sign Up"}
              onPress={() => setSignUp(!signUp)}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    paddingTop: 10, // Added some padding
  },
  authActionContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  authFormContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  authToggleContainer: {
    marginTop: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
});
