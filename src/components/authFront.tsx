import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

type AuthFrontProps = {
  signup: boolean;
};

export default function AuthFront(props: AuthFrontProps) {
  const handleSignUp = () => {
    console.log("Handling sign up...");
  };

  const handleSignIn = () => {
    console.log("Handling sign in...");
  };

  if (props.signup) {
    return (
      <View style={styles.signupContainer}>
        <Text>SIGN UP FORM</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.signinContainer}>
        <Text>SIGN IN FORM</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  signupContainer: {},
  signinContainer: {},
});
