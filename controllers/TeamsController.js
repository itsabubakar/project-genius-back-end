/**
 * @file teamsController
 * @author Simpa <optionalEmail@example.com>
 * @copyright Project Genius 2025
 */

import supabaseClient from "../utils/supabase";
import Auth from "../utils/auth";
import App from "../utils/app"
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

      // console.log(user.id);

      const contestant = await User.getContestant(user.id)
      if (contestant.role !== "lead")
        return res.status(401).json({ error: "Only leaders can create teams"})
      const team = await Team.createTeam({
        team_name: teamName,
        lead_id: user.id
      })

      console.log(team);
      await User.update({team_id: team.team_id}, user.id);

      res.status(201).json({ message: "successful", inviteCode: team.team_id})
    } catch(err) {
      if (err.code === "23505") {
        const duplicateField = App.duplicateField(err.message);
        if (duplicateField == "teams_lead_id_key")
          return res.status(409).json({ error: "Cannot have multiple teams"})
        return res.status(409).json({ error: "team already exists"})
      }
      if (!err.status)
        return res.status(500).json({ error: err.message, code: err.code });

      return res.status(err.status).json({ error: err.message})
    }
  }

  static async join(req, res) {
    const { inviteCode } = req.body;
    if (!inviteCode)
      return res.status(400).json({ error: "Missing inviteCode" })
    try {
      const user = await supabaseClient.getUser();
      if (!user) 
        return res.status(401).json({ error: "Unauthorized" });
      if (!Auth.isValidUUID(inviteCode))
        return res.status(400).json({ error: "Invalid inviteCode"})
      const team  = Team.getTeam(inviteCode);
      if (!team)
        return res.status(400).json({ error: "Not a valid team code"})
      await User.update({ team_id: inviteCode}, user.id);
      return res.status(200).json({ message: "successful" });
    } catch(err) {
      if (!err.status)
        return res.status(500).json({ error: err.message });
      return res.status(err.status).json({ error: err.message });
    }
  }
}

module.exports = TeamsController;
