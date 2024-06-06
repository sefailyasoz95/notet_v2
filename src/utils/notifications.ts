import * as Notifications from "expo-notifications";
import { NotificationContentType } from "./types";
import { Platform } from "react-native";
import Constants from "expo-constants";

export async function schedulePushNotification(content: NotificationContentType, trigger: Date) {
	await Notifications.scheduleNotificationAsync({
		content: {
			...content,
			sound: "default",
		},
		trigger: { date: trigger },
	});
}

export async function registerForPushNotificationsAsync() {
	let token;

	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}
	if (finalStatus !== "granted") {
		alert("Failed to get push token for push notification!");
		return;
	}

	try {
		const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

		if (!projectId) {
			throw new Error("Project ID not found");
		}
		token = (
			await Notifications.getExpoPushTokenAsync({
				projectId,
			})
		).data;
	} catch (e) {
		token = `${e}`;
	}

	return token;
}
