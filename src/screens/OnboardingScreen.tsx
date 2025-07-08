import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParams } from "../utils/types";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { useAppDispatch } from "../redux/store";
import { useTranslation } from "react-i18next";
import Carousel from "react-native-reanimated-carousel";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../utils/constants";
import Animated, { Easing, SlideInDown, SlideInUp, FadeIn } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUser } from "../redux/actions";
import { setOnboardingPassed } from "../redux/reducers";
import DeviceInfo from "react-native-device-info";
import * as RNLocalize from "react-native-localize";

type Props = NativeStackScreenProps<AuthStackParams, "OnboardingScreen">;
const OnboardingScreen = ({ navigation, route }: Props) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const onGetStarted = async () => {
		const deviceId = DeviceInfo.getUniqueIdSync();
		const country = RNLocalize.getCountry();
		dispatch(
			createUser({
				country: country,
				email: "",
				fullName: "",
				isPremium: false,
				deviceId,
			})
		);
		navigation.navigate("PaywallScreen");
	};

	return (
		<SafeAreaView className='flex-1 bg-white dark:bg-gray-900' edges={["right", "left"]}>
			{/* Header Section */}
			<Animated.View
				className='bg-black dark:bg-white rounded-b-3xl absolute top-0 h-1/5 w-full items-center justify-center'
				entering={SlideInUp.duration(800).easing(Easing.out(Easing.cubic))}>
				<Animated.View className='flex-row items-center mt-12' entering={FadeIn.delay(400).duration(600)}>
					<View className='w-2 h-2 bg-blue-500 rounded-full mr-2' />
					<Text
						className='text-white dark:text-black text-4xl font-bold tracking-wider'
						style={{ fontFamily: "Inter", fontSize: 32 }}>
						NotEt
					</Text>
					<View className='w-2 h-2 bg-blue-500 rounded-full ml-2' />
				</Animated.View>
				<Animated.Text
					className='text-white/70 dark:text-black/70 text-sm mt-2 tracking-wide'
					style={{ fontFamily: "Inter", fontSize: 14 }}
					entering={FadeIn.delay(600).duration(600)}>
					{t("appSubtitle")}
				</Animated.Text>
			</Animated.View>

			{/* Carousel Section */}
			<View className='flex-1 mt-20'>
				<Carousel
					loop
					width={DEVICE_WIDTH}
					snapEnabled
					autoPlay
					withAnimation={{
						config: {
							duration: 1200,
							easing: Easing.bezier(0.25, 0.1, 0.25, 1),
						},
						type: "timing",
					}}
					height={DEVICE_HEIGHT * 0.6}
					autoPlayInterval={4000}
					mode='parallax'
					modeConfig={{
						parallaxScrollingScale: 0.95,
						parallaxScrollingOffset: 20,
					}}
					data={[
						{
							title: "onboarding.firstTitle",
							text: "onboarding.firstDescription",
							animation: require("../../assets/animations/todo-list-animation.json"),
							icon: "✍️",
						},
						{
							title: "onboarding.secondTitle",
							text: "onboarding.secondDescription",
							animation: require("../../assets/animations/reminder-animation.json"),
							icon: "🔔",
						},
						{
							title: "onboarding.thirdTitle",
							text: "onboarding.thirdDescription",
							animation: require("../../assets/animations/todo-list-animation.json"),
							icon: "⭐",
						},
					]}
					renderItem={({ item, index }) => (
						<Animated.View
							key={index}
							className='mx-6 mt-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700'
							style={[styles.cardShadow]}
							entering={FadeIn.delay(200 * index).duration(600)}>
							{/* Card Header */}
							<View className='bg-gray-50 dark:bg-gray-700/50 rounded-t-3xl p-6 items-center'>
								<View className='w-16 h-16 bg-blue-500 rounded-2xl items-center justify-center mb-4'>
									<Text style={{ fontSize: 28 }}>{item.icon}</Text>
								</View>
								<LottieView source={item.animation} autoPlay loop style={styles.animation} />
							</View>

							{/* Card Content */}
							<View className='p-6 items-center'>
								<Text
									className='text-black dark:text-white text-center font-bold mb-4 leading-7'
									style={{ fontFamily: "Inter", fontSize: 24 }}>
									{t(item.title)}
								</Text>
								<Text
									className='text-gray-600 dark:text-gray-300 text-center leading-6'
									style={{ fontFamily: "Inter", fontSize: 16 }}>
									{t(item.text)}
								</Text>
							</View>
						</Animated.View>
					)}
				/>
			</View>

			{/* Footer Section */}
			<Animated.View
				className='bg-black dark:bg-white rounded-t-3xl h-1/5 w-full items-center justify-center px-6'
				entering={SlideInDown.duration(800).easing(Easing.out(Easing.cubic))}>
				<Animated.View className='w-full items-center' entering={FadeIn.delay(600).duration(600)}>
					<TouchableOpacity
						style={styles.buttonShadow}
						onPress={onGetStarted}
						className='w-full bg-blue-500 items-center py-4 rounded-2xl mb-4'
						activeOpacity={0.8}>
						<Text className='font-semibold text-white text-lg' style={{ fontFamily: "Inter", fontSize: 18 }}>
							{t("getStarted")}
						</Text>
					</TouchableOpacity>

					<View className='flex-row items-center space-x-2'>
						<View className='w-2 h-2 bg-blue-500 rounded-full' />
						<View className='w-6 h-1 bg-blue-500 rounded-full' />
						<View className='w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full' />
					</View>

					<Text className='text-white/60 dark:text-black/60 text-xs mt-3' style={{ fontFamily: "Inter", fontSize: 12 }}>
						{t("swipeToExplore")}
					</Text>
				</Animated.View>
			</Animated.View>
		</SafeAreaView>
	);
};

export default OnboardingScreen;

const styles = StyleSheet.create({
	cardShadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.1,
		shadowRadius: 24,
		elevation: 8,
	},
	buttonShadow: {
		shadowColor: "#3B82F6",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 6,
	},
	animation: {
		width: DEVICE_WIDTH * 0.4,
		height: DEVICE_WIDTH * 0.4,
	},
});
