import {
	StyleSheet,
	KeyboardAvoidingView,
	Modal,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	TextInput,
	ActivityIndicator,
	Alert,
	Linking,
} from "react-native";
import React, { createRef, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParams } from "../utils/types";
import Animated, {
	Easing,
	FadeIn,
	FadeInLeft,
	FadeInUp,
	SlideInDown,
	SlideInRight,
	SlideInUp,
} from "react-native-reanimated";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useTranslation } from "react-i18next";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { PrivacyPolicy, TermsOfService } from "../utils/PrivacyTerms";
import { DEVICE_HEIGHT, DEVICE_WIDTH, Languages } from "../utils/constants";
import useToast from "../hooks/useToast";
import { updateUserInfo } from "../redux/actions";
import i18next from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import appJson from "../../app.json";
import * as StoreReview from "expo-store-review";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useColorScheme } from "nativewind";

type Props = NativeStackScreenProps<AppStackParams, "ProfileScreen">;

const ProfileScreen = ({ navigation, route }: Props) => {
	const { currentUser, loading, success, message, error } = useAppSelector((state) => state.global);
	const { t } = useTranslation();
	const { showToast } = useToast();
	const insets = useSafeAreaInsets();
	const [email, setEmail] = useState("");
	const [fullName, setFullName] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [languageModalVisible, setLanguageModalVisible] = useState(false);
	const fullNameRef = createRef<TextInput>();
	const toggleModal = () => setModalVisible(!modalVisible);
	const toggleLanguageModal = () => setLanguageModalVisible(!languageModalVisible);
	const dispatch = useAppDispatch();

	const handleSignUpModal = async () => {
		if ((!email || !fullName) && modalVisible) {
			showToast({
				message: "signUpWarning",
				type: "warning",
				icon: "warning-sharp",
			});
			return;
		}
		const emailRegex: RegExp = /^[a-zA-Z0-9_\u00C0-\u017F]+@[a-zA-Z0-9_\u00C0-\u017F]+\.[a-zA-Z0-9_\u00C0-\u017F]+$/;
		if (!emailRegex.test(email)) {
			showToast({
				message: "notValidEmail",
				type: "error",
				icon: "close-sharp",
			});
			return;
		}
		dispatch(updateUserInfo({ email, fullName, id: currentUser?.id! }));
		setEmail("");
		setFullName("");
		setTimeout(() => {
			toggleModal();
		}, 500);
		await StoreReview.requestReview();
	};

	const handleAccountDelete = () => {
		Alert.alert(t("areYouSure"), t("keepYourNotes"), [
			{
				text: t("delete"),
				style: "destructive",
				onPress: () => {
					dispatch(
						updateUserInfo({
							email: "",
							fullName: "",
							id: currentUser?.id!,
						})
					);
				},
			},
			{
				text: t("cancel"),
				style: "cancel",
			},
		]);
	};
	const { colorScheme, toggleColorScheme } = useColorScheme();
	const handleThemeChange = async () => {
		await AsyncStorage.setItem("theme", colorScheme === "dark" ? "light" : "dark");
		toggleColorScheme();
	};
	const profileMenuItems = [
		{
			id: 1,
			icon: "lock-closed",
			title: t("privacyPolicy"),
			onPress: () => navigation.navigate("DescriptionScreen", { description: PrivacyPolicy }),
			color: "#3B82F6",
		},
		{
			id: 2,
			icon: "eye",
			title: t("termsOfService"),
			onPress: () => navigation.navigate("DescriptionScreen", { description: TermsOfService }),
			color: "#10B981",
		},
		{
			id: 2,
			icon: colorScheme === "dark" ? "sunny" : "moon",
			title: t("theme"),
			onPress: () => handleThemeChange(),
			color: "#10B981",
		},
		{
			id: 3,
			icon: currentUser?.email ? "person-remove" : "person-add",
			title: currentUser?.email ? t("deleteAccount") : t("signupFree"),
			onPress: currentUser?.email ? handleAccountDelete : toggleModal,
			color: currentUser?.email ? "#EF4444" : "#8B5CF6",
		},
		{
			id: 4,
			icon: "language",
			title: t("changeLanguage"),
			onPress: toggleLanguageModal,
			color: "#F59E0B",
		},
	];

	return (
		<SafeAreaView className='flex-1 bg-white dark:bg-gray-900' edges={["left", "right"]}>
			{loading && (
				<Animated.View
					entering={FadeIn}
					className='absolute w-full h-full z-30 flex-1 items-center justify-center bg-black/50 dark:bg-white/20'>
					<ActivityIndicator size={50} color={"#3B82F6"} />
				</Animated.View>
			)}

			{/* Header */}
			<Animated.View
				className='bg-black dark:bg-white rounded-b-3xl justify-end px-6 pb-6'
				style={[styles.headerShadow, { paddingTop: insets.top + 20, height: 160 }]}
				entering={SlideInUp.duration(600).easing(Easing.out(Easing.cubic))}>
				<View className='flex-row items-center justify-between'>
					<View className='flex-row items-center space-x-4'>
						<TouchableOpacity
							onPress={navigation.goBack}
							className='w-10 h-10 bg-white/10 dark:bg-black/10 rounded-full items-center justify-center'>
							<Ionicons name='chevron-back' size={24} color={"white"} />
						</TouchableOpacity>
						<View>
							<Text className='text-white dark:text-black font-bold text-2xl'>{t("profile")}</Text>
							<Text className='text-white/70 dark:text-black/70 text-sm'>
								{currentUser?.fullName ? currentUser.fullName : "Guest User"}
							</Text>
						</View>
					</View>
					<View className='w-12 h-12 bg-blue-500 rounded-xl items-center justify-center'>
						<Image
							className='w-8 h-8 rounded-lg'
							source={require("../../assets/favicon.png")}
							contentFit='cover'
							transition={100}
						/>
					</View>
				</View>
			</Animated.View>

			{/* Profile Content */}
			<ScrollView
				className='flex-1 px-6'
				contentContainerStyle={{ paddingTop: 24, paddingBottom: 120 }}
				showsVerticalScrollIndicator={false}>
				{/* User Info Card */}
				<Animated.View
					className='bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 border border-gray-100 dark:border-gray-700'
					style={[styles.cardShadow]}
					entering={FadeInUp.delay(200).duration(600)}>
					<View className='flex-row items-center space-x-4 mb-4'>
						<View className='w-16 h-16 bg-blue-500 rounded-2xl items-center justify-center'>
							<Ionicons name='person' size={28} color='white' />
						</View>
						<View className='flex-1'>
							<Text className='text-black dark:text-white font-bold text-lg'>
								{currentUser?.fullName || "Guest User"}
							</Text>
							<Text className='text-gray-600 dark:text-gray-400 text-sm'>
								{currentUser?.email || "No email provided"}
							</Text>
						</View>
					</View>
				</Animated.View>

				{/* Menu Items */}
				<View className='space-y-4'>
					{profileMenuItems.map((item, index) => (
						<Animated.View key={item.id} entering={SlideInRight.delay(300 + index * 100).duration(600)}>
							<TouchableOpacity
								className='bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex-row items-center space-x-4'
								style={[styles.cardShadow]}
								onPress={item.onPress}
								activeOpacity={0.8}>
								<View
									className='w-12 h-12 rounded-xl items-center justify-center'
									style={{ backgroundColor: `${item.color}20` }}>
									<Ionicons name={item.icon as any} size={20} color={item.color} />
								</View>
								<View className='flex-1'>
									<Text
										className={`font-semibold text-base ${
											item.id === 3 && currentUser?.email ? "#EF4444" : "dark:text-white"
										}`}>
										{item.title}
									</Text>
								</View>
								<Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
							</TouchableOpacity>
						</Animated.View>
					))}
				</View>
			</ScrollView>

			{/* Footer */}
			<Animated.View
				className='absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-6 border-t border-gray-100 dark:border-gray-700'
				entering={FadeInUp.delay(800).duration(600)}>
				<View className='flex-row items-center justify-center space-x-2'>
					<TouchableOpacity
						onPress={async () => {
							const linkedinURL = "http://linkedin.com/company/softwarify";
							const canOpen = await Linking.canOpenURL(linkedinURL);
							if (canOpen) {
								Linking.openURL(linkedinURL);
							}
						}}
						activeOpacity={0.8}>
						<Text className='text-blue-500 font-semibold text-sm'>By Softwarify</Text>
					</TouchableOpacity>
					<Text className='text-gray-600 dark:text-gray-400 font-medium text-sm'>- Version {appJson.expo.version}</Text>
				</View>
			</Animated.View>

			{/* Sign Up Modal */}
			<Modal animationType='fade' transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
				<View style={styles.centeredView}>
					<KeyboardAvoidingView className='flex-1 justify-center' behavior='padding'>
						<Animated.View
							className='bg-white dark:bg-gray-800 rounded-3xl mx-6 p-6 border border-gray-200 dark:border-gray-700'
							style={[styles.modalShadow]}
							entering={SlideInDown.duration(400).easing(Easing.out(Easing.cubic))}>
							<View className='items-center mb-6'>
								<View className='w-16 h-16 bg-blue-500 rounded-2xl items-center justify-center mb-4'>
									<Ionicons name='person-add' size={28} color='white' />
								</View>
								<Text className='text-black dark:text-white font-bold text-xl text-center mb-2'>{t("signupFree")}</Text>
								<Text className='text-gray-600 dark:text-gray-400 text-center text-sm'>
									Create your account to sync your notes
								</Text>
							</View>

							<View className='space-y-4 mb-6'>
								<View className='bg-gray-50 dark:bg-gray-700 rounded-2xl p-4'>
									<TextInput
										className='text-black dark:text-white'
										placeholder={t("email")}
										placeholderTextColor='#9CA3AF'
										onChangeText={setEmail}
										autoFocus
										value={email}
										inputMode='email'
										editable={!loading}
										style={{ fontFamily: "Inter", fontSize: 16 }}
									/>
								</View>
								<View className='bg-gray-50 dark:bg-gray-700 rounded-2xl p-4'>
									<TextInput
										className='text-black dark:text-white'
										placeholder={t("fullName")}
										placeholderTextColor='#9CA3AF'
										onChangeText={setFullName}
										editable={!loading}
										value={fullName}
										ref={fullNameRef}
										style={{ fontFamily: "Inter", fontSize: 16 }}
									/>
								</View>
							</View>

							<View className='space-y-3'>
								<TouchableOpacity
									className='w-full bg-blue-500 rounded-2xl p-4 items-center'
									disabled={loading}
									onPress={handleSignUpModal}
									activeOpacity={0.8}>
									{loading ? (
										<ActivityIndicator size={20} color='white' />
									) : (
										<Text className='text-white font-semibold text-base'>{t("send")}</Text>
									)}
								</TouchableOpacity>
								<TouchableOpacity
									className='w-full bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 items-center'
									disabled={loading}
									onPress={toggleModal}
									activeOpacity={0.8}>
									<Text className='text-black dark:text-white font-semibold text-base'>{t("cancel")}</Text>
								</TouchableOpacity>
							</View>
						</Animated.View>
					</KeyboardAvoidingView>
				</View>
			</Modal>

			{/* Language Modal */}
			<Modal
				animationType='fade'
				transparent={true}
				visible={languageModalVisible}
				onRequestClose={toggleLanguageModal}>
				<View style={styles.centeredView}>
					<Animated.View
						className='bg-white dark:bg-gray-800 rounded-3xl mx-6 p-6 border border-gray-200 dark:border-gray-700'
						style={[styles.modalShadow]}
						entering={SlideInDown.duration(400).easing(Easing.out(Easing.cubic))}>
						<View className='flex-row items-center justify-between mb-6'>
							<View className='flex-row items-center gap-x-3'>
								<View className='w-10 h-10 bg-blue-500 rounded-xl items-center justify-center'>
									<Ionicons name='language' size={20} color='white' />
								</View>
								<Text className='text-black dark:text-white font-bold mx-2 text-xl'>{t("changeAppLangugage")}</Text>
							</View>
							<TouchableOpacity
								onPress={toggleLanguageModal}
								className='w-8 h-8 bg-red-500/10 rounded-full items-center justify-center'>
								<Ionicons name='close' size={20} color='#EF4444' />
							</TouchableOpacity>
						</View>

						<View className='space-y-3'>
							{Languages.map((lang, index) => (
								<Animated.View key={index} entering={FadeInLeft.delay(100 * index).duration(400)}>
									<TouchableOpacity
										className='bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 flex-row items-center justify-between'
										onPress={() => {
											i18next.changeLanguage(lang);
											AsyncStorage.setItem("appLang", lang);
											toggleLanguageModal();
										}}
										activeOpacity={0.8}>
										<Text
											className={`font-semibold text-base ${
												i18next.language === lang ? "text-blue-500" : "text-black dark:text-white"
											}`}>
											{t(lang)}
										</Text>
										{i18next.language === lang && (
											<View className='w-6 h-6 bg-blue-500 rounded-full items-center justify-center'>
												<Ionicons name='checkmark' size={14} color='white' />
											</View>
										)}
									</TouchableOpacity>
								</Animated.View>
							))}
						</View>
					</Animated.View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
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
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
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
});
