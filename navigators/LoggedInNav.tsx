import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabsNav from "./TabsNav";
import UploadNav from "./UploadNav";
import UploadForm from "../screens/UploadForm";
import { Ionicons } from "@expo/vector-icons";
import MessagesNav from "./MessagesNav";

const Stack = createStackNavigator();

export default function LoggedInNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        options={{ headerShown: false }}
        component={TabsNav}
      />
      <Stack.Screen
        name="Upload"
        options={{ headerShown: false }}
        component={UploadNav}
      />
      <Stack.Screen
        options={{
          headerBackTitleVisible: false,

          headerBackImage: ({ title }: any) => (
            <Ionicons color="white" name="close" size={28} />
          ),
          title: "Upload",
          headerTintColor: "white",
          headerStyle: { backgroundColor: "black" },
        }}
        name="UploadForm"
        component={UploadForm}
      />
      <Stack.Screen
        name="Messages"
        options={{ headerShown: false }}
        component={MessagesNav}
      />
    </Stack.Navigator>
  );
}
