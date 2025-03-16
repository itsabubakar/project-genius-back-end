/**
 * @file teams utils
 * @author Simpa
 * @copyright Project Genius 2025
 */

import supabaseClient from './supabase';
import Auth from './auth';

class Team {
  
  static async getMembers(teamId) {
    const { data, error } = await supabaseClient.supabase
      .from("contestants")
      .select("first_name, role, initials")
      .eq("team_id", teamId);
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
      .select("invite_code, team_name, team_id");
    if (error) throw error;
    return data[0];
  }

  static async getTeam(teamId) {
    if (!teamId)
      return null
    const {data, error} = await supabaseClient.supabase
      .from("teams")
      .select("team_name, invite_code")
      .eq("team_id", teamId)

    if (error) throw error;
    if (!data)
      return null;
    return data[0];
  }

  static async getTeamByinvite(inviteCode) {
    if (!inviteCode)
      return null
    console.log(inviteCode)
    const {data, error} = await supabaseClient.supabase
      .from("teams")
      .select("team_id")
      .eq("invite_code", inviteCode)
    if (error) throw error;
    if (!data)
      return null;
    console.log(data[0]);
    return data[0];
  }


}

module.exports = Team;
