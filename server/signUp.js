import { supabase } from './db.js'
async function signUp(username, email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        console.log(error);
        return;
    }

    const { insertError } = await supabase.from("Users").insert({
        id: data.user.id,
        username: username,
        email: email,
    })

    if (insertError) {
        console.log(insertError);
        return;
    }
}