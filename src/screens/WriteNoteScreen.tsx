import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Animated, { Easing, FadeInLeft, SlideInUp } from "react-native-reanimated";
import { commonStyles } from "../utils/commonStyles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParams } from "../utils/types";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { saveNote, updateNote } from "../redux/actions";
import { useTranslation } from "react-i18next";

type Props = NativeStackScreenProps<AppStackParams, "WriteNoteScreen">;

const WriteNoteScreen = ({ navigation, route }: Props) => {
	const [title, setTitle] = useState(route.params?.note?.title ?? "");
	const [note, setNote] = useState(route.params?.note?.text ?? "");
	const { currentUser, categories } = useAppSelector((state) => state.global);
	const dispatch = useAppDispatch();
	const [selectedCategoryId, setSelectedCategoryId] = useState(route.params.categoryId);
	const { t } = useTranslation();
	// const richText = createRef<RichEditor>();
	// const handleHead = () => <Text style={{ color: "black" }}>H1</Text>;
	const handleBack = () => {
		if (!route.params.note) {
			if (note)
				dispatch(
					saveNote({
						userId: currentUser?.id!,
						isComplete: false,
						remind_at: undefined,
						text: note,
						title: title.length ? title : "Untitled",
						categoryId: selectedCategoryId!,
					})
				);
		} else {
			if (
				route.params.note.title !== title ||
				route.params.note.text !== note ||
				route.params.note.categoryId !== selectedCategoryId
			) {
				dispatch(
					updateNote({
						userId: currentUser?.id!,
						isComplete: route.params.note.isComplete,
						remind_at: route.params.note.remind_at,
						text: note,
						title: title.length ? title : "Untitled",
						categoryId: selectedCategoryId!,
						id: route.params.note.id,
						updated_at: new Date(),
					})
				);
			}
		}
		navigation.goBack();
	};
	return (
		<View className='flex-1 bg-white'>
			<Animated.View
				className='bg-black rounded-b-3quarter flex-col justify-center items-center h-1/6 w-full pr-5 pl-2'
				style={commonStyles.headerShadow}
				entering={SlideInUp.duration(500).easing(Easing.elastic(0.1))}>
				<View className='flex-row items-center justify-between mt-6'>
					<TouchableOpacity onPress={handleBack}>
						<Ionicons name='chevron-back' size={30} color={"white"} />
					</TouchableOpacity>
					<TextInput
						className='bg-white px-3 font-bold py-1.5 rounded-full w-11/12'
						placeholder='Title'
						style={{ fontSize: 20 }}
						value={title}
						onChangeText={setTitle}
						autoFocus
					/>
				</View>
				{/* TODO: ENABLE CATEGORY ADD FEATURE IN THE NEXT RELEASE */}
				{/* <ScrollView horizontal contentContainerStyle={styles.categories} className='self-center'>
					{categories.map((cat, index) => (
						<Animated.View entering={FadeInLeft.delay(200 * (index + 1))} key={index}>
							<TouchableOpacity
								className={`
							border-2 rounded-xl px-1 justify-center mx-1
							${selectedCategoryId === cat.id ? "border-green-700" : "border-white"}
							`}>
								<Text
									className={`${
										selectedCategoryId === cat.id ? "text-green-700" : "text-white"
									} font-bold p-1 self-center -mt-0.5`}>
									{t(cat.name)}
								</Text>
							</TouchableOpacity>
						</Animated.View>
					))}
				</ScrollView> */}
			</Animated.View>
			<KeyboardAvoidingView className='flex-1 ' behavior='padding'>
				<ScrollView contentContainerStyle={{ flex: 1, marginTop: 25 }} bounces={false} keyboardDismissMode='on-drag'>
					<TextInput
						className='w-full flex-1 text-start px-1'
						multiline
						value={note}
						onChangeText={setNote}
						placeholder={t("notHere")}
					/>
					{/* <RichEditor
						ref={richText}
						scrollEnabled
						onChange={(descriptionText) => {
							console.log("descriptionText:", descriptionText);
						}}
						className='flex-1'
					/>
					<RichToolbar
						editor={richText}
						actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1]}
						iconMap={{ [actions.heading1]: handleHead }}
					/> */}
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

export default WriteNoteScreen;

const styles = StyleSheet.create({
	categories: {
		height: 25,
		alignItems: "center",
		width: "80%",
		alignSelf: "center",
	},
});
