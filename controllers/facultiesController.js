/**
 * @file Brief description of the file here
 * @author Simpa
 * @copyright Project Genius 2025
 */

import supabaseClient from "../utils/supabase";

class FalcultiesController {
  static async getAll(req, res) {
    try {
      const faculties = await supabaseClient.getFaculties();
      return res.status(200).json(faculties);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getDeptsByFac(req, res) {
    const faculty_id = req.params.id;
    if (!faculty_id)
      return res.status(400).json({ error: "Missing faculty_id" });

    try {
      const departments = await supabaseClient.getDepartments(faculty_id);
      return res.status(200).json(departments);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = FalcultiesController;
