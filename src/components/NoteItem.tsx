import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Pressable, Modal } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { updateNote, deleteNote } from "../redux/actions";
import { useTranslation } from "react-i18next";
import useToast from "../hooks/useToast";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import moment from "moment";
import i18next from "i18next";
import { AppStackParams, NoteType } from "../utils/types";
import NoteOptionsMenu from "./NoteOptionsMenu";

interface Props {
	note: NoteType;
	index: number;
}

const NoteItem = ({ note, index }: Props) => {
	moment.locale(i18next.language);

	const navigation = useNavigation<NavigationProp<AppStackParams>>();
	const { currentUser } = useAppSelector((state) => state.global);
	const [isOptionsOpen, setIsOptionsOpen] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [reminderDate, setReminderDate] = useState<Date>(new Date(new Date().setHours(new Date().getHours() + 1)));
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { showToast } = useToast();
	const [isComplete, setIsComplete] = useState(note.isComplete);

	const navigateToDetail = () => {
		if (note.id !== -1) {
			navigation.navigate("WriteNoteScreen", {
				note,
				categoryId: note.categoryId,
			});
		}
	};

	const handleIsComplete = () => {
		dispatch(
			updateNote({
				...note,
				isComplete,
			})
		);
	};

	useEffect(() => {
		if (isComplete !== note.isComplete) {
			handleIsComplete();
		}
	}, [isComplete]);

	const handleDelete = () => {
		dispatch(
			deleteNote({
				id: note.id!,
				userId: currentUser?.id!,
			})
		);
		toggleOptionsMenu();
	};

	const toggleComplete = () => {
		if (note.id !== -1) setIsComplete(!isComplete);
	};

	const toggleOptionsMenu = () => setIsOptionsOpen(!isOptionsOpen);
	const toggleModal = () => setModalVisible(!modalVisible);

	const handleSetReminder = async () => {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		if (existingStatus !== "granted") {
			showToast({
				message: "allowNotifications",
				icon: "close-sharp",
				type: "error",
			});
		} else {
			if (reminderDate) {
				// schedulePushNotification function would be implemented elsewhere
				toggleModal();
				showToast({
					message: "reminderSet",
					icon: "checkmark-sharp",
					type: "success",
				});
			}
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return { bg: "bg-red-500", text: "text-red-500", dot: "#EF4444" };
			case "medium":
				return { bg: "bg-yellow-500", text: "text-yellow-500", dot: "#F59E0B" };
			case "low":
				return { bg: "bg-green-500", text: "text-green-500", dot: "#10B981" };
			default:
				return { bg: "bg-gray-500", text: "text-gray-500", dot: "#6B7280" };
		}
	};

	const priority = getPriorityColor("medium");

	return (
		<>
			{/* Options Menu Overlay */}
			{isOptionsOpen && (
				<NoteOptionsMenu
					onSetReminder={() => {
						toggleOptionsMenu();
						toggleModal();
					}}
					onDelete={handleDelete}
					onClose={toggleOptionsMenu}
				/>
			)}

			<Animated.View entering={FadeInDown.delay(100 * index).duration(600)} className='mx-4 mb-4'>
				<Pressable
					onPress={navigateToDetail}
					className={`relative overflow-hidden rounded-2xl border-2 ${
						isComplete
							? "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
							: "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700"
					}`}
					style={{
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.1,
						shadowRadius: 12,
						elevation: 4,
					}}>
					{/* Priority Indicator */}
					<View className={`absolute top-0 left-0 w-1 h-full ${priority.bg}`} />

					{/* Main Content */}
					<View className='p-4'>
						<View className='flex-row items-start justify-between mb-3'>
							<View className='flex-row items-center flex-1'>
								{/* Completion Toggle */}
								<TouchableOpacity
									onPress={toggleComplete}
									className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
										isComplete ? "bg-green-500 border-green-500" : "border-gray-300 dark:border-gray-600"
									}`}>
									{isComplete && <Ionicons name='checkmark' size={16} color='white' />}
								</TouchableOpacity>

								{/* Content */}
								<View className='flex-1 mr-2'>
									<Text
										className={`font-bold text-lg mb-1 ${
											isComplete ? "text-gray-500 dark:text-gray-400 line-through" : "text-gray-900 dark:text-white"
										}`}
										numberOfLines={2}>
										{note.title}
									</Text>

									{/* Note Preview */}
									{note.text && (
										<Text
											className={`text-sm mb-2 ${
												isComplete ? "text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-300"
											}`}
											numberOfLines={2}>
											{note.text}
										</Text>
									)}

									{/* Meta Info */}
									<View className='flex-row items-center justify-between'>
										<View className='flex-row items-center'>
											<View className={`w-2 h-2 rounded-full ${priority.bg} mr-2`} />
											<Text className={`text-xs font-medium ${priority.text}`}>{"medium"}</Text>
										</View>

										<View className='flex-row items-center'>
											<Ionicons name='time-outline' size={12} color={isComplete ? "#9CA3AF" : "#6B7280"} />
											<Text
												className={`text-xs ml-1 ${
													isComplete ? "text-gray-400 dark:text-gray-500" : "text-gray-500 dark:text-gray-400"
												}`}>
												{moment(note.updated_at || note.created_at).fromNow()}
											</Text>
										</View>
									</View>
								</View>
							</View>

							{/* Options Menu */}
							<TouchableOpacity
								onPress={toggleOptionsMenu}
								className='w-8 h-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'>
								<Ionicons name='ellipsis-vertical' size={16} color='#6B7280' />
							</TouchableOpacity>
						</View>

						{/* Tags/Categories */}
						{/* {note.category && (
						<View className="flex-row items-center mt-2">
							<View className="bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 mr-2">
								<Text className="text-xs font-medium text-blue-600 dark:text-blue-400">
									{note.category}
								</Text>
							</View>
							{note.hasReminder && (
								<View className="bg-orange-100 dark:bg-orange-900 rounded-full px-2 py-1">
									<Ionicons name="notifications" size={12} color="#F97316" />
								</View>
							)}
						</View>
					)} */}
					</View>
				</Pressable>

				{/* Reminder Modal */}
				<Modal animationType='fade' transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
					<View className='flex-1 justify-center items-center bg-black/50'>
						<Animated.View
							entering={FadeIn.duration(300)}
							className='bg-white dark:bg-gray-800 rounded-3xl mx-6 p-6 min-w-[300px]'
							style={{
								shadowColor: "#000",
								shadowOffset: { width: 0, height: 20 },
								shadowOpacity: 0.25,
								shadowRadius: 25,
								elevation: 20,
							}}>
							<View className='items-center mb-6'>
								<View className='w-16 h-16 bg-orange-500 rounded-full items-center justify-center mb-4'>
									<Ionicons name='alarm' size={24} color='white' />
								</View>
								<Text className='text-xl font-bold text-gray-900 dark:text-white mb-2'>{t("setReminder")}</Text>
								<Text className='text-gray-600 dark:text-gray-300 text-center'>
									Choose when you want to be reminded
								</Text>
							</View>

							<View className='bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6'>
								<RNDateTimePicker
									mode='datetime'
									display='compact'
									value={reminderDate}
									minimumDate={new Date()}
									onChange={(e) => {
										setReminderDate(new Date(e.nativeEvent.timestamp));
									}}
									style={{ alignSelf: "center" }}
								/>
							</View>

							<View className='flex-row space-x-3'>
								<TouchableOpacity
									onPress={toggleModal}
									className='flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl py-3 items-center'>
									<Text className='text-gray-600 dark:text-gray-300 font-semibold'>{t("cancel")}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={handleSetReminder}
									className='flex-1 bg-orange-500 rounded-xl py-3 items-center'>
									<Text className='text-white font-semibold'>{t("save")}</Text>
								</TouchableOpacity>
							</View>
						</Animated.View>
					</View>
				</Modal>
			</Animated.View>
		</>
	);
};

export default NoteItem;
