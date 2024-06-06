import { HttpStatusCode } from "axios";
import { supabase } from "../utils/supabase";
import { CategoryType, NoteType, UserType } from "../utils/types";
import { decode } from "base64-arraybuffer";

export const uploadImageToSupabase = async (
	base64Image: string,
	imageExtension: string,
	bucketName: string,
	fileName: string
): Promise<string | null> => {
	try {
		const res = decode(base64Image);

		if (!(res.byteLength > 0)) {
			return null;
		}

		const { data, error } = await supabase.storage.from(bucketName).upload(`${fileName}.${imageExtension}`, res, {
			contentType: `image/${imageExtension}`,
			upsert: true,
		});

		if (!data) {
			return null;
		}

		if (error) {
			return null;
		}

		const {
			data: { publicUrl },
		} = supabase.storage.from(bucketName).getPublicUrl(data.path.replace(`${bucketName}/`, ""));

		if (!publicUrl) {
			console.error("[uploadToSupabase] publicURL is null");
			return null;
		}

		return publicUrl;
	} catch (err) {
		return null;
	}
};

export const CreateUserService = async (body: UserType) => {
	try {
		let { data, error } = await supabase.from("users").insert(body);

		if (!error) {
			return {
				data,
				status: HttpStatusCode.Ok,
				message: "",
			};
		} else {
			return {
				data: undefined,
				status: HttpStatusCode.BadRequest,
				message: error.message,
			};
		}
	} catch (error) {
		return {
			data: undefined,
			status: HttpStatusCode.BadRequest,
			message: "User Creation Failed!",
		};
	}
};
export const CreateCategoryService = async (body: CategoryType) => {
	try {
		let { data, error } = await supabase.from("category").insert(body);
		let categories = await supabase
			.from("category")
			.select("*")
			.filter("userId", "eq", body.userId)
			.order("created_at", { ascending: false });

		if (!error) {
			return {
				data: categories.data || [],
				status: HttpStatusCode.Ok,
				message: "categoryCreated",
			};
		} else {
			return {
				data: [],
				status: HttpStatusCode.BadRequest,
				message: error.message,
			};
		}
	} catch (error) {
		return {
			data: [],
			status: HttpStatusCode.BadRequest,
			message: "User Creation Failed!",
		};
	}
};
export const GetCurrentUserService = async (deviceId: string) => {
	try {
		let currentUser = await supabase.from("users").select("*").filter("deviceId", "eq", deviceId).single();
		let savedNotes = await supabase
			.from("notes")
			.select("*")
			.filter("userId", "eq", currentUser.data.id)
			.order("created_at", { ascending: false });
		let categories = await supabase
			.from("category")
			.select("*")
			.filter("userId", "eq", currentUser.data.id)
			.order("created_at", { ascending: false });

		return {
			data: {
				user: currentUser.data,
				savedNotes: savedNotes.data,
				categories: categories.data,
			},
			status: HttpStatusCode.Ok,
			message: "success",
		};
	} catch (error) {
		return {
			data: undefined,
			status: HttpStatusCode.BadRequest,
			message: "Get Current User Failed!",
		};
	}
};

export const SaveNoteService = async (body: NoteType) => {
	try {
		let { data, error } = await supabase.from("notes").insert(body);
		let savedNotes = await supabase
			.from("notes")
			.select("*")
			.filter("userId", "eq", body.userId)
			.order("created_at", { ascending: false });
		if (!error) {
			return {
				data: savedNotes.data || [],
				status: HttpStatusCode.Ok,
				message: "noteSaved",
			};
		} else {
			return {
				data: [],
				status: HttpStatusCode.BadRequest,
				message: error.message,
			};
		}
	} catch (error) {
		return {
			data: [],
			status: HttpStatusCode.BadRequest,
			message: "User Creation Failed!",
		};
	}
};
export const UpdateNoteService = async (body: NoteType) => {
	try {
		let { data, error } = await supabase.from("notes").update(body).eq("id", body.id);
		let savedNotes = await supabase
			.from("notes")
			.select("*")
			.filter("userId", "eq", body.userId)
			.order("created_at", { ascending: false });

		if (!error) {
			return {
				data: savedNotes.data || [],
				status: HttpStatusCode.Ok,
				message: "noteUpdated",
			};
		} else {
			return {
				data: [],
				status: HttpStatusCode.BadRequest,
				message: error.message,
			};
		}
	} catch (error) {
		return {
			data: [],
			status: HttpStatusCode.BadRequest,
			message: "User Creation Failed!",
		};
	}
};

export const DeleteNoteService = async (_data: { id: number; userId: number }) => {
	try {
		let { data, error } = await supabase.from("notes").delete().eq("id", _data.id);
		let savedNotes = await supabase
			.from("notes")
			.select("*")
			.filter("userId", "eq", _data.userId)
			.order("created_at", { ascending: false });

		if (!error) {
			return {
				data: savedNotes.data || [],
				status: HttpStatusCode.Ok,
				message: "noteDeleted",
			};
		} else {
			return {
				data: [],
				status: HttpStatusCode.BadRequest,
				message: error.message,
			};
		}
	} catch (error) {
		return {
			data: [],
			status: HttpStatusCode.BadRequest,
			message: "Delete Note Failed!",
		};
	}
};

export const SignUpUserService = async (body: { email: string; fullName: string; userId: number }) => {
	try {
		let { data, error } = await supabase
			.from("users")
			.update({ fullName: body.fullName, email: body.email })
			.eq("id", body.userId);

		if (!error) {
			let currentUser = await supabase.from("users").select("*").filter("id", "eq", body.userId).single();
			return {
				data: currentUser.data,
				status: HttpStatusCode.Ok,
				message: "signUpThanks",
			};
		} else {
			return {
				data: null,
				status: HttpStatusCode.BadRequest,
				message: "failedToSignUp",
			};
		}
	} catch (error) {
		return {
			data: null,
			status: HttpStatusCode.BadRequest,
			message: "somethingWentWrongRelaunch",
		};
	}
};
