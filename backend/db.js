import { createClient } from '@supabase/supabase-js'
import 'dotenv/config';

const supabase_url = process.env.SUPABASE_URL;
const anon_key = process.env.SUPABASE_ANNON_KEY;

const supabase = createClient(supabase_url, anon_key);
export default supabase;
