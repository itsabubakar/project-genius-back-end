 /**
 * @file Provides all functionality for user end points
 * @author Simpa
 * @copyright Project Genius 2025
 */

import User from "../utils/user";
import Auth from "../utils/auth";

class UsersController {
  /**
   * Class that provide function of all users endpoint
   */

  static async initiateSignUp(req, res) {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });
    if (!password) return res.status(400).json({ error: "Missing password" });

    try {
      const user = await Auth.signUp({ email, password });
      return res
        .status(201)
        .json({ message: "Verify email to complete signUp" });
    } catch (err) {
      if (err.message === "User already registered")
        return res.status(409).json({error: err.message});
      return res.status(err.status).json({ error: err.message });
    }
  }

  static async finalizeSignUp(req, res) {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      department_id
    } = req.body;
    
    if (!email) res.status(400).json({ error: "Missing email"})
    if (!password) res.status(400).json({ error: "Missing password"})
    if (!role) res.status(400).json({ error: "Missing role"})

    if (!(['member', 'lead'].includes(role))) {
      return res.status(400).json({ error: "Invalid role selected"});
    }

    try {
      const session = await Auth.signIn({ email, password });
      const data = await User.insertUser({
        user_id: session.user.id,
      });
      await User.insertContestant({
        user_id: session.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        phone,
        department_id,
      });
      return res.json({ message: "Sign Up complete" });
    } catch (err) {
      if (err.message === "Email not confirmed") {
        return res.status(403).json({ error: err.message });
      }
      return res.status(err.status).json({ error: err.message });
    }
  }

  static async updateUser(req, res) {
    const id = req.params.id
    if (!id) return res.status(404).json({ message: err.message });
    const {
      first_name,
      last_name,
      phone
    } = req.body;
    try {
      await User.update({
        first_name,
        last_name,
        phone
      }, id);
      return res.status(204).send();
    } catch(err) {
      console.log(err);
      return res.status(err.status).json({ error: err.message });
    }
  }

  static async uploadPicture(req, res) {
    
  }
}

module.exports = UsersController;
