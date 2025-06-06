import { Fields } from "../func-based-utils/missingField";
import { supabase } from "../func-based-utils/supabase";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const missingfields = Fields(
    [
      "email",
      "password",
      "firstName",
      "lastName",
      "role",
      "phone",
      "department",
      "faculty",
    ],
    req,
    res
  );
  if (missingfields) return;

  if (!["member", "lead"].includes(req.body.role)) {
    return res.status(400).json({ error: "Invalid role selected" });
  }
  const hashed = await bcrypt.hash(req.body.password, 10);
  const { data, error } = await supabase.from("contestants").insert([
    {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      role: req.body.role,
      email: req.body.email,
      password: "1234567890",
      phone: req.body.phone,
      department: req.body.department,
      faculty: req.body.faculty,
    },
  ]);
  if (error) {
    console.error("Error", error.message);
    return res.status(500).send(error.message);
  }
  const token = jwt.sign({ email: req.email }, process.env.JWT_SECRET, {
    expiresIn: "2 days",
  });
  return res
    .status(201)
    .json({ message: "User Created!", token: token, user: data });
};

export const signIn = async (req, res) => {
  const missingfields = Fields(["email", "password"], req, res);
  if (missingfields) return;
  const { email, password } = req.body;
  const { data, error } = await supabase
    .from("contestants")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();
  const team = await supabase
    .from("teams")
    .select("*")
    .match({ team_id: data?.team_id });
  if (error)
    return res
      .status(401)
      .json({ message: "Invalid Credentials", error: error });
  if (data) {
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: "2 days",
    });
    return res.status(200).json({
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
      email: data.email,
      initials: data.initials,
      role: data.role,
      department: data.department,
      team: team?.data?.team_name || null,
      token: token,
    });
  }
};
