/**
 * @file AppContorller
 * @author Simpa<
 * @copyright Project Genius 2025
 */

require("dotenv").config();
const crypto = require('crypto');
const axios = require('axios');

import App from '../utils/app';
import supabaseClient from '../utils/supabase';
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
      return res.status(201).json({ "message": "message has been sent"});
    } catch(err) {
      console.log(err);
      if (!(err.status)) return res.status(500).json(err.message)
      return res.status(err.status).json(err.message)
    }
  }

  static async paymentHook(req, res) {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash  = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

      if (hash === req.headers['x-paystack-signature']) {
        const event = req.body;
    
        if (event.event === 'charge.success') {
          const reference = event.data.reference;
          const customer = event.data.customer
          const custom_fields = event.data.metadata.custom_fields

          try {
            const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
              headers: { Authorization: `Bearer ${secret}` },
            });
    
            const { status, data } = response.data;
    
            if (status && data.status === 'success') {
              
              await App.makePayment({
                email: customer.email,
                full_name: `${customer.first_name} ${customer.last_name}`,
                ref: reference,
                phone: customer.phone,
                team: custom_fields[0].value
              })
              
              console.log(`Payment verified for ${customer}. Reference: ${reference}`);
              return res.status(200).json({ message: 'Payment was registered successfully' })
            } else {
              console.error(`Failed to verify payment for reference: ${reference}`);
            }
          } catch (err) {
            if (!err.status)
              return res.status(500).send(err.message)
            return res.status(err.status).json({ message: err.message })
          }
        }
      }
  }

  // static async submissionPage(req, res) {
  //   try {
  //     const user = supabaseClient.getUser();

  //     if (!user)
  //       return res.status(401).json({ error: "Unauthorized" });
  //     const contestant = await User.getContestant(user.id);
  //     const team = await Team.getTeam(contestant.team_id);
     
      
      

  //   }

  // } 
}




module.exports = AppController;
