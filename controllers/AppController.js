/**
 * @file AppContorller
 * @author Simpa<
 * @copyright Project Genius 2025
 */

require("dotenv").config();
const crypto = require('crypto');
const axios = require('axios');


import supabaseClient from '../utils/supabase';
import App const { createClient } = require('@supabase/supabase-js');from "../utils/app";
import Stage from "../utils/stage";
import Team from "../utils/team";
import User from "../utils/user";

class AppController {
  static async dashboard(req, res) {
    try {
      const user = await supabaseClient.getUser();
      if (!user)
        return res.status(401).json({ error: "Unauthorized"})
      const contestant = await User.getContestant(user.id);
      if (!contestant) {
        return res.status(401).json({ error: "Invalid login Id" });
      }
      if (contestant.team_id === null) {
        if (contestant.role === "member")
          return res.status(200).json({ message: "please join a team" });
        return res.json({ message: "please create a team" });
      }
      const team = await Team.getTeam(contestant.team_id);
      const members = await Team.getMembers(contestant.team_id);
      const currentStage = await Stage.curStage();
      return res.json({
        currentStage,
        team: team.team_name,
        members,
      });
    } catch (err) {
      // console.log(err);
      if (!err.status)
        return res.status(500).json({error: err.message});
      return res.status(err.status).json({ error: err.message });
    }
  }

  static async contactUs(req, res) {
    const {name, email, message} = req.body;
    if (!name) return res.status(401).json({ error: "Missing name"})
    if (!email) return res.status(401).json({ error: "Missing email"})
    if (!message) return res.status(401).json({error: "Missing message"})
    
    try {const { createClient } = require('@supabase/supabase-js');
      await App.sendMessage({
        name,
        email,
        message,
      })
      return res.status(200).json({ "message": "message has been sent"});
    } catch(err) {
      console.log(err);
      if (!(err.status)) return res.status(500).json(err.message)
      return res.status(err.status).json(err.message)
    }
  }

  static async paymentHook(req, res) {
    const { createClient } = require('@supabase/supabase-js');

    const secret = process.env.PAYSTACK_SECRET_KEY
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const hash  = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

      if (hash === req.headers['x-paystack-signature']) {
        const event = req.body;
    
        if (event.event === 'charge.success') {
          const reference = event.data.reference;
          const user = event.data.customer

          try {
            // Verify transaction with Paystack's API
            const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
              headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
            });
    
            const { status, data } = response.data;
    
            if (status && data.status === 'success') {
              supabase.auth
                .from('payments')
                .insert({
                  email: customer.email,
                  full_name: `${customer.first_name} ${customer.last_name}`,
                  ref: reference,
                  phone: customer.phone,
                  team: customer.team_name
                })
              
    
              // Update your database here with verified transaction data
              console.log(`Payment verified for ${email}. Reference: ${reference}, Amount: ${amount}`);
            } else {
              console.error(`Failed to verify payment for reference: ${reference}`);
            }
          } catch (error) {
            console.error(`Error verifying transaction for reference: ${reference}`, error.message);
          }
        }
      }
  }
}




module.exports = AppController;
