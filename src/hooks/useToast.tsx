import Toast from "react-native-toast-message";

type ToastParams = {
	message: string;
	icon: "close-sharp" | "checkmark-sharp" | "warning-sharp";
	type: "error" | "success" | "warning";
};
const useToast = () => {
	const showToast = ({ message, icon, type }: ToastParams) => {
		Toast.show({
			type: "customToast",
			props: { message, icon, type },
		});
	};
	const hideToast = () => {
		Toast.hide();
	};
	return { showToast, hideToast };
};

export default useToast;
