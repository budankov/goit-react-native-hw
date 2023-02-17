import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";

export const useFont = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "Roboto-Regular": require("../fonts/Roboto-Regular.ttf"),
          "Roboto-Medium": require("../fonts/Roboto-Medium.ttf"),
          "Roboto-Bold": require("../fonts/Roboto-Bold.ttf"),
          "Inter-Medium": require("../fonts/Inter-Medium.ttf"),
        });
      } catch (e) {
        console.log(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  return { appIsReady, onLayoutRootView };
};
