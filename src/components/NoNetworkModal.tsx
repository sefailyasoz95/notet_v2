import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	SlideInDown,
	SlideOutDown,
	FadeIn,
	FadeOut,
	Easing,
	useSharedValue,
	useAnimatedStyle,
	withRepeat,
	withTiming,
	interpolate,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import NetInfo from "@react-native-community/netinfo";

interface NoNetworkModalProps {
	visible?: boolean;
	onRetry?: () => void;
}

const NoNetworkModal: React.FC<NoNetworkModalProps> = ({ visible: externalVisible, onRetry }) => {
	const { t } = useTranslation();
	const [isConnected, setIsConnected] = useState<boolean | null>(true);
	const [isInitialCheck, setIsInitialCheck] = useState(true);

	// Animation values
	const pulseAnimation = useSharedValue(0);
	const waveAnimation = useSharedValue(0);

	// Initial network check
	useEffect(() => {
		const checkInitialConnection = async () => {
			try {
				const state = await NetInfo.fetch();
				const connected = state.isConnected && state.isInternetReachable;
				setIsConnected(connected);

				// Small delay to ensure smooth initial render
				setTimeout(() => {
					setIsInitialCheck(false);
				}, 100);
			} catch (error) {
				console.log("Network check failed:", error);
				setIsInitialCheck(false);
			}
		};

		checkInitialConnection();
	}, [externalVisible]);

	// Listen for network changes after initial check
	useEffect(() => {
		if (isInitialCheck) return;

		const unsubscribe = NetInfo.addEventListener((state) => {
			const connected = state.isConnected && state.isInternetReachable;
			setIsConnected(connected);
		});

		return () => unsubscribe();
	}, [isInitialCheck]);

	// Use external visibility prop if provided, otherwise use internal state
	// Don't show modal during initial check to prevent flash
	const modalVisible = isInitialCheck ? false : externalVisible !== undefined ? externalVisible : !isConnected;

	// Start animations when modal is visible
	useEffect(() => {
		if (modalVisible) {
			// Pulse animation for the wifi icon
			pulseAnimation.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);

			// Wave animation for the background effect
			waveAnimation.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.linear }), -1, false);
		}
	}, [modalVisible, pulseAnimation, waveAnimation]);

	const handleRetry = async () => {
		if (onRetry) {
			onRetry();
		} else {
			// Check connection again
			const state = await NetInfo.fetch();
			const connected = state.isConnected && state.isInternetReachable;
			setIsConnected(connected);
		}
	};

	// Animation styles
	const pulseStyle = useAnimatedStyle(() => {
		const scale = interpolate(pulseAnimation.value, [0, 1], [1, 1.2]);
		const opacity = interpolate(pulseAnimation.value, [0, 1], [0.8, 1]);

		return {
			transform: [{ scale }],
			opacity,
		};
	});

	const waveStyle = useAnimatedStyle(() => {
		const scale = interpolate(waveAnimation.value, [0, 1], [1, 1.5]);
		const opacity = interpolate(waveAnimation.value, [0, 0.5, 1], [0.3, 0.1, 0]);

		return {
			transform: [{ scale }],
			opacity,
		};
	});

	if (!modalVisible) return null;

	return (
		<Modal
			animationType='fade'
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				/* Prevent closing by back button */
			}}>
			<Animated.View style={styles.overlay} entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)}>
				<Animated.View
					className='bg-white dark:bg-gray-800 rounded-3xl mx-6 p-6 border border-gray-200 dark:border-gray-700'
					style={[styles.modalShadow]}
					entering={SlideInDown.duration(400).easing(Easing.out(Easing.cubic))}
					exiting={SlideOutDown.duration(300).easing(Easing.in(Easing.cubic))}>
					{/* Animated Background Wave */}
					<Animated.View
						style={[styles.backgroundWave, waveStyle]}
						className='absolute top-0 left-0 right-0 bottom-0 bg-red-500/10 rounded-3xl'
					/>

					{/* Content */}
					<View className='items-center mb-6 relative z-10'>
						{/* Animated Icon Container */}
						<View className='relative mb-4'>
							<Animated.View
								style={[pulseStyle]}
								className='w-20 h-20 bg-red-500 rounded-2xl items-center justify-center'>
								<Ionicons name='wifi-outline' size={32} color='white' />
								<View className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
									<View className='w-8 h-1 bg-white rounded-full rotate-45 absolute' />
								</View>
							</Animated.View>
						</View>

						{/* Title */}
						<Text className='text-black dark:text-white font-bold text-xl text-center mb-2'>
							{t("network.noConnection.title") || "No Internet Connection"}
						</Text>

						{/* Description */}
						<Text className='text-gray-600 dark:text-gray-400 text-center text-base leading-6'>
							{t("network.noConnection.description") ||
								"Please check your internet connection and try again. Make sure you're connected to a stable network."}
						</Text>
					</View>

					{/* Connection Status */}
					<View className='flex-row items-center justify-center mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl'>
						<View className='w-3 h-3 bg-red-500 rounded-full mr-3' />
						<Text className='text-gray-700 dark:text-gray-300 text-sm font-medium'>
							{t("network.status.offline") || "Offline"}
						</Text>
					</View>

					{/* Action Buttons */}
					<View className='space-y-3'>
						{/* Retry Button */}
						<TouchableOpacity
							className='w-full bg-blue-500 rounded-2xl py-4 items-center'
							onPress={handleRetry}
							activeOpacity={0.8}>
							<View className='flex-row items-center'>
								<Ionicons name='refresh-sharp' size={20} color='white' className='mr-2' />
								<Text className='text-white font-semibold text-base ml-2'>
									{t("network.actions.retry") || "Try Again"}
								</Text>
							</View>
						</TouchableOpacity>

						{/* Settings Button */}
						<TouchableOpacity
							className='w-full bg-gray-100 dark:bg-gray-700 rounded-2xl py-4 items-center'
							onPress={() => {
								// Open device settings - this would need to be implemented with proper linking
								// Linking.openSettings();
							}}
							activeOpacity={0.8}>
							<View className='flex-row items-center'>
								<Ionicons name='settings-sharp' size={20} color='#6B7280' className='mr-2' />
								<Text className='text-gray-700 dark:text-gray-300 font-semibold text-base ml-2'>
									{t("network.actions.settings") || "Open Settings"}
								</Text>
							</View>
						</TouchableOpacity>
					</View>

					{/* Help Text */}
					<Text className='text-gray-500 dark:text-gray-400 text-xs text-center mt-4'>
						{t("network.help.text") || "This modal will automatically close when connection is restored"}
					</Text>
				</Animated.View>
			</Animated.View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.6)",
	},
	modalShadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 20,
		},
		shadowOpacity: 0.2,
		shadowRadius: 30,
		elevation: 20,
	},
	backgroundWave: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		borderRadius: 24,
	},
});

export default NoNetworkModal;
