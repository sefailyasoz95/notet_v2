import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "./src/redux/store";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setonboardingPassed } from "./src/redux/reducers";
import AppStack from "./src/stacks/AppStack";
import AuthStack from "./src/stacks/AuthStack";
import i18next from "i18next";

const Main = () => {
	const { onboardingPassed } = useAppSelector((state) => state.global);
	const dispatch = useAppDispatch();
	const [loaded] = useFonts({
		SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
	});
	const checkOnboarding = async () => {
		// await AsyncStorage.removeItem("onBoardingPassed");
		// await AsyncStorage.removeItem("appLang");

		const isPassed = await AsyncStorage.getItem("onBoardingPassed");
		const appLang = await AsyncStorage.getItem("appLang");
		if (isPassed !== null) {
			if (appLang !== null) {
				i18next.changeLanguage(appLang);
			}
			dispatch(setonboardingPassed(true));
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
