import React from "react";
import { Toolbar, DEFAULT_TOOLBAR_ITEMS, type EditorBridge } from "@10play/tentap-editor";

interface ToolbarWithColorProps {
	editor: EditorBridge;
	activeKeyboard?: string | undefined;
	setActiveKeyboard?: (id: string | undefined) => void;
}
export const ToolbarWithColor = ({ editor }: ToolbarWithColorProps) => {
	return <Toolbar editor={editor} items={[...DEFAULT_TOOLBAR_ITEMS]} />;
};
