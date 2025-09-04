import React from "react";
import { TouchableOpacity, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

interface NoteOptionsMenuProps {
	onSetReminder: () => void;
	onDelete: () => void;
	onClose: () => void;
}

const NoteOptionsMenu = ({ onSetReminder, onDelete, onClose }: NoteOptionsMenuProps) => {
	const { t } = useTranslation();
	return (
		<Pressable className='absolute z-30 top-0 w-screen h-screen' onPress={onClose}>
			<Animated.View
				entering={SlideInRight.springify().damping(15)}
				exiting={SlideOutRight.springify().damping(15)}
				className='absolute top-0 right-0 z-20 w-48'>
				<View className='rounded-xl overflow-hidden bg-white/90 dark:bg-gray-800/90 border border-gray-200/20 dark:border-gray-700/20'>
					<TouchableOpacity
						onPress={onSetReminder}
						className='flex-row items-center px-4 py-3.5 border-b border-gray-200/20 dark:border-gray-700/20 active:bg-gray-100/50 dark:active:bg-gray-700/50'>
						<Ionicons name='alarm-outline' size={18} className='text-gray-600 dark:text-gray-300' />
						<Text className='ml-3 text-gray-700 dark:text-gray-200 font-medium'>{t("setReminder")}</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={onDelete}
						className='flex-row items-center px-4 py-3.5 active:bg-gray-100/50 dark:active:bg-gray-700/50'>
						<Ionicons name='trash-outline' size={18} className='text-red-500' />
						<Text className='ml-3 text-red-500 font-medium'>{t("delete")}</Text>
					</TouchableOpacity>
				</View>
			</Animated.View>
		</Pressable>
	);
};

export default NoteOptionsMenu;
