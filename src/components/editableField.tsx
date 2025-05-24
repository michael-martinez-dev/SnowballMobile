import { TextInput, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";

type EditableFileProps = {
  value: number | undefined;
  onChange: (newValue: number) => void;
  format?: (val: number) => string;
  keyboardType?: "numeric" | "number-pad" | "decimal-pad";
  placeholder?: string;
};

export default function EditableField({
  value,
  onChange,
  format,
  keyboardType = "numeric",
  placeholder,
}: EditableFileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    console.log("Using effect...");
    if (!isEditing && value !== undefined) {
      console.log("and setting input");
      setInput(value.toString());
    }
    console.log(
      "State | input=",
      input,
      " value=",
      value,
      "editing? ",
      isEditing,
    );
  }, [value, isEditing]);

  const handleChange = (text: string) => {
    console.log("Handling change...");
    const cleaned = text.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    setInput(cleaned);
    console.log(
      "State | input=",
      input,
      " value=",
      value,
      "editing? ",
      isEditing,
    );
  };

  const handleBlur = () => {
    console.log("Handling blur...");
    const parsed = parseFloat(input);
    if (!isNaN(parsed)) {
      console.log("it's a number! ", parsed);
      onChange(parsed);
    }
    setIsEditing(false);
    console.log(
      "State | input=",
      input,
      " value=",
      value,
      "editing? ",
      isEditing,
    );
  };

  const getDisplayValue = () => {
    console.log("Getting display value...");
    console.log(
      "State | input=",
      input,
      " value=",
      value,
      "editing? ",
      isEditing,
    );
    if (isEditing) return input;
    return value !== undefined && !isNaN(value)
      ? format
        ? format(value)
        : value.toString()
      : "";
  };

  return (
    <TextInput
      style={[styles.input, styles.debtText, styles.debtDetailVal]}
      keyboardType={keyboardType}
      value={getDisplayValue()}
      onChangeText={handleChange}
      onFocus={() => {
        setIsEditing(true);
      }}
      onBlur={handleBlur}
      placeholder={placeholder}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    color: "white",
    textAlign: "right",
    fontSize: 16,
    flex: 1,
  },
  debtText: {
    color: "white",
    fontSize: 16,
  },
  debtDetailVal: {
    flex: 1,
    textAlign: "right",
  },
});
