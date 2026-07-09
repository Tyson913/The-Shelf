import { supabase } from './db.js'
async function logIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
}