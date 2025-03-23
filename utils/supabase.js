/**
 * @file supabase
 * @author Simpa
 * @copyright Project Genius 2025
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
const envFile = `.env.${process.env.NODE_ENV || "production"}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

class SupabaseClient {
  constructor() {
    this.supabaseURL = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_KEY;

    if (!this.supabaseURL || !this.supabaseKey) {
      throw new Error("Missing Supabase credentials: SUPABASE_URL and SUPABASE_KEY");
    }

    this.supabase = createClient(this.supabaseURL, this.supabaseKey);
  }

  /**
   * Validate the given user token and return the user ID if valid.
   * @param {string} user_token - The user's authentication token.
   * @returns {Promise<string|null>} User ID if valid, otherwise null.
   */
  async validToken(user_token) {
    const { data, error } = await this.supabase.auth.getUser();

    if (error || !data?.user) {
      console.error("Invalid token or authentication error:", error);
      return null;
    }

    return data.user.id;
  }

  /**
   * Get the currently authenticated user.
   * @returns {Promise<object|null>} User data or null if not authenticated.
   */
  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();

    if (error || !data?.user) {
      return null;
    }

    return data.user;
  }
}

export default new SupabaseClient();
