/**
* @file Brief description of the file here
* @author Simpa
* @copyright Project Genius 2025
* @license LicenseHereIfApplicable
*/

import supabaseClient from './supabase';
class App {
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
