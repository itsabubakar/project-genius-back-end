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
      const id = await supabaseClient.signIn({ email, password });
      return res.status(200).json({ id, email });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = AuthsController;
