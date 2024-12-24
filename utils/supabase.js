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

  async signOut() {
    const {error} = await this.supabase.auth.signOut();
    if (!error) throw error;
    return ;
  }

  async sendReset(email) {
    const {error} = await this.supabase.auth.resetPasswordForEmail(email);
    if (!error) throw error;
  }

  async updatePassword(password) {
    const {error} = await this.supabase.auth.updateUser({password});
    if (!error) throw error;
  }

  async signIn(credential) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credential.email,
      password: credential.password,
    });

    if (error) throw error;
    // console.log(data.session);
    return data.session;
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

  async getContestant(id) {
  const { data, error } = await this.supabase
  .from("contestants")
  .select()
  .eq("user_id", id); 
    console.log("get contestant")
    if (error) throw error;

    console.log(data);
    return data[0];
  }

  async createTeam(details) {
    const { data, error } = await this.supabase
      .from("teams")
      .insert(details)
      .select();
    if (error) throw error;
    return data;
  }

  async getMembers(team_id) {
    const { data, error } = await this.supabase
      .from("contestants")
      .select("user_id, name")
      .eq("team_id", team_id);
    if (error) throw error;
    return data;
  }

  async validToken(user_token) {
    const session = await supabase.auth.getSession();
    console.log(session);
    const { data: user, error } = await this.supabase.auth.getUser(user_token);
    if (error) throw error;
    return user.id;
  }
}

const supabaseClient = new SupabaseClient();

module.exports = supabaseClient;
