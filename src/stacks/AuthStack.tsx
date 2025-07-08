import React from "react";
import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack";
import { AuthStackParams } from "../utils/types";
import OnboardingScreen from "../screens/OnboardingScreen";
import PaywallScreen from "../screens/PaywallScreen";

const Auth = createStackNavigator<AuthStackParams>();
const options: StackNavigationOptions = {
	headerShown: false,
};
const AuthStack = () => {
	return (
		<Auth.Navigator screenOptions={options}>
			<Auth.Screen name='OnboardingScreen' component={OnboardingScreen} />
			<Auth.Screen
				name='PaywallScreen'
				component={PaywallScreen}
				options={{
					gestureEnabled: false,
				}}
			/>
		</Auth.Navigator>
	);
};

export default AuthStack;
