import supabaseClient from "../utils/supabase";

class AppController {

    static async dashboard(req, res) {
        const id = req.params.id
        // console.log(id);
        try {
          const contestant = await supabaseClient.getContestant(id);
          // console.log(contestant);
          const members = await supabaseClient.getMembers(contestant.team_id);
          return res.json(members);
        } catch (err) {
          console.log(err);
          return res.status(401).json({ error: "Invalid token" });
        }
      }
}



module.exports = AppController;
