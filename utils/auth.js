/**
 * @file auth
 * @author Simpa
 * @copyright Project Genius 2025
 */

import supabaseClient from './supabase';

class Auth {
  static async signUp(credential) {
    const { data, error } = await supabaseClient.supabase.auth.signUp({
      email: credential.email,
      password: credential.password,
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
      email
    );
    if (error) throw error;
    return data;
  }

  static async updatePassword(password, token) {
    // console.log('Inside updatePassword')
    // const { error: sessionError } = await supabaseClient
    // .supabase.auth.setSession({
    //   access_token: token,
    //   refresh_token: token,
    // });
    // console.log(sessionError);
    // if (sessionError) {
    //   console.log(sessionError);
    //   throw sessionError;
    // } 
    // console.log("NOT sessionError");
    const { data, error } = await supabaseClient
    .supabase.auth.api.updateUser( token, { password, });
    if (error) {
      console.log(error);
      throw error;
    }
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
