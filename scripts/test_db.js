import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rixlvvvyeqzasoavwdng.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_YbKnIPrg5mQfAVNLPHi82w_FwASss-k";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function test() {
  console.log("Testing fetch from products table...");
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Count:", data?.length);
    console.log("First product:", data?.[0]);
    console.log("Categories in db:", [...new Set(data?.map(p => p.category))]);
    console.log("Active values:", [...new Set(data?.map(p => p.active))]);
  }
}

test();
