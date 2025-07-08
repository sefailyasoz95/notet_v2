import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch } from "../redux/store";
import { useTranslation } from "react-i18next";
import Animated, {
	Easing,
	SlideInDown,
	SlideInUp,
	FadeIn,
	SlideInLeft,
	SlideInRight,
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { AuthStackParams } from "../utils/types";
import { setOnboardingPassed } from "../redux/reducers";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = NativeStackScreenProps<AuthStackParams, "PaywallScreen">;

type SubscriptionPlan = {
	id: "weekly" | "monthly";
	title: string;
	price: string;
	period: string;
	savings?: string;
	popular?: boolean;
};

const PaywallScreen = ({ navigation, route }: Props) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [selectedPlan, setSelectedPlan] = useState<"weekly" | "monthly">("monthly");

	const buttonScale = useSharedValue(1);
	const buttonOpacity = useSharedValue(1);

	const plans: SubscriptionPlan[] = [
		{
			id: "weekly",
			title: t("paywall.weeklyTitle"),
			price: "$2.99",
			period: t("paywall.weeklyPeriod"),
		},
		{
			id: "monthly",
			title: t("paywall.monthlyTitle"),
			price: "$6.99",
			period: t("paywall.monthlyPeriod"),
			savings: t("paywall.monthlySavings"),
			popular: true,
		},
	];

	const features = [
		{
			icon: "🎙️",
			title: t("paywall.features.audioNotes"),
			description: t("paywall.features.audioNotesDesc"),
		},
		{
			icon: "📸",
			title: t("paywall.features.photoAttachments"),
			description: t("paywall.features.photoAttachmentsDesc"),
		},
		{
			icon: "🔗",
			title: t("paywall.features.secureSharing"),
			description: t("paywall.features.secureSharingDesc"),
		},
		{
			icon: "☁️",
			title: t("paywall.features.cloudSync"),
			description: t("paywall.features.cloudSyncDesc"),
		},
	];

	const handlePlanSelect = (planId: "weekly" | "monthly") => {
		setSelectedPlan(planId);
	};

	const handleSubscribe = () => {
		buttonScale.value = withSpring(0.95, {}, () => {
			buttonScale.value = withSpring(1);
		});
		buttonOpacity.value = withTiming(0.8, { duration: 150 }, () => {
			buttonOpacity.value = withTiming(1);
		});

		// Handle subscription logic here
		console.log("Subscribe to:", selectedPlan);
	};
	const handleFree = async () => {
		// Handle free usage logic
		console.log("Continue with free version");
		await AsyncStorage.setItem("onBoardingPassed", "true");
		dispatch(setOnboardingPassed(true));
	};
	const handleRestore = () => {
		// Handle restore purchases
		console.log("Restore purchases");
	};

	const handleClose = async () => {
		await AsyncStorage.setItem("onBoardingPassed", "true");
		dispatch(setOnboardingPassed(true));
	};

	const animatedButtonStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: buttonScale.value }],
			opacity: buttonOpacity.value,
			marginBottom: 10,
		};
	});
	const { top } = useSafeAreaInsets();
	return (
		<SafeAreaView className='flex-1 bg-white dark:bg-gray-900' edges={["right", "left"]}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* Header */}
				<Animated.View
					className='bg-black dark:bg-white rounded-b-3xl px-6 py-8'
					style={{ paddingTop: top + 10 }}
					entering={SlideInUp.duration(600).easing(Easing.out(Easing.cubic))}>
					<View className='flex-row justify-between items-center mb-4'>
						<TouchableOpacity
							onPress={handleClose}
							className='w-10 h-10 rounded-full bg-white/10 dark:bg-black/10 items-center justify-center'>
							<Text className='text-white dark:text-black text-xl'>×</Text>
						</TouchableOpacity>
						<View className='flex-row items-center'>
							<View className='w-2 h-2 bg-blue-500 rounded-full mr-2' />
							<Text
								className='text-white dark:text-black text-2xl font-bold'
								style={{ fontFamily: "Inter", fontSize: 24 }}>
								{t("paywall.title")}
							</Text>
							<View className='w-2 h-2 bg-blue-500 rounded-full ml-2' />
						</View>
						<View className='w-10' />
					</View>
					<Animated.Text
						className='text-white/70 dark:text-black/70 text-center text-base'
						style={{ fontFamily: "Inter", fontSize: 16 }}
						entering={FadeIn.delay(200).duration(600)}>
						{t("paywall.subtitle")}
					</Animated.Text>
				</Animated.View>

				{/* Features Section */}
				<View className='px-6 py-8'>
					<Animated.Text
						className='text-black dark:text-white text-xl font-bold mb-6 text-center'
						style={{ fontFamily: "Inter", fontSize: 20 }}
						entering={FadeIn.delay(400).duration(600)}>
						{t("paywall.featuresTitle")}
					</Animated.Text>

					{features.map((feature, index) => (
						<Animated.View
							style={styles.cardShadow}
							key={feature.title}
							className='flex-row items-center mb-4 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4'
							entering={SlideInLeft.delay(200 * index + 600).duration(600)}>
							<View className='w-12 h-12 bg-blue-500 rounded-xl items-center justify-center mr-4'>
								<Text style={{ fontSize: 20 }}>{feature.icon}</Text>
							</View>
							<View className='flex-1'>
								<Text
									className='text-black dark:text-white font-semibold mb-1'
									style={{ fontFamily: "Inter", fontSize: 16 }}>
									{feature.title}
								</Text>
								<Text className='text-gray-600 dark:text-gray-300' style={{ fontFamily: "Inter", fontSize: 14 }}>
									{feature.description}
								</Text>
							</View>
						</Animated.View>
					))}
				</View>

				{/* Subscription Plans */}
				<View className='px-6 pb-8'>
					<Animated.Text
						className='text-black dark:text-white text-xl font-bold mb-6 text-center'
						style={{ fontFamily: "Inter", fontSize: 20 }}
						entering={FadeIn.delay(1200).duration(600)}>
						{t("paywall.plansTitle")}
					</Animated.Text>

					<View className='space-y-4'>
						{plans.map((plan, index) => (
							<Animated.View key={plan.id} entering={SlideInRight.delay(200 * index + 1400).duration(600)}>
								<TouchableOpacity
									onPress={() => handlePlanSelect(plan.id)}
									className={`rounded-2xl p-6 border-2 ${
										selectedPlan === plan.id
											? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
											: "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
									}`}
									style={[styles.planShadow]}
									activeOpacity={0.8}>
									<View className='flex-row justify-between items-center mb-2'>
										<Text
											className={`font-bold text-lg ${
												selectedPlan === plan.id ? "text-blue-600 dark:text-blue-400" : "text-black dark:text-white"
											}`}
											style={{ fontFamily: "Inter", fontSize: 18 }}>
											{plan.title}
										</Text>
										{plan.popular && (
											<View className='bg-blue-500 px-3 py-0.5 -mt-8 mr-5 rounded-full'>
												<Text
													className='text-white text-xs font-semibold'
													style={{ fontFamily: "Inter", fontSize: 11 }}>
													{t("paywall.popular")}
												</Text>
											</View>
										)}
									</View>

									<View className='flex-row items-baseline mb-2'>
										<Text
											className={`font-bold text-3xl ${
												selectedPlan === plan.id ? "text-blue-600 dark:text-blue-400" : "text-black dark:text-white"
											}`}
											style={{ fontFamily: "Inter", fontSize: 28 }}>
											{plan.price}
										</Text>
										<Text
											className={`ml-2 ${
												selectedPlan === plan.id
													? "text-blue-500 dark:text-blue-300"
													: "text-gray-600 dark:text-gray-400"
											}`}
											style={{ fontFamily: "Inter", fontSize: 14 }}>
											{plan.period}
										</Text>
									</View>

									{plan.savings && (
										<Text
											className='text-green-600 dark:text-green-400 font-medium'
											style={{ fontFamily: "Inter", fontSize: 14 }}>
											{plan.savings}
										</Text>
									)}

									<View
										className={`absolute right-2 top-2 w-6 h-6 rounded-full border-2 ${
											selectedPlan === plan.id ? "border-blue-500 bg-blue-500" : "border-gray-300 dark:border-gray-600"
										}`}>
										{selectedPlan === plan.id && <View className='w-2 h-2 bg-white rounded-full self-center mt-1.5' />}
									</View>
								</TouchableOpacity>
							</Animated.View>
						))}
					</View>
				</View>
			</ScrollView>

			{/* Footer */}
			<Animated.View
				className='bg-black dark:bg-white rounded-t-3xl px-6 py-6'
				entering={SlideInDown.duration(600).easing(Easing.out(Easing.cubic))}>
				<Animated.View style={animatedButtonStyle}>
					<TouchableOpacity
						onPress={handleSubscribe}
						className='w-full bg-blue-500 rounded-2xl py-4 mb-2'
						style={styles.subscribeShadow}
						activeOpacity={0.9}>
						<Text className='text-white text-center font-bold text-lg' style={{ fontFamily: "Inter", fontSize: 18 }}>
							{t("paywall.subscribe")} {selectedPlan === "weekly" ? "$2.99" : "$6.99"}
						</Text>
					</TouchableOpacity>
					<Text onPress={handleFree} className='text-white text-center font-bold underline'>
						{t("paywall.free")}
					</Text>
				</Animated.View>

				<View className='flex-row justify-between items-center'>
					<TouchableOpacity onPress={handleRestore}>
						<Text className='text-white/70 dark:text-black/70 underline' style={{ fontFamily: "Inter", fontSize: 14 }}>
							{t("paywall.restore")}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity>
						<Text className='text-white/70 dark:text-black/70 underline' style={{ fontFamily: "Inter", fontSize: 14 }}>
							{t("paywall.terms")}
						</Text>
					</TouchableOpacity>
				</View>
			</Animated.View>
		</SafeAreaView>
	);
};

export default PaywallScreen;

const styles = StyleSheet.create({
	planShadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 4,
	},
	subscribeShadow: {
		shadowColor: "#3B82F6",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 8,
	},
	cardShadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 2,
			height: 3,
		},
		shadowOpacity: 0.25,
		shadowRadius: 5,
		elevation: 8,
	},
});
