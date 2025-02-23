/**
 * @file supabase
 * @author Simpa
 * @copyright Project Genius 2025
 */

import { createClient } from "@supabase/supabase-js";
require("dotenv").config();

// Create a single supabase client for interacting with your database

class SupabaseClient {
  /**
   * create a superbase client for querying the database;
   * @extends ParentClassNameHereIfAny
   */

  constructor() {
    this.supabaseURL = process.env.SUPABASE_DEV_URL;
    this.supabaseKey = process.env.SUPABASE_DEV_KEY;
    // console.log(this.supabaseURL, this.supabaseKey);
    this.supabase = createClient(this.supabaseURL, this.supabaseKey);
  }

  

  async validToken(user_token) {
    const session = await this.supabase.auth.getSession();
    console.log(session);
    const { data: user, error } = await this.supabase.auth.getUser(user_token);
    if (error) throw error;
    return user.id;
  }

  async getUser() {
    const {error, data} = await this.supabase.auth.getUser();

    if (error) return null;
    return data.user;
  }
}

const supabaseClient = new SupabaseClient();

module.exports = supabaseClient;
