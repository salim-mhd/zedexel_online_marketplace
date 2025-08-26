// src/pages/api/profile.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/lib/authMiddleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const user = verifyToken(req); // passing req with headers
    return res.status(200).json({ message: "User profile", user });
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
}
