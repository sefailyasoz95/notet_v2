import React, { useMemo } from "react";
import { Text, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import { DEVICE_WIDTH } from "../utils/constants";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, SlideInUp } from "react-native-reanimated";

export type ToastProps = {
	message: string;
	icon: "close-sharp" | "checkmark-sharp" | "warning-sharp";
	type: "error" | "success" | "warning";
};

function ToastComponent({ message, icon, type }: ToastProps) {
	const { t } = useTranslation();

	const toastConfig = useMemo(() => {
		switch (type) {
			case "error":
				return {
					bg: "bg-red-500",
					darkBg: "dark:bg-red-900",
					textColor: "text-red-50",
					darkTextColor: "dark:text-red-50",
					iconColor: "#FEE2E2",
				};
			case "success":
				return {
					bg: "bg-green-500",
					darkBg: "dark:bg-green-900",
					textColor: "text-green-50",
					darkTextColor: "dark:text-green-50",
					iconColor: "#ECFDF5",
				};
			case "warning":
				return {
					bg: "bg-yellow-500",
					darkBg: "dark:bg-yellow-900",
					textColor: "text-yellow-50",
					darkTextColor: "dark:text-yellow-50",
					iconColor: "#FEFCE8",
				};
		}
	}, [type]);

	return (
		<Animated.View
			entering={FadeIn.duration(200)}
			style={[styles.toastShadow]}
			className='absolute top-12 self-center z-50'>
			<BlurView
				intensity={40}
				className={`flex-row items-center px-4 py-3 overflow-hidden rounded-2xl ${toastConfig.bg} ${toastConfig.darkBg}`}>
				<View className='flex-row items-center space-x-3'>
					<View className='w-8 h-8 bg-white/20 rounded-xl items-center justify-center'>
						<Ionicons name={icon} size={20} color={toastConfig.iconColor} />
					</View>
					<Text
						className={`font-semibold ${toastConfig.textColor} ${toastConfig.darkTextColor}`}
						numberOfLines={2}
						style={{ maxWidth: DEVICE_WIDTH - 100 }}>
						{t(message)}
					</Text>
				</View>
			</BlurView>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	toastShadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.25,
		shadowRadius: 16,
		elevation: 12,
	},
});

export default ToastComponent;
