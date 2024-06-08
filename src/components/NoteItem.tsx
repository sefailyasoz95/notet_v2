import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { AppStackParams, NoteType } from "../utils/types";
import { commonStyles } from "../utils/commonStyles";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import moment from "moment";
import i18next from "i18next";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { deleteNote, updateNote } from "../redux/actions";
import { useTranslation } from "react-i18next";
import { BlurView } from "expo-blur";
import { DEVICE_WIDTH } from "../utils/constants";
import * as Notifications from "expo-notifications";
import useToast from "../hooks/useToast";
import { schedulePushNotification } from "../utils/notifications";
import RNDateTimePicker from "@react-native-community/datetimepicker";

type Props = {
	note: NoteType;
	index: number;
};
moment.locale(i18next.language);

const NoteItem = ({ note, index }: Props) => {
	console.log("note: ", note, " => index: ", index);

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
		if (note.id !== -1)
			navigation.navigate("WriteNoteScreen", {
				note,
				categoryId: note.categoryId,
			});
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
			showToast({ message: "allowNotifications", icon: "close-sharp", type: "error" });
		} else {
			if (reminderDate) {
				schedulePushNotification(
					{
						body: note.text,
						title: note.title,
						data: { data: "testing" },
					},
					reminderDate
				);
				toggleModal();
				showToast({ message: "reminderSet", icon: "checkmark-sharp", type: "success" });
			}
		}
	};
	return (
		<Animated.View
			style={[commonStyles.smallBottomShadow, { width: DEVICE_WIDTH * 0.95 }]}
			className={`bg-white rounded-xl self-center my-4 border-2 ${isComplete ? "border-green-700" : "border-black"}`}
			entering={FadeInDown.delay(200 * index)}
			key={index}>
			<Pressable onPress={navigateToDetail} className='px-3 py-4 flex-row items-center justify-between rounded-xl'>
				<View className='flex-row items-center gap-x-2'>
					{isComplete ? (
						<TouchableOpacity
							className='w-7 h-7 items-center justify-center rounded-full border-2 border-green-700'
							onPress={toggleComplete}>
							<Entypo name='check' size={21} color={"green"} />
						</TouchableOpacity>
					) : (
						<TouchableOpacity className='w-7 h-7' onPress={toggleComplete}>
							<Entypo name='circle' size={27} color={"black"} />
						</TouchableOpacity>
					)}
					<View>
						<Text className='font-bold text-xl'>{note.title}</Text>
						<Text className='text-xs'>{moment(note.updated_at ? note.updated_at : note.created_at!).fromNow()}</Text>
					</View>
				</View>
				<TouchableOpacity className='w-7 h-6' onPress={toggleOptionsMenu}>
					<Entypo name='dots-three-vertical' size={24} color='black' />
					{isOptionsOpen && (
						<Animated.View entering={FadeInRight.delay(200)} className={"absolute -top-5 right-9"}>
							<BlurView
								intensity={40}
								style={{
									overflow: "hidden",
									width: DEVICE_WIDTH * 0.5,
								}}
								className={`rounded-xl bg-opacity-90`}>
								<TouchableOpacity
									className='px-2 border-2 py-2 rounded-t-xl'
									onPress={() => {
										toggleOptionsMenu();
										toggleModal();
									}}>
									<Text className='font-semibold' style={{ fontSize: 16 }}>
										{t("setReminder")}
									</Text>
								</TouchableOpacity>
								<TouchableOpacity className='px-2 border-2 py-2 rounded-b-xl' onPress={handleDelete}>
									<Text className='font-semibold' style={{ fontSize: 16 }}>
										{t("delete")}
									</Text>
								</TouchableOpacity>
							</BlurView>
						</Animated.View>
					)}
				</TouchableOpacity>
			</Pressable>
			<Modal animationType='slide' transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
				<View style={styles.centeredView}>
					<RNDateTimePicker
						mode='datetime'
						style={styles.pickerStyle}
						display='spinner'
						value={reminderDate}
						minimumDate={new Date()}
						onChange={(e) => {
							setReminderDate(new Date(e.nativeEvent.timestamp));
						}}
					/>
					<View className='flex-row items-center justify-around w-11/12'>
						<TouchableOpacity
							className='w-1/3 items-center rounded-xl mt-2 py-2 justify-center bg-black'
							onPress={toggleModal}>
							<Text className='text-white font-semibold text-lg '>{t("cancel")}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className='w-1/3 items-center rounded-xl mt-2 py-2 justify-center bg-green-700'
							onPress={handleSetReminder}>
							<Text className='text-white font-semibold text-lg '>{t("save")}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</Animated.View>
	);
};

export default NoteItem;

const styles = StyleSheet.create({
	centeredView: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
		backgroundColor: "rgba(0,0,0,0.4)",
		flex: 1,
	},
	pickerStyle: {
		backgroundColor: "rgba(0,0,0,0.4)",
		borderRadius: 20,
		overflow: "hidden",
		width: DEVICE_WIDTH * 0.91,
	},
});
// https://cloud.mail.ru/public/29Rc/fZHpqYiff
