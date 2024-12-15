/**
 * @file supabase
 * @author Simpa
 * @copyright Project Genius 2025
 */

import { createClient } from "@supabase/supabase-js";
require("dotenv").config(); // Ensure dotenv is loaded

// Create a single supabase client for interacting with your database

class SupabaseClient {
  /**
   * create a superbase client for querying the database;
   * @extends ParentClassNameHereIfAny
   */

  constructor() {
    this.supabaseURL = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_KEY;
    // console.log(this.supabaseURL, this.supabaseKey);
    this.supabase = createClient(this.supabaseURL, this.supabaseKey);
  }

  async signUp(credential) {
    const { data, error } = await this.supabase.auth.signUp({
      email: credential.email,
      password: credential.password,
    });
    if (error) throw error;
    return data;
  }

  async signIn(credential) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credential.email,
      password: credential.password,
    });

    if (error) throw error;
    return data.user.id;
  }

  async insertUser(values) {
    const { data, error } = await this.supabase
      .from("users")
      .insert(values)
      .select();

    if (error) throw error;
    return data;
  }

  async insertContestant(values) {
    const { data, error } = await this.supabase
      .from("contestants")
      .insert(values)
      .select();

    if (error) throw error;
    return data;
  }

  async getFaculties() {
    const { data, error } = await this.supabase
      .from("faculties")
      .select("id, name");
    if (error) throw error;
    return data;
  }

  async getDepartments(faculty_id) {
    const { data, error } = await this.supabase
      .from("departments")
      .select("id, name")
      .eq("faculty_id", faculty_id);
    if (error) throw error;
    return data;
  }

  async getTeams() {
    const { data, error } = await this.supabase
      .from("teams")
      .select("id, team_name");
    if (error) throw error;
    return data;
  }
}

const supabaseClient = new SupabaseClient();

module.exports = supabaseClient;
