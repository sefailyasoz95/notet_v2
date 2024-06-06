import React from "react";
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { AppStackParams } from "../utils/types";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import WriteNoteScreen from "../screens/WriteNoteScreen";
import DescriptionScreen from "../screens/DescriptionScreen";

const App = createNativeStackNavigator<AppStackParams>();
const options: NativeStackNavigationOptions = {
	headerShown: false,
	animation: "slide_from_right",
};
const AppStack = () => {
	return (
		<App.Navigator screenOptions={options}>
			<App.Screen name='HomeScreen' component={HomeScreen} />
			<App.Screen name='ProfileScreen' component={ProfileScreen} />
			<App.Screen name='WriteNoteScreen' component={WriteNoteScreen} />
			<App.Screen name='DescriptionScreen' component={DescriptionScreen} />
		</App.Navigator>
	);
};

export default AppStack;
