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
        const paymentURL = await App.getPaymentURL({ 
            email: user.email, 
            user_id: user.id
          });
        return res.json({ 
          message: "please create a team",
          paymentURL,});
      }
      const team = await Team.getTeam(contestant.team_id);
      
      const members = await Team.getMembers(contestant.team_id);
      const currentStage = await Stage.curStage();
      return res.json({
        currentStage,
        team,
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
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const event = req.body;
    if (event.event !== 'charge.success') {
      return res.status(400).json({ message: 'Charge not successful' });
    }

    const { metadata, reference, status, customer} = event.data;
  
    if (status !== "success") {
      return res.status(400).json({ message: "Transaction not successful"})
    }
    
    const userId = metadata.user_id;

    try {
      await App.makePayment({
      email: customer.email,
      ref: reference,
      user_id: userId
      });
      console.log(`Payment verified for ${customer.email}. Reference: ${reference}`);
      return res.status(200).json({ message: 'Payment was registered successfully' });
    } catch (err) {
      console.error('Webhook Processing Error:', err.message);
      return res.status(err.response?.status || 500).json({ message: err.message });
    }
  }

  static  async verifyPayment(req, res) {
    const { ref } = req.params;
    const secret = process.env.PAYSTACK_SECRET_KEY;
  
    try {
      const response = await axios.get(`https://api.paystack.co/transaction/verify/${ref}`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
  
      if (response.data.data.status === "success") {
        return res.json({ status: "success" });
      } else {
        return res.json({ status: "failed" });
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
      return res.status(500).json({ status: "error", message: "Verification failed" });
    }
  }
}




module.exports = AppController;
