import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { createRef, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParams } from "../utils/types";
import Animated, { Easing, FadeIn, SlideInRight, SlideInUp } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { createCategory, getCurrentUser } from "../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { commonStyles } from "../utils/commonStyles";
import { FlashList } from "@shopify/flash-list";
import NoteItem from "../components/NoteItem";
import { DEVICE_HEIGHT } from "../utils/constants";
import useToast from "../hooks/useToast";
import { SafeAreaView } from "react-native-safe-area-context";
import * as StoreReview from "expo-store-review";

type Props = NativeStackScreenProps<AppStackParams, "HomeScreen">;
const HomeScreen = ({ navigation, route }: Props) => {
	const { t } = useTranslation();
	const { currentUser, onboardingPassed, savedNotes, loading, categories, success, error, message } = useAppSelector(
		(state) => state.global
	);
	const scrollRef = createRef<ScrollView>();
	const [tabs, setTabs] = useState<"notes" | "categories">("notes");
	const dispatch = useAppDispatch();
	const { showToast } = useToast();
	const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id);

	const fetchUser = async () => {
		const deviceId = await AsyncStorage.getItem("deviceId");
		dispatch(getCurrentUser(deviceId!));
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

	// useEffect(() => {
	// 	const channels = supabase
	// 		.channel("custom-all-channel")
	// 		.on("postgres_changes", { event: "*", schema: "public", table: "notes" }, (payload) => {
	// 			console.log("Change received! new:", payload.new);
	// 			console.log("Change received! old:", payload.old);
	// 		})
	// 		.subscribe();
	// 	return () => {
	// 		channels.unsubscribe();
	// 	};
	// }, []);
	useEffect(() => {
		(async () => {
			if (savedNotes.length > 0 && savedNotes.length % 2 === 0) {
				await StoreReview.requestReview();
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
	const toggleTab = () => {
		if (tabs === "notes") {
			scrollRef.current?.scrollToEnd();
		} else {
			scrollRef.current?.scrollTo({ animated: true, x: 0, y: 0 });
		}
		setTabs((prev) => (prev === "notes" ? "categories" : "notes"));
	};
	return (
		<SafeAreaView className='flex-1 bg-white justify-end' edges={["left", "right"]}>
			{loading && (
				<Animated.View
					entering={FadeIn}
					className={"absolute w-full h-full z-30 flex-1 items-center justify-center bg-[#00000099]"}>
					<ActivityIndicator size={50} color={"white"} />
				</Animated.View>
			)}
			{typeof currentUser !== undefined && (
				<>
					<Animated.View
						className='bg-black absolute top-0 z-20 rounded-b-3quarter h-1/6 w-full justify-center px-5'
						style={commonStyles.headerShadow}
						entering={SlideInUp.duration(500).easing(Easing.elastic(0.1))}>
						<View className='flex-row items-center justify-between'>
							<View className='flex-row items-center gap-x-2'>
								<Image
									className='rounded-full w-10 h-10'
									source={require("../../assets/favicon.png")}
									contentFit='cover'
									transition={100}
								/>
								<Text className='text-white font-semibold'>
									{t("hello")},
									{currentUser && currentUser?.fullName
										? ` ${currentUser?.fullName.split(" ")[0]}`
										: ` Guest${currentUser?.deviceId.split("-")[0]}`}
								</Text>
							</View>
							<TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
								<Ionicons name='person-sharp' size={25} color={"white"} />
							</TouchableOpacity>
						</View>
					</Animated.View>
					<FlashList
						estimatedItemSize={200}
						contentContainerStyle={{ paddingTop: DEVICE_HEIGHT * 0.18 }}
						data={savedNotes}
						renderItem={({ item, index }) => <NoteItem note={item} key={index} index={index} />}
						ListEmptyComponent={() =>
							loading ? (
								<></>
							) : (
								<NoteItem
									note={{
										categoryId: 0,
										isComplete: false,
										text: "",
										title: t("noNotesYet"),
										userId: -1,
										created_at: currentUser?.created_at,
										id: -1,
									}}
									index={1}
								/>
							)
						}
					/>
					{/* TODO: ENABLE CATEGORY ADD FEATURE IN THE NEXT RELEASE */}
					{/* <View
				style={{ paddingTop: DEVICE_HEIGHT * 0.18 }}
				className='flex-row items-center justify-between w-10/12 self-center'>
				<TouchableOpacity
					className={`border-2 rounded-xl px-2 ${tabs === "notes" ? "bg-black" : ""}`}
					onPress={toggleTab}>
					<Text className={`${tabs === "notes" ? "text-white" : ""} text-lg font-semibold`}>Notes</Text>
				</TouchableOpacity>
				<TouchableOpacity
					className={`border-2 rounded-xl px-2 ${tabs === "categories" ? "bg-black" : ""}`}
					onPress={toggleTab}>
					<Text className={`${tabs === "categories" ? "text-white" : ""} text-lg font-semibold`}>Categories</Text>
				</TouchableOpacity>
			</View> */}

					{/* <ScrollView
				horizontal
				scrollEnabled={false}
				showsHorizontalScrollIndicator={false}
				ref={scrollRef}
				contentContainerStyle={{}}>
				<View style={{ width: DEVICE_WIDTH }}>
					<FlashList
						estimatedItemSize={200}
						data={savedNotes}
						renderItem={({ item, index }) => <NoteItem note={item} key={index} index={index} />}
						ListEmptyComponent={() =>
							loading ? (
								<></>
							) : (
								<NoteItem
									note={{
										categoryId: 0,
										isComplete: false,
										text: "",
										title: t("noNotesYet"),
										userId: -1,
										created_at: currentUser?.created_at,
										id: -1,
									}}
									index={1}
								/>
							)
						}
					/>
				</View>
				<View style={{ width: DEVICE_WIDTH }}>
					<FlashList
						estimatedItemSize={200}
						data={categories}
						renderItem={({ item, index }) => (
							<View
								key={index}
								className='items-center bg-white rounded-xl self-center my-4 border-2'
								style={[commonStyles.smallBottomShadow, { width: DEVICE_WIDTH * 0.95 }]}>
								<Text className='text-lg'>{t(item.name)}</Text>
							</View>
						)}
					/>
				</View>
			</ScrollView> */}
					<Animated.View
						className={"w-10 self-end h-10 items-center right-7 bottom-12"}
						style={commonStyles.smallBottomShadow}
						entering={SlideInRight.duration(500).easing(Easing.elastic(0.5))}>
						<TouchableOpacity
							className='rounded-full border-2 bg-white border-green-700'
							onPress={() => {
								navigation.navigate("WriteNoteScreen", {
									categoryId: selectedCategoryId || categories[0].id!,
								});
							}}>
							<Ionicons name='add-sharp' size={35} color={"green"} />
						</TouchableOpacity>
					</Animated.View>
				</>
			)}
		</SafeAreaView>
	);
};

export default HomeScreen;
