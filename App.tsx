import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { Appearance, Text, View } from "react-native";
import LoggedOutNav from "./navigators/LoggedOutNav";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import client, { isLoggedInVar, tokenVar, cache } from "./apollo";
import LoggedInNav from "./navigators/LoggedInNav";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  persistCache,
  AsyncStorageWrapper,
  CachePersistor,
} from "apollo3-cache-persist";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(Ionicons.font);
        await Asset.loadAsync(require("./assets/logo.png"));
        // await persistCache({
        //   cache,
        //   storage: new AsyncStorageWrapper(AsyncStorage),
        // });
        const persistor = new CachePersistor({
          cache,
          storage: new AsyncStorageWrapper(AsyncStorage),
        });
        await persistor.purge();
        // persistor.purge() to purge the local cache OR persister.restore() to maintain

        const token = await AsyncStorage.getItem("token");
        if (token) {
          isLoggedInVar(true);
          tokenVar(token);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, [isLoggedIn]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <View onLayout={onLayoutRootView}></View>
      <ApolloProvider client={client}>
        <NavigationContainer>
          {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
        </NavigationContainer>
      </ApolloProvider>
    </>
  );
}
