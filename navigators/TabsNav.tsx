import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Feed from "../screens/Feed";
import Search from "../screens/Search";
import Notifications from "../screens/Notifications";
import Profile from "../screens/Profile";
import { Image, View } from "react-native";
import TabIcon from "../components/nav/TabIcon";
import StackNavFactory from "./StackNavFactory";
import useUser from "../hooks/userUser";

const Tabs = createBottomTabNavigator();

export default function TabsNav() {
  const { data } = useUser();
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "black",
          borderTopColor: "rgba(255,255,255,0.3)",
        },
        tabBarActiveTintColor: "white",
      }}
    >
      <Tabs.Screen
        name="tabFeed"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon iconName={"home"} color={color} focused={focused} />
          ),
        }}
      >
        {() => <StackNavFactory screenName="Feed" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="tabSearch"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon iconName={"search"} color={color} focused={focused} />
          ),
        }}
      >
        {() => <StackNavFactory screenName="Search" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="tabCamera"
        component={View}
        listeners={({ navigation }) => {
          return {
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Upload");
            },
          };
        }}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon iconName={"camera"} color={color} focused={focused} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="tabNotifications"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon iconName={"heart"} color={color} focused={focused} />
          ),
        }}
      >
        {() => <StackNavFactory screenName="Notifications" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="tabMe"
        options={{
          tabBarIcon: ({ focused, color }) =>
            data?.me?.avatar ? (
              <Image
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 15,
                  ...(focused && {
                    borderColor: "white",
                    borderWidth: 1.5,
                    height: 24,
                    width: 24,
                  }),
                }}
                source={{ uri: data.me.avatar }}
              />
            ) : (
              <TabIcon iconName={"person"} color={color} focused={focused} />
            ),
        }}
      >
        {() => <StackNavFactory screenName="Me" />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}
