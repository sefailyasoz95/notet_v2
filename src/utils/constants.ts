import { Dimensions } from "react-native";
import Animated, { SharedTransition, withSpring, WithSpringConfig } from "react-native-reanimated";

const SPRING_CONFIG = {
	mass: 1,
	stiffness: 100,
	damping: 200,
};

export const sharedElementTransition = SharedTransition.custom((values) => {
	"worklet";
	return {
		height: withSpring(values.targetHeight, SPRING_CONFIG),
		width: withSpring(values.targetWidth, SPRING_CONFIG),
		originX: withSpring(values.targetGlobalOriginX, SPRING_CONFIG),
		originY: withSpring(values.targetGlobalOriginY, SPRING_CONFIG),
	};
});
export const DEVICE_WIDTH = Dimensions.get("window").width;
export const DEVICE_HEIGHT = Dimensions.get("window").height;

export const TokenArray = [
	{
		text: "buy10",
		value: 10,
		price: 0.99,
	},
	{
		text: "buy50",
		value: 50,
		price: 3.99,
	},
];

export const supabaseDBpassword = "AlpEge2024!!";
export const supabaseURL = "https://ygdgpwacbomfcpljqlwv.supabase.co";
export const supabaseAPIkey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZGdwd2FjYm9tZmNwbGpxbHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc0NTM0MDYsImV4cCI6MjAzMzAyOTQwNn0.axRrTZsF0v1wmDdceAdBGF6-8whcZZdsd9ecsfmEwos";
