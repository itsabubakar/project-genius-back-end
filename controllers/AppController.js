/**
 * @file AppContorller
 * @author Simpa<
 * @copyright Project Genius 2025
 */

import Auth from "../utils/auth";
import Stage from "../utils/stage";
import Team from "../utils/team";
import User from "../utils/user";

class AppController {
  static async dashboard(req, res) {
    const id = req.params.id;
    // console.log(id);
    if (!Auth.isValidUUID(id))
      return res.status(401).json({ error: "Invalid login Id" });
    try {
      const contestant = await User.getContestant(id);
      if (!contestant) {
        return res.status(401).json({ error: "Invalid login Id" });
      }
      if (contestant.team_id === null) {
        if (contestant.role === "member")
          return res.status(200).json({ message: "please join a team" });
        return res.json({ message: "please create a team" });
      }
      const members = await Team.getMembers(contestant.team_id);
      const currentStage = await Stage.curStage();
      return res.json({
        currentStage,
        team: members,
        owner: {
          name: contestant.first_name,
          initials: contestant.initials,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(err.status).json({ error: err.message });
    }
  }
}

module.exports = AppController;
