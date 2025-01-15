/**
 * @file teamsController
 * @author Simpa <optionalEmail@example.com>
 * @copyright Project Genius 2025
 */

import supabaseClient from "../utils/supabase";
import Team from "../utils/team";
import User from "../utils/user";


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

  static async create(req, res) {
    const { teamName } = req.body;
    if (!teamName) return res.status(400).json({ error: "Missing teamName"});
    try {
      const user = await supabaseClient.getUser();
      if (!user) return res.status(401).json({ error: "Unauthorized"});

      console.log(user.id);
      const team = await Team.createTeam({
        team_name: teamName,
        lead_id: user.id
      })

      console.log(team);

      await User.update({team_id: team.team_id}, user.id);
    } catch(err) {
      if (!err.status)
        return res.status(500).json({ error: err.message });
      return res.status(err.status).json({ error: err.message })
    }
  }
}

module.exports = TeamsController;
