/**
 * @file Provides the functionality for authentication endpoinnt
 * @author Simpa
 * @copyright Project Genius 2025
 * @license LicenseHereIfApplicable
 */

import Auth from "../utils/auth";
import User from "../utils/user";

class AuthsController {
  /**
   * class for all authentication endpoint
   */

  static async connect(req, res) {
    const { email, password } = req.body;
    // console.log(email, password);
    if (!email) return res.status(400).json({ error: "Missing email" });
    if (!password) return res.status(400).json({ error: "Missing password" });
    try {
      const session = await Auth.signIn({ email, password })
      // res.cookie("refresh_token", session.refresh_token);
      const user = await User.getContestant(session.user.id)
      return res.status(200).json({
        firstName: user.first_name,
        initials: user.initials,
        role: user.role,
        userId: user.user_id,
        teamId: user.team_id,
      });
    } catch (err) {
      return res.status(err.status).json({ error: err.message });
    }
  }

  static async disconnect(req, res) {
    try {
      Auth.signOut();
      return res.status(204).send();
    } catch (err) {
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
      return res.status(201).json({ message: "Password Updated" });
    } catch (err) {
      return res.status(err.status).json({ error: err.message });
    }
  }
}

module.exports = AuthsController;
