/**
 * @file Brief description of the file here
 * @author Simpa
 * @copyright Project Genius 2025
 */

import Faculty from "../utils/faculty";

class FacultiesController {
  static async getAll(req, res) {
    try {
      const faculties = await Faculty.getFaculties();
      return res.status(200).json(faculties);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getDeptsByFac(req, res) {
    const facultyId = req.params.id;
    if (!facultyId)
      return res.status(400).json({ error: "Missing faculty id" });

    try {
      const departments = await Faculty.getDepartments(facultyId);
      return res.status(200).json(departments);
    } catch (err) {
      return res.status(err.status).json({ error: err.message });
    }
  }
}

module.exports = FacultiesController;
