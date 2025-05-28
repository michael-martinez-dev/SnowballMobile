import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { usePocketbase } from "../properties/pocketbaseContext"; // Adjusted path

type AuthFrontProps = {
  signup: boolean;
};

export default function AuthFront(props: AuthFrontProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const { pbSession, setSignedIn } = usePocketbase();

  const handleSignUp = async () => {
    if (!pbSession) {
      Alert.alert("Error", "Pocketbase session not available.");
      return;
    }
    setLoading(true);
    if (password !== passwordConfirm) {
      Alert.alert("Error", "Passwords do not match!");
      setLoading(false);
      return;
    }
    const data = {
      name,
      email,
      password,
      passwordConfirm,
    };
    try {
      await pbSession.pb.collection("users").create(data);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  };

  const handleSignIn = async () => {
    if (!pbSession) {
      Alert.alert("Error", "Pocketbase session not available.");
      return;
    }
    setLoading(true);
    try {
      await pbSession.pb.collection("users").authWithPassword(email, password);
      setSignedIn(true);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  };

  if (props.signup) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          keyboardType="default"
          autoCapitalize="none"
          placeholderTextColor="white"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="white"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="white"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          secureTextEntry
          placeholderTextColor="white"
        />
        <Button
          title={loading ? "Signing Up..." : "Sign Up"}
          onPress={handleSignUp}
          disabled={loading}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="white"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="white"
        />
        <Button
          title={loading ? "Signing In..." : "Sign In"}
          onPress={handleSignIn}
          disabled={loading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "white",
  },
  input: {
    color: "white",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
