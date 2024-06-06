export type InitialState = {
	error: boolean;
	success: boolean;
	message: string;
	isAuthenticated: boolean;
	currentLanguage: string;
	loading: boolean;
	onboardingPassed: boolean;
	isPremium: boolean;
	currentUser?: UserType;
	savedNotes: Array<NoteType>;
	remainingHourForNewScan: number;
	categories: Array<CategoryType>;
};

export type AuthStackParams = {
	OnboardingScreen: undefined;
};
export type TabStackParams = {
	Camera: undefined;
	Profile: undefined;
	Home: undefined;
};
export type AppStackParams = {
	HomeScreen: undefined;
	ProfileScreen: undefined;
	WriteNoteScreen: {
		note?: NoteType;
		categoryId: number;
	};
	DescriptionScreen: {
		description: string;
	};
};
export interface API_RESPONSE_TYPE<T> {
	data: T;
	error: boolean;
	message: string;
}

export type CameraStackParams = {
	CameraScreen: {
		clearStates?: boolean;
	};
	ResponseScreen: {
		base64Image: string;
		message: string;
	};
};

export type ProfileStackParams = {
	ProfileScreen: {
		userId?: string;
	};
	SettingsScreen: undefined;
};

export type UserType = {
	id?: number;
	created_at?: string;
	deviceId: string;
	email: string;
	fullName: string;
	isPremium: boolean;
	country: string;
};
export type CategoryType = {
	id?: number;
	created_at?: string;
	name: string;
	userId: number;
};

export type NoteType = {
	id?: number;
	created_at?: string;
	updated_at?: Date;
	userId: number;
	title: string;
	text: string;
	remind_at?: Date;
	isComplete: boolean;
	categoryId: number;
};

export type NotificationContentType = {
	title: string;
	body: string;
	data?: { data: string };
};
