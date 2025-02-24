/**
* @file Brief description of the file here
* @author Simpa
* @copyright Project Genius 2025
* @license LicenseHereIfApplicable
*/

const { createClient } = require('@supabase/supabase-js');
import supabaseClient from './supabase';
const axios = require('axios');
require("dotenv").config();


class App {

    static duplicateField(message) {
        const match = message.match(/unique constraint "([^"]+)"/);
        const constraintName = match[1];
        return constraintName;
    }

    static async makePayment(details) {
        const supabaseUrl = process.env.SUPABASE_DEV_URL;
        const supabaseKey = process.env.SUPABASE_DEV_SERVICE_ROLE_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const {error} = await supabase
            .from('payments')
            .insert(details)
        if (error) throw error;
    }

    static async getPaymentURL(details) {
        if(!details)
            return "err";
        try {
          const secret = process.env.PAYSTACK_SECRET_KEY;
          const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
              email: details.email,
              amount: 5000 * 100,
              currency: "NGN",
              metadata: {
                user_id: details.user_id
              },
              callback_url: "https://www.projectgenius.com.ng/application",
            },
            {
              headers: {
                Authorization: `Bearer ${secret}`,
                "Content-Type": "application/json",
              },
            }
          );
          return response.data.data.authorization_url;
        } catch(err) {
          console.log(err);
          return "err";
        }
      }

    static async sendMessage(messageInfo) {
        const { error } = await supabaseClient.supabase 
            .from('contact_us')
            .insert({
                sender_name: messageInfo.name,
                sender_email: messageInfo.email,
                message: messageInfo.message
            })
        if (error) throw error;
        return 'successful';
    }
}

module.exports = App;
