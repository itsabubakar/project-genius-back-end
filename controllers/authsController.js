/**
 * @file Provides the functionality for authentication endpoinnt
 * @author Simpa
 * @copyright Project Genius 2025
 * @license LicenseHereIfApplicable
 */

import supabaseClient from "../utils/supabase";

class AuthsController {
  /**
   * class for all authentication endpoint
   */

  static async connect(req, res) {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });
    if (!password) return res.status(400).json({ error: "Missing password" });
    try {
      const session = await supabaseClient.signIn({ email, password });
      res.cookie("refresh_token", session.refresh_token);
      return res.status(200).json({
        id: session.user.id,
      });
    } catch (err) {
      return res.status(err.status).json({ error: err.message });
    }
  }

  static async disconnect(req, res) {
    try {

      supabaseClient.signOut();
      res.status(204).send();
    } catch(err) {
      console.log(err);
    }

  }
  

  static async reset(req, res) {
    const {email} = req.body;
    console.log(email);
    if (!email) return res.status(400).json({})
    try {
      await supabaseClient.sendReset(email);
      return res.status(200).json({"message": "Check your email for request link"});
    } catch(err) {
      console.log(err);
    }
  }

  static async finalizeReset(req, res) {
    const {password} = req.body;
    if (!password) return res.status(400).json({error: "Missing password"});
    try {
      await supabaseClient.updatePassword(password);
      return res.status(201).json({"message": "Password Updated"})
    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = AuthsController;
