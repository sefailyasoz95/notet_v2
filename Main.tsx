import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "./src/redux/store";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setOnboardingPassed } from "./src/redux/reducers";
import AppStack from "./src/stacks/AppStack";
import AuthStack from "./src/stacks/AuthStack";
import i18next from "i18next";
import { useColorScheme } from "nativewind";

const Main = () => {
	const { onboardingPassed } = useAppSelector((state) => state.global);
	const dispatch = useAppDispatch();
	const [loaded] = useFonts({
		SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
	});
	const { setColorScheme } = useColorScheme();

	const checkOnboarding = async () => {
		// await AsyncStorage.removeItem("onBoardingPassed");
		// await AsyncStorage.removeItem("appLang");
		const theme = await AsyncStorage.getItem("theme");
		if (theme !== null) {
			setColorScheme(theme as any);
		}
		const isPassed = await AsyncStorage.getItem("onBoardingPassed");
		const appLang = await AsyncStorage.getItem("appLang");
		if (isPassed !== null) {
			if (appLang !== null) {
				i18next.changeLanguage(appLang);
			}
			dispatch(setOnboardingPassed(true));
		}
	};

	useEffect(() => {
		checkOnboarding();
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}
	return <NavigationContainer>{!onboardingPassed ? <AuthStack /> : <AppStack />}</NavigationContainer>;
};

export default Main;
