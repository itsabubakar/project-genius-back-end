import { Fields } from "../func-based-utils/missingField";
import { supabase } from "../func-based-utils/supabase";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const missingFields = Fields(
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
    req
  );
  if (missingFields) {
    return res.status(400).json({
      message: "missing required fields",
      missing_fields: missingFields,
    });
  }
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
  const token = jwt.sign({ username: req.email }, process.env.JWT_SECRET, {
    expiresIn: "2 days",
  });
  return res
    .status(201)
    .json({ message: "User Created!", token: token, user: data });
};
