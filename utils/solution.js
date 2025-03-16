/**
 * @file faculty
 * @author Simpa
 * @copyright Project Genius 2025
 */

import supabaseClient from './supabase';

class Solution {
  static async create(details) {
    const {error} = await supabaseClient.supabase
      .from('solutions')
      .insert(details);
    if (error)
      throw error
  }
}

module.exports = Solution;
