import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
	headerShadow: {
		shadowColor: "black",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.6,
		shadowRadius: 10,
	},
	largeBottomShadow: {
		shadowColor: "black",
		shadowOffset: {
			height: 10,
			width: 0,
		},
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 15,
	},
	smallBottomShadow: {
		shadowColor: "black",
		shadowOffset: {
			height: 1,
			width: 0,
		},
		shadowOpacity: 0.5,
		shadowRadius: 5,
		elevation: 10,
	},
	largeTopShadow: {
		shadowColor: "black",
		shadowOffset: {
			height: -10,
			width: 0,
		},
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 15,
	},
	smallTopShadow: {
		shadowColor: "black",
		shadowOffset: {
			height: -1,
			width: 0,
		},
		shadowOpacity: 0.25,
		shadowRadius: 10,
		elevation: 10,
	},
});
