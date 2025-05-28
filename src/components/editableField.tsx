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
    if (!isEditing && value !== undefined) {
      setInput(value.toString());
    }
  }, [value, isEditing]);

  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    setInput(cleaned);
  };

  const handleBlur = () => {
    const parsed = parseFloat(input);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
    setIsEditing(false);
  };

  const getDisplayValue = () => {
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
