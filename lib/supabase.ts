import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://wulmzxloymmfpirwwatb.supabase.co";

const supabaseAnonKey =
  "sb_publishable_D5mW0i2TxKDlU14KVHlKOw_u3IK79bX";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);