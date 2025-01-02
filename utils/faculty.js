/**
 * @file faculty
 * @author Simpa
 * @copyright Project Genius 2025
 */

import supabaseClient from './supabase';

class Faculty {
  static async getFaculties() {
    const { data, error } = await supabaseClient.supabase
      .from("faculties")
      .select("id, name");
    if (error) throw error;
    return data;
  }

  static async getDepartments(faculty_id) {
    const { data, error } = await supabaseClient.supabase
      .from("departments")
      .select("id, name")
      .eq("faculty_id", faculty_id);
    if (error) throw error;
    return data;
  }
}

module.exports = Faculty;
