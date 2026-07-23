import { createClient } from '@supabase/supabase-js'
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; 

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function signUp(username, email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.log(error);
        return;
    }

    const userId = data.user.id;

    const { error: insertError } = await supabase.from("Users").insert({
        id: userId,
        username: username,
        email: email,
    });

    if (insertError) {
        console.log(insertError);
        return;
    }

    return userId;
}

async function logIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.log(error);
        return;
    }

    return data.user.id;
}

async function saveConvo(request, response, userId) {
    const { data, error } = await supabase
        .from('Conversations')
        .insert({
            request: request,
            ai_response: response,
            user_id: userId,
        })
        .select()
        .single();

    if (error) {
        console.log(error);
        return;
    }

    return data; 
}

export { signUp, logIn, saveConvo };