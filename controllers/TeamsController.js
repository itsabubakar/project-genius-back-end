/**
 * @file teamsController
 * @author Simpa <optionalEmail@example.com>
 * @copyright Project Genius 2025
 */

import supabaseClient from "../utils/supabase";
import Solution from "../utils/solution";
import App from "../utils/app"
import Team from "../utils/team";
import User from "../utils/user";


class TeamsController {
  /**
   *  implement all /teams endpoints
   */

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
      await User.updateContestant({team_id: team.team_id}, user.id);

      res.status(201).json({ message: "successful", inviteCode: team.invite_code})
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

  static async join(req, res) {
    const { inviteCode } = req.body;
    if (!inviteCode)
      return res.status(400).json({ error: "Missing inviteCode" })
    try {
      const user = await supabaseClient.getUser();
      if (!user) 
        return res.status(401).json({ error: "Unauthorized" });
      const team  = await Team.getTeamByinvite(inviteCode);
      console.log(team);
      if (!team)
        return res.status(400).json({ error: "Not a valid team code"})
      await User.updateContestant({ team_id: team.team_id}, user.id);
      return res.status(200).json({ message: "successful" });
    } catch(err) {
      if (!err.status)
        return res.status(500).json({ error: err.message });
      return res.status(err.status).json({ error: err.message });
    }
  }

  static async makeSubmission(req, res) {
    const { title, problem, category, solution } = req.body
    if (!title)
      return res.status(400).json({ error: "Missing title" })
    if (!problem)
      return res.status(400).json({ error: "Missing problem field" })
    if (!category)
      return res.status(400).json({ error: "Missing category" })
    if (!solution)
      return res.status(400).json({ error: "Missing solution" })
    try {
      const user = await supabaseClient.getUser();
      if (!user)
        return res.status(401).json({ error: "Unauthorized" });
      const contestant = await User.getContestant(user.id)
      if (contestant.role !== "lead")
        return res.status(401).json({ error: "Unauthorized" });
      await Solution.create({
        team_id: contestant.team_id,
        title,
        problem,
        category,
        solution,
      })
      return res.status(201).send()
    } catch(err) {
      console.log(err);
      if (!err.status)
        return res.status(500).json({error: err.message});
      return res.status(err.status).json({ error: err.message });
    }
  }
}

module.exports = TeamsController;
