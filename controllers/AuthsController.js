/**
 * @file Provides the functionality for authentication endpoinnt
 * @author Simpa
 * @copyright Project Genius 2025
 * @license LicenseHereIfApplicable
 */

import Auth from "../utils/auth";
import App from "../utils/app";
import Team from "../utils/team";
import User from "../utils/user";

class AuthsController {
  /**
   * class for all authentication endpoint
   */

  static async connect(req, res) {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });
    if (!password) return res.status(400).json({ error: "Missing password" });
    try {
      let is_paid
      const session = await Auth.signIn({ email, password });
      const user = await User.getContestant(session.user.id);
      if (user.role  === "lead") {
          is_paid  = await App.isPaid(user.user_id);
      }
      const team = await Team.getTeam(user.team_id);
      return res.status(200).json({
        firstName: user.first_name,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        initials: user.initials,
        role: user.role,
        is_paid,
        department: user.department,
        team: team?.team_name,
      });
    } catch (err) {
      if (!err.status)
        return res.status(500).json({error: err.message});
      return res.status(err.status).json({ error: err.message });
    }
  }

  static async disconnect(req, res) {
    try {
      Auth.signOut();
      return res.status(204).send();
    } catch (err) {
      if (!err.status)
        return res.status(500).json({error: err.message});
      return res.status(err.status).json({ error: err.message });
    }
  }

  static async reset(req, res) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });
    try {
      await Auth.sendReset(email);
      return res
        .status(200)
        .json({ message: "Check your email for reset link" });
    } catch (err) {
      if (!err.status)
        return res.status(500).json({error: err.message});
      return res.status(err.status).json({ error: err.message });
    }
  }

  static async finalizeReset(req, res) {
    const { password } = req.body;
    const { accessToken } = req.body;

    if (!password) return res.status(400).json({ error: "Missing password" });
    if (!accessToken)
      return res.status(400).json({ error: "Missing accessToken" });
    if (!Auth.isValidJWT(accessToken))
      return res.status(401).json({ error: "Unauthorized" });

    try {
      await Auth.updatePassword(password, accessToken);
      return res.status(200).json({ message: "Password Updated" });
    } catch (err) {
      if (!err.status)
        return res.status(500).json({error: err.message});
      return res.status(err.status).json({ error: err.message });
    }
  }

  static async resendConfirmation(req, res) {
    const { email, password } = req.body;
    if (!email)
      return res.status(400).json({ error: "Missing email" })
    if (!password)
      return res.status(400).json({ error: "Missing password"})
    try {
      await Auth.sendConfirmation(email, password);
      return res.status(200).json({ "message": "Confirmation mail sent"})
    } catch (err) {
      if (!err.status)
        return res.status(500).json({error: err.message});
      return res.status(err.status).json({ error: err.message });
    }
  }
}

module.exports = AuthsController;
