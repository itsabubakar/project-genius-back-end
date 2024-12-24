/**
 * @file Provides all functionality for user end points
 * @author Simpa
 * @copyright Project Genius 2025
 */

import supabaseClient from "../utils/supabase";

class UsersController {
  /**
   * Class that provide function of all users endpoint
   */

  static async initiateSignUp(req, res) {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });
    if (!password) return res.status(400).json({ error: "Missing password" });

    try {
      const user = await supabaseClient.signUp({ email, password });
      return res
        .status(201)
        .json({ message: "verify email to complete signUp" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async finalizeSignUp(req, res) {
    const {
      email,
      password,
      firstName,
      lastName,
      teamId,
      phone,
      departmentId,
    } = req.body;

    try {
      const session = await supabaseClient.signIn({ email, password });
      const data = await supabaseClient.insertUser({
        user_id: session.user.id,
      });
      await supabaseClient.insertContestant({
        user_id: userId,
        email,
        name: `${firstName} ${lastName}`,
        team_id: teamId,
        phone,
        department_id: departmentId,
      });
      return res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = UsersController;
