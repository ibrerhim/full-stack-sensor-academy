import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "sensor_academy_secret_token_authentication_key_102938";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    isAdmin: boolean;
  };
}

/**
 * Encrypts a plaintext password using bcrypt hashing.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Validates a plaintext password against an encrypted hash.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generates a signed Web Token for a successfully authenticated user.
 */
export function generateToken(user: { id: string; email: string; isAdmin: boolean }): string {
  return jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * Express middleware to authenticate and extract the user's details from JWT.
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

  if (!token) {
    res.status(401).json({ error: "Access denied. Token missing from authorization header." });
    return;
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET) as { id: string; email: string; isAdmin: boolean };
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token details. Session has expired." });
  }
}

/**
 * Express middleware to ensure the authenticated user has general Admin authority.
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: "User is unauthenticated." });
    return;
  }

  if (!req.user.isAdmin) {
    res.status(403).json({ error: "Access forbidden. Admin role level permissions required." });
    return;
  }

  next();
}
