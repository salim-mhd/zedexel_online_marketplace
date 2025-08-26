// src/lib/authMiddleware.ts
import jwt from "jsonwebtoken";
import type { NextApiRequest } from "next";

export function verifyToken(req: NextApiRequest) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET as string);
}
