/**
 * @file user Utilities
 * @author Simpa
 * @copyright Project Genius 2025
 */

import supabaseClient from "./supabase";

class User {
  // static async insertUser(values) {
  //   const { data, error } = await supabaseClient.supabase.rpc("insert_user_bypass_rls", values);
  //   if (error) throw error;
  //   return data;
  // }

  static async getContestant(id) {
    // console.log(id);
    const { data, error } = await supabaseClient.supabase
      .from("contestants")
      .select()
      .eq("user_id", id);
    if (error) throw error;
    return data[0];
  }

  static async insertContestant(values) {
    const {data, error} = await supabaseClient
    .supabase
    .from("unverified_signups")
    .insert(values)

    if (error) throw error;
    return data;
  };
   

  static async updateContestant(values, id) {
    const { data, error } = await supabaseClient.supabase
      .from("contestants")
      .update(values)
      .eq("user_id", id)
      .select();

    if (error) throw error;
    return data[0];
  }
}

module.exports = User;
