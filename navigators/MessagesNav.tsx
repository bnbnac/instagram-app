import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Rooms from "../screens/Rooms";
import Room from "../screens/Room";
import { Ionicons } from "@expo/vector-icons";
import { StackNavFactoryParamList } from "./StackNavFactory";

const Stack = createStackNavigator();
export default function MessagesNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "white",
        haederBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <Stack.Screen
        options={{
          headerBackImage: () => (
            <Ionicons name="chevron-down" size={20} color="white" />
          ),
        }}
        name="Rooms"
        component={Rooms}
      />
      <Stack.Screen name="Room" component={Room} />
    </Stack.Navigator>
  );
}
