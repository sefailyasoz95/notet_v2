import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	CreateCategoryService,
	CreateUserService,
	DeleteNoteService,
	GetCurrentUserService,
	SaveNoteService,
	UpdateUserInfoService,
	UpdateNoteService,
	// UpdateUserInfoService,
} from "./services";
import { CategoryType, NoteType, UserType } from "../utils/types";

export const createUser = createAsyncThunk("auth/createUser", async (data: UserType, thunkAPI) => {
	try {
		const response = await CreateUserService(data);
		return {
			data: response.data,
			status: response.status,
			message: response.message,
		};
	} catch (error: any) {
		const message =
			(error.response && error.response.data && error.response.data.message) || error.message || error.toString();
		return {
			data: undefined,
			status: 400,
			message,
		};
	}
});
export const createCategory = createAsyncThunk("app/createCategory", async (data: CategoryType, thunkAPI) => {
	try {
		const response = await CreateCategoryService(data);
		return {
			data: response.data,
			status: response.status,
			message: response.message,
		};
	} catch (error: any) {
		const message =
			(error.response && error.response.data && error.response.data.message) || error.message || error.toString();
		return {
			data: [],
			status: 400,
			message,
		};
	}
});
export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async (data: string, thunkAPI) => {
	try {
		return await GetCurrentUserService(data);
	} catch (error: any) {
		const message =
			(error.response && error.response.data && error.response.data.message) || error.message || error.toString();
		return {
			data: undefined,
			status: 400,
			message,
		};
	}
});

export const saveNote = createAsyncThunk("notes/saveNote", async (data: NoteType, thunkAPI) => {
	try {
		return await SaveNoteService(data);
	} catch (error: any) {
		const message =
			(error.response && error.response.data && error.response.data.message) || error.message || error.toString();
		return {
			data: [],
			status: 400,
			message,
		};
	}
});
export const updateNote = createAsyncThunk("notes/updateNote", async (data: NoteType, thunkAPI) => {
	try {
		return await UpdateNoteService(data);
	} catch (error: any) {
		const message =
			(error.response && error.response.data && error.response.data.message) || error.message || error.toString();
		return {
			data: [],
			status: 400,
			message,
		};
	}
});
export const deleteNote = createAsyncThunk(
	"notes/deleteNote",
	async (data: { id: number; userId: number }, thunkAPI) => {
		try {
			return await DeleteNoteService(data);
		} catch (error: any) {
			const message =
				(error.response && error.response.data && error.response.data.message) || error.message || error.toString();
			return {
				data: [],
				status: 400,
				message,
			};
		}
	}
);

export const updateUserInfo = createAsyncThunk("auth/updateUserInfo", async (body: Partial<UserType>, thunkAPI) => {
	try {
		return await UpdateUserInfoService(body);
	} catch (error: any) {
		const message =
			(error.response && error.response.data && error.response.data.message) || error.message || error.toString();
		return {
			data: undefined,
			status: 400,
			message,
		};
	}
});
