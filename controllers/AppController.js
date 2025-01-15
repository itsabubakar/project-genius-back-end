/**
 * @file AppContorller
 * @author Simpa<
 * @copyright Project Genius 2025
 */

import supabaseClient from '../utils/supabase';
import App from "../utils/app";
import Stage from "../utils/stage";
import Team from "../utils/team";
import User from "../utils/user";

class AppController {
  static async dashboard(req, res) {
    try {
      const user = await supabaseClient.getUser();
      if (!user)
        return res.status(401).json({ error: "Unauthorized"})
      const contestant = await User.getContestant(user.id);
      if (!contestant) {
        return res.status(401).json({ error: "Invalid login Id" });
      }
      if (contestant.team_id === null) {
        if (contestant.role === "member")
          return res.status(200).json({ message: "please join a team" });
        return res.json({ message: "please create a team" });
      }
      const team = await Team.getTeam(contestant.team_id);
      const members = await Team.getMembers(contestant.team_id);
      const currentStage = await Stage.curStage();
      return res.json({
        currentStage,
        team: team.team_name,
        members,
      });
    } catch (err) {
      // console.log(err);
      if (!err.status)
        return res.status(500).json({error: err.message});
      return res.status(err.status).json({ error: err.message });
    }
  }

  static async contactUs(req, res) {
    const {name, email, message} = req.body;
    if (!name) return res.status(401).json({ error: "Missing name"})
    if (!email) return res.status(401).json({ error: "Missing email"})
    if (!message) return res.status(401).json({error: "Missing message"})
    
    try {
      await App.sendMessage({
        name,
        email,
        message,
      })
      return res.status(200).json({ "message": "message has been sent"});
    } catch(err) {
      console.log(err);
      if (!(err.status)) return res.status(500).json(err.message)
      return res.status(err.status).json(err.message)
    }
  }
}




module.exports = AppController;
