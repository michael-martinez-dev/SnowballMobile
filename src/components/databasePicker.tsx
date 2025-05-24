import React, { useState } from "react";
import { Alert, View, Text, Button, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { DocumentPickerResult } from "expo-document-picker";
import { useFile } from "../properties/fileContext";
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system";

export default function DatabasePicker() {
  const { selectedFile, setSelectedFile } = useFile();

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.name.toLowerCase().endsWith(".db")) {
          const fileHash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            asset.uri,
          );
          const sandboxPath = `${FileSystem.documentDirectory}${fileHash}.db`;

          await FileSystem.copyAsync({
            from: asset.uri,
            to: sandboxPath,
          });

          console.log({
            name: asset.name,
            uri: asset.uri,
            localPath: sandboxPath,
          });

          setSelectedFile({
            name: asset.name,
            uri: asset.uri,
            localPath: sandboxPath,
          });
        } else {
          Alert.alert(
            "Invalid File",
            "Please select a file with .db extention",
          );
        }
      }
    } catch (err) {
      console.error("DocumentPicker Error:", err);
      Alert.alert("Error", "An error occurred while picking the document.");
    }
  };

  return (
    <View style={styles.container}>
      <Button
        color="#444"
        title="Select Database File"
        onPress={handlePickDocument}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  fileButton: {},
  fileInfo: {
    marginTop: 20,
    alignItems: "center",
  },
  fileName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  fileUri: {
    color: "white",
    fontSize: 14,
  },
});
