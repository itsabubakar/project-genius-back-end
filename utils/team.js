/**
 * @file teams utils
 * @author Simpa
 * @copyright Project Genius 2025
 */

import supabaseClient from './supabase';

class Team {
  
  static async getMembers(team_id) {
    const { data, error } = await supabaseClient.supabase
      .from("contestants")
      .select("user_id, first_name, role, initials")
      .eq("team_id", team_id);
    if (error) throw error;
    return data;
  }

  static async getTeams() {
    const { data, error } = await supabaseClient.supabase
      .from("teams")
      .select("id, team_name");
    if (error) throw error;
    return data;
  }

  static async createTeam(details) {
    const { data, error } = await supabaseClient.supabase
      .from("teams")
      .insert(details)
      .select();
    if (error) throw error;
    return data;
  }


}

module.exports = Team;
