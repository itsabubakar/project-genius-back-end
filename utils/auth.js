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
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
  
  static async signUp(credential) {
    const { data, error } = await supabaseClient.supabase.auth.signUp({
      email: credential.email,
      password: credential.password,
    }, {
      redirectTo: "https://project-genius-frontend.vercel.app/auth/verified"
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
        redirectTo: "https://project-genius-frontend.vercel.app/auth/reset-password"
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
}

module.exports = Auth;
