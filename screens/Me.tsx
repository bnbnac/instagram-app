import React, { useEffect } from "react";
import { Text, View } from "react-native";
import useUser from "../hooks/userUser";

export default function Me({ navigation }: any) {
  const { data } = useUser();
  useEffect(() => {
    navigation.setOptions({
      title: data?.me?.username,
    });
  }, []);
  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white" }}>Me</Text>
    </View>
  );
}
