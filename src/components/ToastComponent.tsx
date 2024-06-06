import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import { DEVICE_WIDTH } from "../utils/constants";
import { Ionicons } from "@expo/vector-icons";
// import { BlurView } from "expo-blur";

export type ToastProps = {
	message: string;
	icon: "close-sharp" | "checkmark-sharp" | "warning-sharp";
	type: "error" | "success" | "warning";
};

function ToastComponent({ message, icon, type }: ToastProps) {
	const color = useMemo(() => (type === "error" ? "#dd4444" : type === "success" ? "#44aa44" : "#aaaa00"), [type]);
	const { t } = useTranslation();
	return (
		<BlurView
			intensity={40}
			style={{
				overflow: "hidden",
				borderColor: color,
			}}
			className={`flex-row items-center border-2 w-11/12 mt-5 px-3 gap-x-2 py-2.5 rounded-full bg-opacity-50`}>
			{/* <View className={`flex-row items-center bg-gray-500 w-10/12 mt-5 px-3 py-1 rounded-full`}> */}
			<Ionicons name={icon} size={25} color={color} />
			<Text
				className={`font-bold text-white`}
				style={{
					width: DEVICE_WIDTH - 1000,
					overflow: "hidden",
					fontSize: 14,
					color,
				}}>
				{t(message)}
			</Text>
			{/* </View> */}
		</BlurView>
	);
}

export default ToastComponent;
