/**
 * @file stages utils
 * @author Simpa
 * @copyright Project Genius 202
 */

import supabaseClient from "./supabase";

class Stage {
  static async curStage() {
    const now = new Date().toISOString();

    const { data, error } = await supabaseClient.supabase
      .from("stages")
      .select("stage_name, start_date, end_date")
      .lte("start_date", now)
      .gte("end_date", now)
      .limit(1);

    if (error) {
      console.log("in-betwwen error");
      throw error;
    }

    if (data.length) {
      return data[0].stage_name;
    }

    const { data: futureStages, error: futureError } = await supabaseClient.supabase
      .from("stages")
      .select("stage_name")
      .gt("start_date", now)
      .order("start_date", { ascending: true });

    if (futureError) throw futureError;

    if (futureStages.length > 0) {
      return futureStages[0].stage_name;
    }

    if (futureStages.length == 3) return "post";
  }
}

module.exports = Stage;
