import {
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
	Text,
	Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import Animated, {
	Easing,
	SlideInUp,
	FadeIn,
	FadeInLeft,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
	interpolate,
} from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParams } from "../utils/types";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { saveNote, updateNote } from "../redux/actions";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RichText, useEditorBridge, TenTapStartKit, BridgeState, useKeyboard } from "@10play/tentap-editor";
import { ToolbarWithColor } from "../components/ToolbarWithColor";

type Props = NativeStackScreenProps<AppStackParams, "WriteNoteScreen">;

const HEADER_MAX_HEIGHT = 220;
const HEADER_MIN_HEIGHT = 100;

const WriteNoteScreen = ({ navigation, route }: Props) => {
	const [title, setTitle] = useState(route.params?.note?.title ?? "");
	const [showRichToolbar, setShowRichToolbar] = useState(false);
	const { currentUser, categories } = useAppSelector((state) => state.global);
	const dispatch = useAppDispatch();
	const insets = useSafeAreaInsets();
	const [selectedCategoryId, setSelectedCategoryId] = useState(route.params.categoryId);
	const { t } = useTranslation();
	const { isKeyboardUp: isNativeKeyboardUp, keyboardHeight } = useKeyboard();

	// 10Tap Editor setup
	const editor = useEditorBridge({
		autofocus: true,
		avoidIosKeyboard: true,
		initialContent: route.params?.note?.text || "",
		bridgeExtensions: TenTapStartKit,
	});

	// Animation values
	const headerHeight = useSharedValue(HEADER_MAX_HEIGHT);
	const toolbarHeight = useSharedValue(0);
	const saveButtonScale = useSharedValue(0);
	const contentPaddingTop = useSharedValue(HEADER_MAX_HEIGHT);

	// Track editor content
	const [editorContent, setEditorContent] = useState("");

	useEffect(() => {
		// Show save button if there's content
		if (editorContent.length > 2 || title.length > 0) {
			saveButtonScale.value = withSpring(1, {
				damping: 15,
				stiffness: 100,
			});
		}
	}, []);

	useEffect(() => {
		// Animate save button based on content
		if (editorContent.length > 2 || title.length > 0) {
			saveButtonScale.value = withSpring(1, {
				damping: 15,
				stiffness: 100,
			});
		} else {
			saveButtonScale.value = withSpring(0, {
				damping: 15,
				stiffness: 100,
			});
		}
	}, [editorContent, title]);

	// Animate header based on keyboard visibility
	useEffect(() => {
		if (isNativeKeyboardUp) {
			headerHeight.value = withTiming(HEADER_MIN_HEIGHT, {
				duration: 300,
				easing: Easing.out(Easing.cubic),
			});
			contentPaddingTop.value = withTiming(HEADER_MIN_HEIGHT, {
				duration: 300,
				easing: Easing.out(Easing.cubic),
			});
		} else {
			headerHeight.value = withTiming(HEADER_MAX_HEIGHT, {
				duration: 300,
				easing: Easing.out(Easing.cubic),
			});
			contentPaddingTop.value = withTiming(HEADER_MAX_HEIGHT, {
				duration: 300,
				easing: Easing.out(Easing.cubic),
			});
		}
	}, [isNativeKeyboardUp]);

	// Listen to editor content changes
	useEffect(() => {
		const unsubscribe = editor._subscribeToEditorStateUpdate((editorState: BridgeState) => {
			if (editorState.isFocused) openRichToolbar();
			else closeRichToolbar();
			// Get HTML content from the editor bridge
			editor.getHTML().then((html) => {
				setEditorContent(html);
			});
		});

		return () => {
			unsubscribe();
		};
	}, [editor]);

	const handleBack = () => {
		if (!route.params.note) {
			if (editorContent.length > 0 || title.length > 0)
				dispatch(
					saveNote({
						userId: currentUser?.id!,
						isComplete: false,
						remind_at: undefined,
						text: editorContent,
						title: title,
						categoryId: selectedCategoryId!,
					})
				);
		} else {
			if (
				route.params.note.title !== title ||
				route.params.note.text !== editorContent ||
				route.params.note.categoryId !== selectedCategoryId
			) {
				dispatch(
					updateNote({
						userId: currentUser?.id!,
						isComplete: route.params.note.isComplete,
						remind_at: route.params.note.remind_at,
						text: editorContent,
						title: title.length ? title : t("untitled"),
						categoryId: selectedCategoryId!,
						id: route.params.note.id,
						updated_at: new Date(),
					})
				);
			}
		}
		navigation.goBack();
	};

	const closeRichToolbar = () => {
		setShowRichToolbar(false);
		toolbarHeight.value = withTiming(0, {
			duration: 300,
			easing: Easing.out(Easing.cubic),
		});
	};

	const openRichToolbar = () => {
		setShowRichToolbar(true);
		toolbarHeight.value = withTiming(50, {
			duration: 300,
			easing: Easing.out(Easing.cubic),
		});
	};

	const handleCategorySelect = (categoryId: number) => {
		setSelectedCategoryId(categoryId);
	};

	// Animation styles
	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			height: headerHeight.value,
			paddingTop: insets.top + 20,
		};
	});

	const headerContentAnimatedStyle = useAnimatedStyle(() => {
		const progress = interpolate(headerHeight.value, [HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT], [0, 1], "clamp");

		return {
			opacity: interpolate(progress, [0, 1], [0.8, 1], "clamp"),
		};
	});

	const titleInputAnimatedStyle = useAnimatedStyle(() => {
		const progress = interpolate(headerHeight.value, [HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT], [0, 1], "clamp");

		return {
			opacity: progress,
			transform: [
				{
					translateY: interpolate(progress, [0, 1], [-20, 0], "clamp"),
				},
				{ scale: interpolate(progress, [0, 1], [0.9, 1], "clamp") },
			],
		};
	});

	const categoryScrollAnimatedStyle = useAnimatedStyle(() => {
		const progress = interpolate(headerHeight.value, [HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT], [0, 1], "clamp");
		return {
			opacity: progress,
			transform: [
				{
					translateY: interpolate(progress, [0, 1], [-15, 0], "clamp"),
				},
				{ scale: interpolate(progress, [0, 1], [0.9, 1], "clamp") },
			],
		};
	});

	const contentAnimatedStyle = useAnimatedStyle(() => {
		return {
			paddingTop: contentPaddingTop.value,
		};
	});

	const saveButtonAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: saveButtonScale.value }],
		};
	});

	const toolbarAnimatedStyle = useAnimatedStyle(() => {
		return {
			height: toolbarHeight.value,
			opacity: toolbarHeight.value / 50,
		};
	});

	const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);

	return (
		<SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900' edges={["left", "right"]}>
			{/* Animated Header */}
			<Animated.View
				className='bg-black dark:bg-white rounded-b-3xl px-6 pb-6 absolute top-0 left-0 right-0 z-10'
				style={[styles.headerShadow, headerAnimatedStyle]}>
				<Animated.View style={[headerContentAnimatedStyle]}>
					<View className='flex-row items-center justify-between mb-6'>
						<TouchableOpacity
							onPress={navigation.goBack}
							className='w-10 h-10 bg-white/10 dark:bg-black/10 rounded-full items-center justify-center'>
							<Ionicons name='chevron-back' size={24} color={"white"} />
						</TouchableOpacity>

						<View className='flex-1 mx-4'>
							<Text className='text-white dark:text-black font-bold text-lg text-center'>
								{route.params.note ? t("editNote") : t("newNote")}
							</Text>
							{selectedCategory && (
								<Text className='text-white/70 dark:text-black/70 text-sm text-center'>{t(selectedCategory.name)}</Text>
							)}
						</View>

						{showRichToolbar && (
							<TouchableOpacity
								onPress={closeRichToolbar}
								className='w-10 h-10 bg-white/10 dark:bg-black/10 rounded-full items-center justify-center'>
								<Ionicons name={"close"} size={20} color={"white"} />
							</TouchableOpacity>
						)}
					</View>

					{/* Title Input */}
					<Animated.View className='bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4' style={[titleInputAnimatedStyle]}>
						<TextInput
							className='text-black dark:text-white font-bold text-xl'
							placeholder={t("title")}
							placeholderTextColor='#9CA3AF'
							value={title}
							onChangeText={setTitle}
						/>
					</Animated.View>

					{/* Category Selection */}
					<Animated.View style={[categoryScrollAnimatedStyle]} className='bg-black mb-4'>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{ paddingHorizontal: 4 }}>
							{categories.map((cat, index) => (
								<View key={cat.id} className='mr-3'>
									<TouchableOpacity
										onPress={() => handleCategorySelect(cat.id!)}
										className={`px-4 py-2 rounded-full border-2 ${
											selectedCategoryId === cat.id
												? "border-blue-500 bg-blue-500/20"
												: "border-white/30 dark:border-gray-600"
										}`}>
										<Text
											className={`font-semibold ${
												selectedCategoryId === cat.id ? "text-blue-400" : "text-white dark:text-gray-300"
											}`}>
											{t(cat.name)}
										</Text>
									</TouchableOpacity>
								</View>
							))}
						</ScrollView>
					</Animated.View>
				</Animated.View>
			</Animated.View>

			{/* Rich Text Toolbar */}
			<Animated.View
				style={[toolbarAnimatedStyle, { overflow: "hidden", zIndex: 5 }]}
				className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
				<ToolbarWithColor editor={editor} />
			</Animated.View>

			{/* Content Area */}
			<KeyboardAvoidingView
				className='flex-1'
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
				<Animated.View className='flex-1 m-4' style={[contentAnimatedStyle]}>
					<View className='bg-white dark:bg-gray-800 rounded-2xl flex-1 p-4' style={styles.contentShadow}>
						<RichText editor={editor} style={styles.richText} />
					</View>
				</Animated.View>
			</KeyboardAvoidingView>

			{/* Floating Save Button */}
			<Animated.View
				style={[
					saveButtonAnimatedStyle,
					{
						position: "absolute",
						bottom: isNativeKeyboardUp ? keyboardHeight + 20 : insets.bottom + 20,
						right: 20,
						zIndex: 20,
					},
				]}>
				<TouchableOpacity
					onPress={handleBack}
					className='w-8 h-8 bg-blue-500 rounded-2xl items-center justify-center'
					style={[styles.fabShadow]}
					activeOpacity={0.8}>
					<Ionicons name='checkmark-sharp' size={22} color={"white"} />
				</TouchableOpacity>
			</Animated.View>
		</SafeAreaView>
	);
};

export default WriteNoteScreen;

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
	contentShadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 8,
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
	richText: {
		backgroundColor: "transparent",
		minHeight: 200,
		flex: 1,
	},
});
