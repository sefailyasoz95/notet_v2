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
import Animated, { Easing, FadeInUp, SlideInDown, SlideInUp } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUser, getCurrentUser } from "../redux/actions";
import * as Localize from "expo-localization";
import { setonboardingPassed } from "../redux/reducers";
type Props = NativeStackScreenProps<AuthStackParams, "OnboardingScreen">;

const OnboardingScreen = ({ navigation, route }: Props) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const onGetStarted = async () => {
		await AsyncStorage.setItem("onBoardingPassed", "true");
		const deviceId = new Date().getTime().toString();
		await AsyncStorage.setItem("deviceId", deviceId);
		dispatch(
			createUser({
				country: Localize.getLocales()[0].regionCode ?? "",
				email: "",
				fullName: "",
				isPremium: false,
				deviceId: deviceId,
			})
		);
		dispatch(setonboardingPassed(true));
	};

	return (
		<SafeAreaView className='flex-1 bg-white' edges={["right", "left"]}>
			<Animated.View
				className='bg-black rounded-b-3quarter absolute top-0 h-1/6 w-full items-center justify-center'
				entering={SlideInUp.duration(500).easing(Easing.elastic(0.1))}>
				<Text className='text-white text-5xl mt-10 ' style={{ letterSpacing: 5 }}>
					NotEt
				</Text>
			</Animated.View>
			<Carousel
				loop
				width={DEVICE_WIDTH}
				snapEnabled
				autoPlay
				withAnimation={{
					config: {
						duration: 1000,
						easing: Easing.elastic(1.2),
					},
					type: "timing",
				}}
				height={DEVICE_HEIGHT}
				autoPlayInterval={3000}
				mode='parallax'
				modeConfig={{
					parallaxScrollingScale: 0.9,
					parallaxScrollingOffset: 15,
				}}
				data={[
					{
						title: "onboarding.firstTitle",
						text: "onboarding.firstDescription",
						animation: require("../../assets/animations/todo-list-animation.json"),
					},
					{
						title: "onboarding.secondTitle",
						text: "onboarding.secondDescription",
						animation: require("../../assets/animations/reminder-animation.json"),
					},
				]}
				renderItem={({ item, index }) => (
					<View key={index} className='gap-y-5 mt-20 self-center items-center'>
						<LottieView source={item.animation} autoPlay loop style={styles.animation} />
						<Text className='text-5xl w-4/5 text-black font-semibold'>{t(item.title)}</Text>
						<Text className='text-xl font-medium text-gray-600'>{t(item.text)}</Text>
					</View>
				)}
			/>
			<Animated.View
				className='bg-black rounded-t-3quarter h-1/6 w-full items-center justify-center'
				entering={SlideInDown.duration(500).easing(Easing.elastic(0.1))}>
				<TouchableOpacity
					style={styles.shadow}
					onPress={onGetStarted}
					className='self-center w-10/12 bg-white drop-shadow-lg items-center py-3 mb-10 rounded-full'>
					<Text className='font-medium'>{t("getStarted")}</Text>
				</TouchableOpacity>
			</Animated.View>
		</SafeAreaView>
	);
};

export default OnboardingScreen;
const styles = StyleSheet.create({
	shadow: {
		shadowColor: "black",
		shadowOffset: {
			height: 10,
			width: 0,
		},
		shadowOpacity: 0.5,
		shadowRadius: 10,
	},
	animation: {
		width: DEVICE_WIDTH * 0.75,
		aspectRatio: 1,
	},
});
