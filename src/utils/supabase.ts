import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { supabaseAPIkey, supabaseURL } from "./constants";

const supabaseUrl = supabaseURL;
const supabaseAnonKey = supabaseAPIkey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: AsyncStorage,
		// autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
