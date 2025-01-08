/**
 * @file teamsController
 * @author Simpa <optionalEmail@example.com>
 * @copyright Project Genius 2025
 */

import supabaseClient from "../utils/supabase";

class TeamsController {
  /**
   *  implement all /teams endpoints
   */

  static async getAll(req, res) {
    try {
      const teams = await supabaseClient.getTeams();
      return res.status(200).json(teams);
    } catch (err) {
      if (!err.status)
        return res.status(500).json({error: err.message});
      return res.status(err.status).json({ error: err.message });
    }
  }
}

module.exports = TeamsController;
