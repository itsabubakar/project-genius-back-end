/**
 * @file Brief description of the file here
 * @author Simpa
 * @copyright Project Genius 2025
 * @license LicenseHereIfApplicable
 */

import supabaseClient from "./supabase";

const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

const envFile = `.env.${process.env.NODE_ENV || "production"}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });

class App {
  static async getPaymentURL(details) {
    if (!details) return "err";
    try {
      const secret = process.env.PAYSTACK_SECRET_KEY;
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email: details.email,
          amount: 5200 * 100,
          currency: "NGN",
          metadata: {
            user_id: details.user_id,
          },
          callback_url: "http://projectgenius.com.ng/application",
        },
        {
          headers: {
            Authorization: `Bearer ${secret}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data.authorization_url;
    } catch (err) {
      console.log(err);
      return "err";
    }
  }
 
  static async isPaid(userId) {
    const {data, error} = await supabaseClient
      .supabase
      .from('payments')
      .select('user_id')
      .eq('user_id', userId)
      .limit(1);
    
    if (error)
      throw error;
    if (data.length > 0)
      return true
    else
      return false
  }

  static async makePayment(details) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from("payments").insert(details);
    if (error) throw error;
  }

  static async sendMessage(messageInfo) {
    const { error } = await supabaseClient.supabase.from("contact_us").insert({
      sender_name: messageInfo.name,
      sender_email: messageInfo.email,
      message: messageInfo.message,
    });
    if (error) throw error;
    return "successful";
  }
}

module.exports = App;
