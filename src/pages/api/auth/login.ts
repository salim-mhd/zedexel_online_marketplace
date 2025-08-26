import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("Server configuration error");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userResponse = { id: user._id, username: user.username, email: user.email };

    return res.status(200).json({ message: "Login successful", user: userResponse, token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}
