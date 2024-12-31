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
        .json({ message: "verify email to complete signUp" });
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
      first_name,
      last_name,
      role,
      phone,
      department_id
    } = req.body;

    try {
      const session = await Auth.signIn({ email, password });
      const data = await User.insertUser({
        user_id: session.user.id,
      });
      await User.insertContestant({
        user_id: session.user.id,
        email,
        first_name,
        last_name,
        role,
        phone,
        department_id,
      });
      return res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(err.status).json({ message: err.message });
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
