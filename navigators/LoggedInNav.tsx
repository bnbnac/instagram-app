import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabsNav from "./TabsNav";
import Upload from "../screens/Upload";

const Stack = createStackNavigator();

export default function LoggedInNav() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, presentation: "modal" }}
    >
      <Stack.Screen name="Tabs" component={TabsNav} />
      <Stack.Screen name="Upload" component={Upload} />
    </Stack.Navigator>
  );
}
