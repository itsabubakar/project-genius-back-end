/**
 * @file auth
 * @author Simpa
 * @copyright Project Genius 2025
 */

import supabaseClient from './supabase';

class Auth {

  static isValidJWT(token) {
    const parts = token.split(".");
    return parts.length === 3;
  }

  static isValidUUID(id) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    console.log(uuidRegex.test(id))
    return uuidRegex.test(id);
  }  

  static async signUp(credential) {
    const { data, error } = await supabaseClient.supabase.auth.signUp({
      email: credential.email,
      password: credential.password,
      options: {
          emailRedirectTo: "https://www.projectgenius.com.ng/auth/verified"
      }
    });
    if (error) throw error;
    return data;
  }

  static async signOut() {
    const { error } = await supabaseClient.supabase.auth.signOut();
    if (error) throw error;
    return;
  }

  static async sendReset(email) {
    const { data, error } = await supabaseClient
    .supabase.auth.resetPasswordForEmail(
      email, {
        redirectTo: "https://www.projectgenius.com.ng/auth/reset-password"
      }
    );
    if (error) throw error;
    return data;
  }

  static async updatePassword(password, token) {
    const { error: sessionError } = await supabaseClient
    .supabase.auth.setSession({
      access_token: token,
      refresh_token: token,
    });
    if (sessionError) 
      throw sessionError;

    const { data, error } = await supabaseClient
    .supabase.auth.updateUser({ password });
    if (error) 
      throw error;
    return data;
  }

  static async signIn(credential) {
    const { data, error } = await supabaseClient
    .supabase.auth.signInWithPassword({
      email: credential.email,
      password: credential.password,
    });

    if (error) throw error;
    // console.log(data.session);
    return data.session;
  }

  static async sendConfirmation(email, password) {
     const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error && error.message.includes("Email not confirmed")) {
        console.log("Resending confirmation email...");
        await supabase.auth.resend({
            type: "signup",
            email,
        });
        return true
    }
    throw error
  }
}

module.exports = Auth;
