import "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import "./i18n";
import ToastComponent, { ToastProps } from "./src/components/ToastComponent";
import Main from "./Main";
import store from "./src/redux/store";
import "moment/min/moment-with-locales";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { registerForPushNotificationsAsync } from "./src/utils/notifications";
import { Platform } from "react-native";

const toastConfig = {
	customToast: ({ props }: { props: ToastProps }) => (
		<ToastComponent message={props.message} icon={props.icon} type={props.type} />
	),
};
SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});
export default function App() {
	const [expoPushToken, setExpoPushToken] = useState("");
	const notificationListener = useRef<Notifications.Subscription>();
	const responseListener = useRef<Notifications.Subscription>();
	const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
	const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
	useEffect(() => {
		registerForPushNotificationsAsync().then((token) => token && setExpoPushToken(token));
		if (Platform.OS === "android") {
			Notifications.getNotificationChannelsAsync().then((value) => setChannels(value ?? []));
		}
		notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
			setNotification(notification);
		});

		responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
			console.log(response);
		});

		return () => {
			notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
			responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);
	return (
		<Provider store={store}>
			<StatusBar style='light' />
			<Main />
			<Toast config={toastConfig} />
		</Provider>
	);
}
