import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useRef } from "react";
import { SafeAreaView, View, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import {
	RichText,
	Toolbar,
	useEditorBridge,
	ColorKeyboard,
	DEFAULT_TOOLBAR_ITEMS,
	useKeyboard,
	type EditorBridge,
	useBridgeState,
	TenTapStartKit,
	CoreBridge,
	darkEditorTheme,
	darkEditorCss,
} from "@10play/tentap-editor";

const EDITOR_BACKGROUND_COLOR = "#1C1C1E";

export const DarkEditor = ({}: NativeStackScreenProps<any, any, any>) => {
	const editor = useEditorBridge({
		autofocus: true,
		avoidIosKeyboard: true,
		initialContent: "",
		bridgeExtensions: [...TenTapStartKit, CoreBridge.configureCSS(darkEditorCss)],
		theme: darkEditorTheme,
	});

	const rootRef = useRef(null);
	const [activeKeyboard, setActiveKeyboard] = React.useState<string>();

	return (
		<SafeAreaView
			style={{
				...exampleStyles.fullScreen,
				backgroundColor: EDITOR_BACKGROUND_COLOR,
			}}
			ref={rootRef}>
			<View
				style={{
					...exampleStyles.fullScreen,
					paddingHorizontal: 12,
					backgroundColor: EDITOR_BACKGROUND_COLOR,
				}}>
				<RichText editor={editor} />
			</View>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={exampleStyles.keyboardAvoidingView}>
				<ToolbarWithColor editor={editor} activeKeyboard={activeKeyboard} setActiveKeyboard={setActiveKeyboard} />
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

interface ToolbarWithColorProps {
	editor: EditorBridge;
	activeKeyboard?: string | undefined;
	setActiveKeyboard?: (id: string | undefined) => void;
}
export const ToolbarWithColor = ({ editor }: ToolbarWithColorProps) => {
	// Get updates of editor state
	const editorState = useBridgeState(editor);
	console.log("editorState: ", editorState);

	const { isKeyboardUp: isNativeKeyboardUp } = useKeyboard();

	// Here we make sure not to hide the keyboard if our custom keyboard is visible

	return <Toolbar editor={editor} items={[...DEFAULT_TOOLBAR_ITEMS]} />;
};

const exampleStyles = StyleSheet.create({
	fullScreen: {
		flex: 1,
	},
	keyboardAvoidingView: {
		position: "absolute",
		width: "100%",
		bottom: 0,
	},
});
