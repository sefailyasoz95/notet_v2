import React from "react";
import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack";
import { AuthStackParams } from "../utils/types";
import OnboardingScreen from "../screens/OnboardingScreen";

const Auth = createStackNavigator<AuthStackParams>();
const options: StackNavigationOptions = {
	headerShown: false,
};
const AuthStack = () => {
	return (
		<Auth.Navigator screenOptions={options}>
			<Auth.Screen name='OnboardingScreen' component={OnboardingScreen} />
		</Auth.Navigator>
	);
};

export default AuthStack;
