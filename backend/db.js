import { createClient } from '@supabase/supabase-js'
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; 

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function signUp(username, email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.log(error);
        throw error;
    }

    const userId = data.user.id;

    const { error: insertError } = await supabase.from("Users").insert({
        id: userId,
        username: username,
        email: email,
    });

    if (insertError) {
        console.log(insertError);
        throw insertError;
    }

    return {
        userId,
        accessToken: data.session?.access_token ?? null,
        refreshToken: data.session?.refresh_token ?? null,
    };
}

async function logIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.log(error);
        throw error;
    }

    return {
        userId: data.user.id,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
    };
}

async function getUserIdFromToken(accessToken) {
    if (!accessToken) return null;

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error) {
        console.log(error);
        return null;
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

async function getConversations(userId) {
    const { data, error } = await supabase
        .from('Conversations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.log(error);
        throw error;
    }

    return data;
}

export { signUp, logIn, saveConvo, getUserIdFromToken, getConversations };