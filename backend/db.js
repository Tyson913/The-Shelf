import { createClient } from '@supabase/supabase-js'
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
});

async function signUp(email, password) {
    const { data, error } = await supabaseAuth.auth.signUp({ email, password });

    if (error) {
        console.log(error);
        throw error;
    }

    const userId = data.user.id;

    // Auto-confirm so signup works without the user clicking a confirmation email.
    // Dev/testing convenience — bypassing email verification means anyone can sign up
    // with an email they don't own, so gate or remove this before you ship to real users.
    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        email_confirm: true,
    });

    if (confirmError) {
        console.log(confirmError);
        throw confirmError;
    }

    const { error: insertError } = await supabaseAdmin.from("Users").insert({
        id: userId,
        email: email,
    });

    if (insertError) {
        console.log(insertError);
        throw insertError;
    }

    // signUp() doesn't return a session while confirmation was pending, so sign in
    // now that the user is confirmed to get real tokens back.
    const { data: signInData, error: signInError } = await supabaseAuth.auth.signInWithPassword({
        email,
        password,
    });

    if (signInError) {
        console.log(signInError);
        throw signInError;
    }

    return {
        userId,
        accessToken: signInData.session?.access_token ?? null,
        refreshToken: signInData.session?.refresh_token ?? null,
    };
}

async function logIn(email, password) {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });

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

    // A real JWT always has 3 dot-separated segments (header.payload.signature).
    // If it doesn't, don't bother calling Supabase — just treat it as unauthenticated.
    // This is what stops a stray "undefined"/"null" string, an unstripped "Bearer "
    // prefix, or a truncated header from throwing an unhandled AuthApiError.
    if (typeof accessToken !== 'string' || accessToken.split('.').length !== 3) {
        console.log('getUserIdFromToken: received a malformed token, treating as guest');
        return null;
    }

    try {
        const { data, error } = await supabaseAuth.auth.getUser(accessToken);

        if (error) {
            console.log(error);
            return null;
        }

        return data.user.id;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function saveConvo(request, response, userId) {
    const { data, error } = await supabaseAdmin
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
    const { data, error } = await supabaseAdmin
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