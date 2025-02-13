/**
* @file Brief description of the file here
* @author Simpa
* @copyright Project Genius 2025
* @license LicenseHereIfApplicable
*/

const { createClient } = require('@supabase/supabase-js');
import supabaseClient from './supabase';
require("dotenv").config();


class App {

    static duplicateField(message) {
        const match = message.match(/unique constraint "([^"]+)"/);
        const constraintName = match[1];
        return constraintName;
    }

    static async makePayment(details) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const {error} = await supabase
            .from('payments')
            .insert(details)
        if (error) throw error;
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
