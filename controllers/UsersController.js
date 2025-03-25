/**
 * @file Provides all functionality for user end points
 * @author Simpa
 * @copyright Project Genius 2025
 */

import User from "../utils/user";
import Auth from "../utils/auth";
import supabaseClient from '../utils/supabase';


class UsersController {
  /**
   * Class that provide function of all users endpoint
   */

  static async SignUp(req, res) {
    const { email, 
      password, 
      firstName, 
      lastName, 
      role, 
      phone, 
      department, 
      faculty, 
      // inviteCode
    } = req.body;

    if (!email) res.status(400).json({ error: "Missing email" });
    if (!password) res.status(400).json({ error: "Missing password" });
    if (!role) res.status(400).json({ error: "Missing role" });
    if (!department) res.status(400).json({ error: "Missing department" });

    if (!faculty) res.status(400).json({ error: "Missing faculty"});

    if (!["member", "lead"].includes(role)) {
      return res.status(400).json({ error: "Invalid role selected" });
    }

    try {
      // console.log(inviteCode);
      const session = await Auth.signUp({ email, password });
      console.log(session);
      await User.insertContestant({
        user_id: session.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        phone,
        department,
        faculty,
        // invite_code: inviteCode
      });
      return res.status(201).json({
        message: "Verify email to complete signUp",
      });
    } catch (err) {
      console.log(err);
      if (!err.status)
        return res.status(500).json({error: err.message});
      return res.status(err.status).json({ error: err.message });
    }
  }

  static async updateContestant(req, res) {
    const user = await supabaseClient.getUser();
      if (!user)
        return res.status(401).json({ error: "Unauthorized"}) 
    const { firstName, lastName, phone } = req.body;
    try {
      await User.updateContestant(
        {
          first_name: firstName,
          last_name: lastName,
          phone,
        },
        user.id
      );
      return res.status(200).json({
        firstName,
        lastName,
        phone,
      });
    } catch (err) {
      console.log(err);
      if (!err.status)
        return res.status(500).json({error: err.message});
      return res.status(err.status).json({ error: err.message });
    }
  }
}

module.exports = UsersController;
