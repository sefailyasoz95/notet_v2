import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderHTML from "react-native-render-html";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParams } from "../utils/types";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../utils/constants";
import Animated, { Easing, SlideInUp, FadeInUp, SlideInRight } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";

type Props = NativeStackScreenProps<AppStackParams, "DescriptionScreen">;

const DescriptionScreen = ({ navigation, route }: Props) => {
	const insets = useSafeAreaInsets();
	const source = {
		html: `
    ${route.params.description}
    `,
	};

	// Get screen title based on content type
	const getScreenTitle = () => {
		const description = route.params.description.toLowerCase();
		if (description.includes("privacy")) return "Privacy Policy";
		if (description.includes("terms")) return "Terms of Service";
		if (description.includes("about")) return "About Us";
		return "Information";
	};

	const getScreenIcon = () => {
		const description = route.params.description.toLowerCase();
		if (description.includes("privacy")) return "lock-closed";
		if (description.includes("terms")) return "document-text";
		if (description.includes("about")) return "heart";
		return "information-circle";
	};

	return (
		<SafeAreaView className='flex-1 bg-white dark:bg-gray-900' edges={["left", "right"]}>
			{/* Header */}
			<Animated.View
				className='bg-black dark:bg-white rounded-b-3xl justify-end px-6 pb-6'
				style={[styles.headerShadow, { paddingTop: insets.top + 20, height: 160 }]}
				entering={SlideInUp.duration(600).easing(Easing.out(Easing.cubic))}>
				<View className='flex-row items-center justify-between'>
					<View className='flex-row items-center space-x-4'>
						<TouchableOpacity
							onPress={navigation.goBack}
							className='w-10 h-10 bg-white/10 dark:bg-black/10 rounded-full items-center justify-center'
							activeOpacity={0.8}>
							<Ionicons name='chevron-back' size={24} color={"white"} />
						</TouchableOpacity>
						<View>
							<Text className='text-white dark:text-black font-bold text-2xl'>{getScreenTitle()}</Text>
							<Text className='text-white/70 dark:text-black/70 text-sm'>Read our policies and terms</Text>
						</View>
					</View>
					<View className='w-12 h-12 bg-blue-500 rounded-xl items-center justify-center'>
						<Ionicons name={getScreenIcon() as any} size={24} color='white' />
					</View>
				</View>
			</Animated.View>

			{/* Content */}
			<ScrollView className='flex-1' showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
				<Animated.View
					className='bg-white dark:bg-gray-800 rounded-3xl mx-6 mt-6 border border-gray-100 dark:border-gray-700'
					style={[styles.cardShadow]}
					entering={FadeInUp.delay(300).duration(600)}>
					{/* Content Header */}
					<Animated.View
						className='p-6 border-b border-gray-100 dark:border-gray-700'
						entering={SlideInRight.delay(500).duration(600)}>
						<View className='flex-row items-center space-x-4'>
							<View className='w-16 h-16 bg-blue-500 rounded-2xl items-center justify-center'>
								<Ionicons name={getScreenIcon() as any} size={28} color='white' />
							</View>
							<View className='flex-1'>
								<Text className='text-black dark:text-white font-bold text-xl'>{getScreenTitle()}</Text>
								<Text className='text-gray-600 dark:text-gray-400 text-sm mt-1'>
									Last updated: {new Date().toLocaleDateString()}
								</Text>
							</View>
						</View>
					</Animated.View>

					{/* HTML Content */}
					<Animated.View className='p-6' entering={FadeInUp.delay(700).duration(600)}>
						<RenderHTML
							contentWidth={DEVICE_WIDTH - 80}
							source={source}
							baseStyle={{
								fontFamily: "Inter",
								fontSize: 16,
								color: "#374151",
								lineHeight: 24,
							}}
							tagsStyles={{
								h1: {
									fontSize: 24,
									fontWeight: "bold",
									color: "#111827",
									marginBottom: 16,
									marginTop: 24,
								},
								h2: {
									fontSize: 20,
									fontWeight: "bold",
									color: "#111827",
									marginBottom: 12,
									marginTop: 20,
								},
								h3: {
									fontSize: 18,
									fontWeight: "600",
									color: "#111827",
									marginBottom: 8,
									marginTop: 16,
								},
								p: {
									fontSize: 16,
									color: "#374151",
									lineHeight: 24,
									marginBottom: 12,
								},
								ul: {
									marginBottom: 12,
								},
								li: {
									fontSize: 16,
									color: "#374151",
									marginBottom: 8,
									lineHeight: 22,
								},
								strong: {
									fontWeight: "bold",
									color: "#111827",
								},
								em: {
									fontStyle: "italic",
									color: "#6B7280",
								},
								a: {
									color: "#3B82F6",
									textDecorationLine: "underline",
								},
								blockquote: {
									borderLeftWidth: 4,
									borderLeftColor: "#3B82F6",
									paddingLeft: 16,
									marginLeft: 0,
									marginBottom: 16,
									backgroundColor: "#F8FAFC",
									padding: 16,
									borderRadius: 8,
								},
							}}
							systemFonts={["Inter"]}
						/>
					</Animated.View>
				</Animated.View>

				{/* Footer Info */}
				<Animated.View className='mx-6 mt-6' entering={FadeInUp.delay(900).duration(600)}>
					<View className='bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800'>
						<View className='flex-row items-center space-x-3'>
							<View className='w-10 h-10 bg-blue-500 rounded-full items-center justify-center'>
								<Ionicons name='information-circle' size={20} color='white' />
							</View>
							<View className='flex-1'>
								<Text className='text-blue-900 dark:text-blue-100 font-semibold text-sm'>Need Help?</Text>
								<Text className='text-blue-700 dark:text-blue-200 text-xs mt-1'>
									Contact us if you have any questions about our policies
								</Text>
							</View>
						</View>
					</View>
				</Animated.View>

				{/* Back Button */}
				<Animated.View className='mx-6 mt-6' entering={SlideInRight.delay(1100).duration(600)}>
					<TouchableOpacity
						className='bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 flex-row items-center justify-center space-x-3'
						onPress={navigation.goBack}
						activeOpacity={0.8}>
						<Ionicons name='chevron-back' size={20} color='#6B7280' />
						<Text className='text-gray-700 dark:text-gray-300 font-semibold'>Back to Profile</Text>
					</TouchableOpacity>
				</Animated.View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default DescriptionScreen;

const styles = StyleSheet.create({
	headerShadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.15,
		shadowRadius: 20,
		elevation: 10,
	},
	cardShadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 5,
	},
});
