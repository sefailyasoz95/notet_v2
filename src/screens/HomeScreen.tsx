import {
	ActivityIndicator,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	FlatList,
	ScrollView,
	Dimensions,
} from "react-native";
import React, { createRef, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParams } from "../utils/types";
import Animated, {
	Easing,
	FadeIn,
	SlideInRight,
	SlideInDown,
	useAnimatedScrollHandler,
	useSharedValue,
	useAnimatedStyle,
	interpolate,
	runOnJS,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { createCategory, getCurrentUser, updateUserInfo } from "../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import NoteItem from "../components/NoteItem";
import useToast from "../hooks/useToast";
import { SafeAreaView } from "react-native-safe-area-context";
import * as StoreReview from "expo-store-review";
import DeviceInfo from "react-native-device-info";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<AppStackParams, "HomeScreen">;

const HEADER_MAX_HEIGHT = 220; // Increased to accommodate tabs
const HEADER_MIN_HEIGHT = 140; // Increased to accommodate tabs
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HomeScreen = ({ navigation, route }: Props) => {
	const { t } = useTranslation();
	const { currentUser, onboardingPassed, savedNotes, loading, categories, success, error, message } = useAppSelector(
		(state) => state.global
	);
	const insets = useSafeAreaInsets();
	const scrollRef = createRef<FlatList>();
	const horizontalScrollRef = createRef<ScrollView>();
	const [tabs, setTabs] = useState<"notes" | "categories">("notes");
	const dispatch = useAppDispatch();
	const { showToast } = useToast();
	const [ratingModal, setRatingModal] = useState<boolean>(false);
	const [givenRate, setGivenRate] = useState<number>(4);
	const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id);
	const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

	// Animated values
	const scrollY = useSharedValue(0);

	const toggleModal = () => setRatingModal(!ratingModal);

	const fetchUser = async () => {
		const deviceId = (await AsyncStorage.getItem("deviceId")) ?? DeviceInfo.getUniqueIdSync();
		dispatch(getCurrentUser(deviceId));
	};

	useEffect(() => {
		fetchUser();
	}, [onboardingPassed]);

	useEffect(() => {
		if (success && !loading) {
			showToast({ message, icon: "checkmark-sharp", type: "success" });
		}
		if (error && !loading) {
			showToast({ message, icon: "close-sharp", type: "error" });
		}
	}, [success, loading, error]);

	useEffect(() => {
		(async () => {
			if (savedNotes.length > 0 && savedNotes.length % 2 === 0 && !currentUser?.rating) {
				toggleModal();
			}
		})();
	}, [savedNotes]);

	useEffect(() => {
		if (currentUser && !categories.length) {
			dispatch(
				createCategory({
					name: "general",
					userId: currentUser.id!,
				})
			);
		}
	}, [currentUser]);

	const toggleTab = (tab: "notes" | "categories") => {
		setTabs(tab);
		const targetOffset = tab === "notes" ? 0 : SCREEN_WIDTH;
		horizontalScrollRef.current?.scrollTo({ x: targetOffset, animated: true });
	};

	const handleRating = async (rate: number) => {
		setGivenRate(rate);
		dispatch(updateUserInfo({ rating: rate, id: currentUser?.id }));
		toggleModal();
		await StoreReview.requestReview();
	};

	const updateHeaderState = (collapsed: boolean) => {
		if (collapsed !== isHeaderCollapsed) {
			setIsHeaderCollapsed(collapsed);
		}
	};

	const scrollHandler = useAnimatedScrollHandler((event) => {
		scrollY.value = event.contentOffset.y;
		const collapsed = event.contentOffset.y > HEADER_SCROLL_DISTANCE / 2;
		runOnJS(updateHeaderState)(collapsed);
	});

	// Header animation styles
	const headerAnimatedStyle = useAnimatedStyle(() => {
		const height = interpolate(
			scrollY.value,
			[0, HEADER_SCROLL_DISTANCE],
			[HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
			"clamp"
		);

		return {
			height,
		};
	});

	// Header content animation
	const headerContentAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scrollY.value, [0, HEADER_SCROLL_DISTANCE / 2], [1, 0], "clamp");

		const translateY = interpolate(scrollY.value, [0, HEADER_SCROLL_DISTANCE], [0, -20], "clamp");

		return {
			opacity,
			transform: [{ translateY }],
		};
	});

	// Mini header animation (shows when collapsed)
	const miniHeaderAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scrollY.value, [HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE], [0, 1], "clamp");

		return {
			opacity,
		};
	});

	// Tab bar animation
	const tabBarAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scrollY.value, [0, HEADER_SCROLL_DISTANCE / 2], [1, 0], "clamp");

		return {
			opacity,
		};
	});

	// Mini tab bar animation
	const miniTabBarAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scrollY.value, [HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE], [0, 1], "clamp");

		return {
			opacity,
		};
	});

	// Welcome text animation
	const welcomeTextAnimatedStyle = useAnimatedStyle(() => {
		const scale = interpolate(scrollY.value, [0, HEADER_SCROLL_DISTANCE], [1, 0.8], "clamp");

		return {
			transform: [{ scale }],
		};
	});

	const renderTabBar = (isCompact = false) => (
		<View className={`flex-row mx-6 ${isCompact ? "mb-2" : "mb-4"}`}>
			<View className='flex-row bg-white/10 dark:bg-black/10 rounded-xl p-1 flex-1'>
				<TouchableOpacity
					onPress={() => toggleTab("notes")}
					className={`flex-1 py-2 px-4 rounded-lg ${tabs === "notes" ? "bg-white/20 dark:bg-black/20" : ""}`}
					activeOpacity={0.8}>
					<Text
						className={`text-center font-semibold ${isCompact ? "text-sm" : "text-base"} ${
							tabs === "notes" ? "text-white dark:text-black" : "text-white/70 dark:text-black/70"
						}`}>
						{t("home.notes")} ({savedNotes.length})
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => toggleTab("categories")}
					className={`flex-1 py-2 px-4 rounded-lg ${tabs === "categories" ? "bg-white/20 dark:bg-black/20" : ""}`}
					activeOpacity={0.8}>
					<Text
						className={`text-center font-semibold ${isCompact ? "text-sm" : "text-base"} ${
							tabs === "categories" ? "text-white dark:text-black" : "text-white/70 dark:text-black/70"
						}`}>
						{t("home.categories")} ({categories.length})
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderNotesTab = () => (
		<View style={{ width: SCREEN_WIDTH }}>
			<Animated.FlatList
				ref={scrollRef}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				contentContainerStyle={{
					paddingTop: HEADER_MAX_HEIGHT,
					paddingBottom: 120,
				}}
				data={savedNotes}
				renderItem={({ item, index }) => (
					<Animated.View entering={SlideInRight.delay(index * 100).duration(600)} style={{ paddingHorizontal: 20 }}>
						<NoteItem note={item} index={index} />
					</Animated.View>
				)}
				ListEmptyComponent={() =>
					loading ? (
						<></>
					) : (
						<Animated.View className='items-center justify-center' entering={FadeIn.delay(600).duration(600)}>
							<View className='w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl items-center justify-center mb-6'>
								<Ionicons name='document-outline' size={40} color='#9CA3AF' />
							</View>
							<Text className='text-black dark:text-white font-semibold text-lg mb-2'>{t("home.noNotesTitle")}</Text>
							<Text className='text-gray-600 dark:text-gray-400 text-center px-8'>{t("home.noNotesDescription")}</Text>
						</Animated.View>
					)
				}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item, index) => item.id?.toString() || index.toString()}
			/>
		</View>
	);

	const renderCategoriesTab = () => (
		<View style={{ width: SCREEN_WIDTH }} className='my-4'>
			<Animated.FlatList
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				contentContainerStyle={{
					paddingTop: HEADER_MAX_HEIGHT,
					paddingBottom: 120,
				}}
				data={categories}
				renderItem={({ item, index }) => (
					<Animated.View
						entering={SlideInRight.delay(index * 100).duration(600)}
						style={{ paddingHorizontal: 20, marginBottom: 12 }}>
						<TouchableOpacity
							onPress={() => setSelectedCategoryId(item.id)}
							className={`p-4 rounded-2xl border-2 ${
								selectedCategoryId === item.id
									? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
									: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
							}`}
							activeOpacity={0.8}>
							<View className='flex-row items-center justify-between'>
								<View className='flex-row items-center flex-1'>
									<View
										className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
											selectedCategoryId === item.id ? "bg-blue-500" : "bg-gray-100 dark:bg-gray-700"
										}`}>
										<Ionicons name='folder' size={20} color={selectedCategoryId === item.id ? "white" : "#9CA3AF"} />
									</View>
									<View className='flex-1'>
										<Text
											className={`font-semibold text-base ${
												selectedCategoryId === item.id
													? "text-blue-700 dark:text-blue-300"
													: "text-black dark:text-white"
											}`}>
											{item.name}
										</Text>
										<Text className='text-gray-500 dark:text-gray-400 text-sm'>
											{savedNotes.filter((note) => note.categoryId === item.id).length} notes
										</Text>
									</View>
								</View>
								{selectedCategoryId === item.id && (
									<View className='w-6 h-6 bg-blue-500 rounded-full items-center justify-center'>
										<Ionicons name='checkmark' size={16} color='white' />
									</View>
								)}
							</View>
						</TouchableOpacity>
					</Animated.View>
				)}
				ListEmptyComponent={() =>
					loading ? (
						<></>
					) : (
						<Animated.View className='items-center justify-center' entering={FadeIn.delay(600).duration(600)}>
							<View className='w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl items-center justify-center mb-6'>
								<Ionicons name='folder-outline' size={40} color='#9CA3AF' />
							</View>
							<Text className='text-black dark:text-white font-semibold text-lg mb-2'>
								{t("home.noCategoriesTitle")}
							</Text>
							<Text className='text-gray-600 dark:text-gray-400 text-center px-8'>
								{t("home.noCategoriesDescription")}
							</Text>
						</Animated.View>
					)
				}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item, index) => item.id?.toString() || index.toString()}
			/>
		</View>
	);

	return (
		<SafeAreaView className='flex-1 bg-white dark:bg-gray-900' edges={["left", "right"]}>
			{loading && (
				<Animated.View
					entering={FadeIn}
					className={"absolute w-full h-full z-30 flex-1 items-center justify-center bg-black/50 dark:bg-white/20"}>
					<ActivityIndicator size={50} color={"#3B82F6"} />
				</Animated.View>
			)}
			{typeof currentUser !== undefined && (
				<>
					{/* Animated Header */}
					<Animated.View
						className='bg-black dark:bg-white absolute top-0 z-20 rounded-b-3xl w-full justify-end'
						style={[styles.headerShadow, headerAnimatedStyle, { paddingTop: insets.top }]}>
						{/* Main Header Content */}
						<Animated.View style={[headerContentAnimatedStyle]} className='pb-4'>
							<View className='flex-row items-center justify-between mb-4 px-6'>
								<Animated.View style={[welcomeTextAnimatedStyle]} className='flex-row items-center space-x-3'>
									<View className='w-12 h-12 bg-blue-500 rounded-xl items-center justify-center'>
										<Image
											className='w-8 h-8 rounded-lg'
											source={require("../../assets/favicon.png")}
											contentFit='cover'
											transition={100}
										/>
									</View>
									<View>
										<Text className='text-white dark:text-black font-bold text-xl'>{t("home.welcome")}</Text>
										<Text className='text-white/70 dark:text-black/70 text-sm'>
											{currentUser && currentUser?.fullName
												? currentUser?.fullName.split(" ")[0]
												: `Guest${currentUser?.deviceId.split("-")[0]}`}
										</Text>
									</View>
								</Animated.View>
								<TouchableOpacity
									onPress={() => navigation.navigate("ProfileScreen")}
									className='w-10 h-10 bg-white/10 dark:bg-black/10 rounded-full items-center justify-center'>
									<Ionicons name='person-sharp' size={20} color={"white"} />
								</TouchableOpacity>
							</View>

							{/* Tab Bar */}
							<Animated.View style={[tabBarAnimatedStyle]}>{renderTabBar()}</Animated.View>
						</Animated.View>

						{/* Mini Header */}
						<Animated.View style={[miniHeaderAnimatedStyle]} className='absolute bottom-2 left-0 right-0'>
							<View className='flex-row items-center justify-between px-6 mb-2'>
								<View className='flex-row items-center space-x-3'>
									<View className='w-8 h-8 bg-blue-500 rounded-lg items-center justify-center'>
										<Image
											className='w-6 h-6 rounded-md'
											source={require("../../assets/favicon.png")}
											contentFit='cover'
											transition={100}
										/>
									</View>
									<Text className='text-white dark:text-black font-bold text-lg'>
										{tabs === "notes"
											? `${savedNotes.length} ${t("home.notes")}`
											: `${categories.length} ${t("home.categories")}`}
									</Text>
								</View>
								<TouchableOpacity
									onPress={() => navigation.navigate("ProfileScreen")}
									className='w-8 h-8 bg-white/10 dark:bg-black/10 rounded-full items-center justify-center'>
									<Ionicons name='person-sharp' size={16} color={"white"} />
								</TouchableOpacity>
							</View>

							{/* Mini Tab Bar */}
							<Animated.View style={[miniTabBarAnimatedStyle]}>{renderTabBar(true)}</Animated.View>
						</Animated.View>
					</Animated.View>

					{/* Horizontal Scrollable Content */}
					<Animated.View className='flex-1' entering={FadeIn.delay(400).duration(600)}>
						<ScrollView
							ref={horizontalScrollRef}
							horizontal
							pagingEnabled
							showsHorizontalScrollIndicator={false}
							scrollEnabled={false}
							contentContainerStyle={{ flexGrow: 1 }}>
							{renderNotesTab()}
							{renderCategoriesTab()}
						</ScrollView>
					</Animated.View>

					{/* Floating Action Button */}
					<Animated.View
						className={"absolute right-6 bottom-8"}
						entering={SlideInRight.delay(800).duration(600).easing(Easing.out(Easing.cubic))}>
						<TouchableOpacity
							className='w-16 h-16 bg-blue-500 rounded-2xl items-center justify-center'
							style={[styles.fabShadow]}
							onPress={() => {
								if (tabs === "notes") {
									navigation.navigate("WriteNoteScreen", {
										categoryId: selectedCategoryId || categories[0].id!,
									});
								} else {
									// Handle add category action
									// navigation.navigate("AddCategoryScreen");
								}
							}}
							activeOpacity={0.8}>
							<Ionicons name='add-sharp' size={28} color={"white"} />
						</TouchableOpacity>
					</Animated.View>
				</>
			)}

			{/* Rating Modal */}
			<Modal animationType='fade' transparent={true} visible={ratingModal} onRequestClose={toggleModal}>
				<View style={styles.centeredView}>
					<Animated.View
						className='bg-white dark:bg-gray-800 rounded-3xl mx-6 p-6 border border-gray-200 dark:border-gray-700'
						style={[styles.modalShadow]}
						entering={SlideInDown.duration(400).easing(Easing.out(Easing.cubic))}>
						<View className='items-center mb-6'>
							<View className='w-16 h-16 bg-blue-500 rounded-2xl items-center justify-center mb-4'>
								<Ionicons name='star' size={28} color='white' />
							</View>
							<Text className='text-black dark:text-white font-bold text-xl text-center mb-2'>
								{t("home.rating.title")}
							</Text>
							<Text className='text-gray-600 dark:text-gray-400 text-center'>{t("home.rating.description")}</Text>
						</View>

						<View className='flex-row items-center justify-center space-x-2 mb-6'>
							{[1, 2, 3, 4, 5].map((rate, index) => (
								<TouchableOpacity onPress={() => handleRating(rate)} key={index} className='p-2'>
									<Ionicons
										name={rate <= givenRate ? "star" : "star-outline"}
										size={32}
										color={rate <= givenRate ? "#3B82F6" : "#9CA3AF"}
									/>
								</TouchableOpacity>
							))}
						</View>

						<TouchableOpacity
							className='w-full bg-gray-100 dark:bg-gray-700 rounded-2xl p-2 items-center'
							onPress={toggleModal}
							activeOpacity={0.8}>
							<Text className='text-black dark:text-white font-semibold'>{t("home.rating.notNow")}</Text>
						</TouchableOpacity>
					</Animated.View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

export default HomeScreen;

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
	fabShadow: {
		shadowColor: "#3B82F6",
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.3,
		shadowRadius: 16,
		elevation: 12,
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
