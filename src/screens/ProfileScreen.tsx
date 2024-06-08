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
} from "react-native";
import React, { createRef, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParams } from "../utils/types";
import Animated, { Easing, FadeInUp, SlideInUp } from "react-native-reanimated";
import { commonStyles } from "../utils/commonStyles";
import { Image } from "expo-image";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useTranslation } from "react-i18next";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { AboutUs, PrivacyPolicy, TermsOfService } from "../utils/PrivacyTerms";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../utils/constants";
import useToast from "../hooks/useToast";
import { updateUserInfo } from "../redux/actions";
import i18next from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = NativeStackScreenProps<AppStackParams, "ProfileScreen">;

const ProfileScreen = ({ navigation, route }: Props) => {
	const { currentUser, loading, success, message, error } = useAppSelector((state) => state.global);
	const { t } = useTranslation();
	const { showToast } = useToast();
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
			showToast({ message: "signUpWarning", type: "warning", icon: "warning-sharp" });
			return;
		}
		const emailRegex: RegExp = /^[a-zA-Z0-9_\u00C0-\u017F]+@[a-zA-Z0-9_\u00C0-\u017F]+\.[a-zA-Z0-9_\u00C0-\u017F]+$/;
		if (!emailRegex.test(email)) {
			showToast({ message: "notValidEmail", type: "error", icon: "close-sharp" });
			return;
		}
		dispatch(updateUserInfo({ email, fullName, userId: currentUser?.id! }));
		setEmail("");
		setFullName("");
		setTimeout(() => {
			toggleModal();
		}, 500);
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
							userId: currentUser?.id!,
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
	return (
		<View className='flex-1'>
			<Animated.View
				className='bg-black rounded-b-3quarter h-1/6 w-full justify-center px-5'
				style={commonStyles.headerShadow}
				entering={SlideInUp.duration(500).easing(Easing.elastic(0.1))}>
				<TouchableOpacity onPress={navigation.goBack} className='flex-row items-center gap-x-2'>
					<Ionicons name='chevron-back' size={30} color={"white"} />
					<Text className='text-white font-semibold text-4xl'>{t("profile")}</Text>
				</TouchableOpacity>
			</Animated.View>
			{/* <Image
							className='rounded-full w-10 h-10'
							source={require("../../assets/favicon.png")}
							contentFit='cover'
							transition={100}
						/> */}
			<Animated.View className='my-3 rounded-3xl py-3 px-6 flex-1' entering={FadeInUp.delay(200)}>
				<TouchableOpacity
					className='flex-row items-center gap-x-2 border-b my-2'
					onPress={() => {
						navigation.navigate("DescriptionScreen", {
							description: PrivacyPolicy,
						});
					}}>
					<Entypo name='lock' size={20} color={"black"} />
					<Text className='font-semibold text-lg'>{t("privacyPolicy")}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					className='flex-row items-center gap-x-2 border-b my-2'
					onPress={() => {
						navigation.navigate("DescriptionScreen", {
							description: TermsOfService,
						});
					}}>
					<Entypo name='eye' size={20} color={"black"} />
					<Text className='font-semibold text-lg'>{t("termsOfService")}</Text>
				</TouchableOpacity>
				{/* <TouchableOpacity
					className='flex-row items-center gap-x-2 border-b my-2'
					onPress={() => {
						navigation.navigate("DescriptionScreen", {
							description: AboutUs,
						});
					}}>
					<Entypo name='heart' size={20} color={"black"} />
					<Text className='font-semibold text-lg'>{t("aboutUs")}</Text>
				</TouchableOpacity> */}
				{!currentUser?.email ? (
					<TouchableOpacity className='flex-row items-center gap-x-2 border-b my-2' onPress={toggleModal}>
						<Ionicons name='person-add' size={20} color={"black"} />
						<Text className='font-semibold text-lg'>{t("signupFree")}</Text>
					</TouchableOpacity>
				) : (
					<TouchableOpacity className='flex-row items-center gap-x-2 border-b my-2' onPress={handleAccountDelete}>
						<Ionicons name='person-remove' size={20} color={"black"} />
						<Text className='font-semibold text-lg'>{t("deleteAccount")}</Text>
					</TouchableOpacity>
				)}
				<TouchableOpacity className='flex-row items-center gap-x-2 border-b my-2' onPress={toggleLanguageModal}>
					<Ionicons name='language' size={20} color={"black"} />
					<Text className='font-semibold text-lg'>{t("changeLanguage")}</Text>
				</TouchableOpacity>
			</Animated.View>
			<Modal animationType='slide' transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
				<View style={styles.centeredView}>
					<KeyboardAvoidingView className='flex-1' behavior='padding'>
						<ScrollView
							contentContainerStyle={styles.modalView}
							scrollEnabled={false}
							keyboardDismissMode='interactive'>
							<View className='w-full gap-y-3 px-5 bg-white rounded-xl py-5'>
								<Text className='text-2xl text-black font-semibold'>{t("signupFree")}</Text>
								<View className='items-center gap-y-3 justify-between w-full px-2'>
									<TextInput
										className='border w-full rounded-xl px-2 py-1.5'
										autoComplete='email'
										placeholder={t("email")}
										onChangeText={setEmail}
										autoFocus
										value={email}
										inputMode='email'
										editable={!loading}
									/>
									<TextInput
										className='border w-full rounded-xl px-2 py-1.5'
										placeholder={t("fullName")}
										autoComplete='name'
										onChangeText={setFullName}
										editable={!loading}
										value={fullName}
										ref={fullNameRef}
									/>
									<TouchableOpacity
										className='py-1 w-full justify-center bg-green-700 px-1.5 flex-row rounded-full'
										disabled={loading}
										onPress={handleSignUpModal}>
										{loading ? (
											<ActivityIndicator size={25} color={"white"} />
										) : (
											<Text className='font-medium text-xl text-white'>{t("send")}</Text>
										)}
									</TouchableOpacity>
									<TouchableOpacity
										disabled={loading}
										className='py-1 w-full justify-center bg-black px-1.5 flex-row rounded-full'
										onPress={toggleModal}>
										<Text className='font-medium text-xl text-white'>{t("cancel")}</Text>
									</TouchableOpacity>
								</View>
							</View>
						</ScrollView>
					</KeyboardAvoidingView>
				</View>
			</Modal>
			<Modal
				animationType='slide'
				transparent={true}
				visible={languageModalVisible}
				onRequestClose={toggleLanguageModal}>
				<View style={styles.centeredView}>
					<View className='w-11/12 gap-y-5 px-5 bg-white rounded-xl' style={commonStyles.smallBottomShadow}>
						<TouchableOpacity className='flex-row items-center justify-between' onPress={toggleLanguageModal}>
							<Text className='font-semibold self-center text-xl'>{t("changeAppLangugage")}</Text>
							<Ionicons name='close-circle' size={30} color={"red"} />
						</TouchableOpacity>
						<View className='mt-10 mb-5'>
							<TouchableOpacity
								className={`py-1 w-full items-center justify-between bg-white px-1.5 flex-row`}
								onPress={() => {
									i18next.changeLanguage("tr");
									AsyncStorage.setItem("appLang", "tr");
									toggleLanguageModal();
								}}>
								<Text
									className={`font-semibold  text-xl ${i18next.language === "tr" ? "text-green-700 " : "text-black"}`}>
									{t("tr")}
								</Text>
								{i18next.language === "tr" && <Ionicons name='checkmark-sharp' size={30} color={"green"} />}
							</TouchableOpacity>
							<TouchableOpacity
								className={`py-1 w-full items-center mt-1 justify-between bg-white px-1.5 flex-row`}
								onPress={() => {
									i18next.changeLanguage("en");
									AsyncStorage.setItem("appLang", "en");
									toggleLanguageModal();
								}}>
								<Text
									className={`font-semibold  text-xl ${i18next.language === "en" ? "text-green-700 " : "text-black"}`}>
									{t("en")}
								</Text>
								{i18next.language === "en" && <Ionicons name='checkmark-sharp' size={30} color={"green"} />}
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
			<View className='h-16'>
				<Text className='text-black font-semibold text-sm self-center'>App By Softwarify - Version 3.0.1</Text>
			</View>
		</View>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	modalView: {
		borderRadius: 20,
		alignItems: "center",
		shadowColor: "#000",
		flex: 1,
		width: DEVICE_WIDTH * 0.9,
		justifyContent: "center",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		height: DEVICE_HEIGHT * 0.5,
	},
});
