import React from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";

export default function DissmissKeyboard({ children }: any) {
  const dissmissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={dissmissKeyboard}
      disabled={Platform.OS === "web"}
    >
      {children}
    </TouchableWithoutFeedback>
  );
}
