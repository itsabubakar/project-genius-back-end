/**
 * @file user Utilities
 * @author Simpa
 * @copyright Project Genius 2025
 */

import supabaseClient from './supabase';

class User {
  static async insertUser(values) {
    const { data, error } = await supabaseClient.supabase
      .from("users")
      .insert(values)
      .select();

    if (error) throw error;
    return data;
  }

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
    const { data, error } = await supabaseClient.supabase
      .from("contestants")
      .insert(values)
      .select();

    if (error) throw error;
    return data;
  }


  static async update(values, id) {
    const { data, error } = await supabaseClient.supabase
      .from("contestants")
      .update(values)
      .eq('user_id', id);
    
    if (error) throw error;
    return data;
  }
}

module.exports = User; 
