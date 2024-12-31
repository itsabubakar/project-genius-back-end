import User from "../utils/user";
import Team from "../utils/team"
import Stage from "../utils/stage";

class AppController {
  static async dashboard(req, res) {
    const id = req.params.id;
    // console.log(id);
    try {
      const contestant = await User.getContestant(id);
      if (!contestant) {
        return res.status(400).json({ error: "Invalid Id"});
      }
      if (contestant.team_id === null) {
        if (contestant.role === "member")
          return res.status(200).json({ "message": "please join a team" });
        return res.json({ "message": "please create a team" });
      }
      const members = await Team.getMembers(contestant.team_id);
      const currentStage = await Stage.curStage();
      console.log(members);
      console.log(currentStage);
      return res.json({ currentStage, members });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: err.message });
    }
  }
}

module.exports = AppController;
