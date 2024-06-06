import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createCategory, createUser, deleteNote, getCurrentUser, saveNote, signUpUser, updateNote } from "./actions";
import { HttpStatusCode } from "axios";
import { InitialState, NoteType } from "../utils/types";

export const initialState: InitialState = {
	error: false,
	success: false,
	message: "",
	currentLanguage: "en",
	isAuthenticated: false,
	loading: false,
	onboardingPassed: false,
	isPremium: false,
	currentUser: undefined,
	remainingHourForNewScan: 0,
	savedNotes: [],
	categories: [],
};

export const reducer = createSlice({
	name: "global",
	initialState,
	reducers: {
		setonboardingPassed: (state, action) => {
			state.onboardingPassed = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// *********** createUser START *********** \\
			.addCase(createUser.pending, (state) => {
				state.loading = true;
				state.success = false;
				state.error = false;
				state.message = "";
			})
			.addCase(createUser.fulfilled, (state, action) => {
				if (action.payload.status === HttpStatusCode.Ok) {
					// state.currentUser = action.payload.data
				}
				state.loading = false;
				// *********** createUser END *********** \\
			}) // *********** getCurrentUser START *********** \\
			.addCase(getCurrentUser.pending, (state) => {
				state.loading = true;
				state.success = false;
				state.error = false;
				state.message = "";
			})
			.addCase(getCurrentUser.fulfilled, (state, action) => {
				if (action.payload.status === HttpStatusCode.Ok) {
					state.currentUser = action.payload.data?.user;
					state.savedNotes = action.payload.data?.savedNotes || [];
					state.categories = action.payload.data?.categories || [];
				}
				state.loading = false;
				// *********** getCurrentUser END *********** \\
			}) // *********** saveNote START *********** \\
			.addCase(saveNote.pending, (state) => {
				state.loading = true;
				state.success = false;
				state.error = false;
				state.message = "";
			})
			.addCase(saveNote.fulfilled, (state, action) => {
				if (action.payload.status === HttpStatusCode.Ok) {
					state.savedNotes = action.payload.data;
					state.success = true;
				}
				state.message = action.payload.message;
				state.loading = false;
				// *********** saveNote END *********** \\
			})
			// *********** createCategory START *********** \\
			.addCase(createCategory.pending, (state) => {
				state.loading = true;
				state.success = false;
				state.error = false;
				state.message = "";
			})
			.addCase(createCategory.fulfilled, (state, action) => {
				if (action.payload.status === HttpStatusCode.Ok) {
					state.categories = action.payload.data;
					// state.success = true;
				} else {
					// state.error = true;
				}
				// state.message = action.payload.message;
				state.loading = false;
				// *********** createCategory END *********** \\
			})
			// *********** updateNote START *********** \\
			.addCase(updateNote.pending, (state) => {
				state.loading = true;
				state.success = false;
				state.error = false;
				state.message = "";
			})
			.addCase(updateNote.fulfilled, (state, action) => {
				if (action.payload.status === HttpStatusCode.Ok) {
					state.savedNotes = action.payload.data;
					state.success = true;
				} else {
					state.error = true;
				}

				state.message = action.payload.message;
				state.loading = false;
				// *********** updateNote END *********** \\
			})
			// *********** deleteNote START *********** \\
			.addCase(deleteNote.pending, (state) => {
				state.loading = true;
				state.success = false;
				state.error = false;
				state.message = "";
			})
			.addCase(deleteNote.fulfilled, (state, action) => {
				if (action.payload.status === HttpStatusCode.Ok) {
					state.savedNotes = action.payload.data;
					state.success = true;
				} else {
					state.error = true;
				}

				state.message = action.payload.message;
				state.loading = false;
				// *********** deleteNote END *********** \\
			})
			// *********** signUpUser START *********** \\
			.addCase(signUpUser.pending, (state) => {
				state.loading = true;
				state.success = false;
				state.error = false;
				state.message = "";
			})
			.addCase(signUpUser.fulfilled, (state, action) => {
				if (action.payload.status === HttpStatusCode.Ok) {
					state.currentUser = action.payload.data;
					state.success = true;
				} else {
					state.error = true;
				}
				state.message = action.payload.message;
				state.loading = false;
				// *********** signUpUser END *********** \\
			});
	},
});

export const { setonboardingPassed } = reducer.actions;

export default reducer.reducer;
