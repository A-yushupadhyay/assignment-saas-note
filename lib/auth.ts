// lib/auth.ts
import jwt from "jsonwebtoken";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // never use NEXT_PUBLIC_ for secret

// Role type
export type Role = "ADMIN" | "MEMBER";

// JWT payload
export interface AuthPayload {
  userId: string;
  email: string;
  role: Role;
  tenantId: string;
  tenantSlug: string;
}

// Login function
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { tenant: true },
  });

  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  const payload: AuthPayload = {
    userId: user.id,
    email: user.email,
    role: user.role as Role,
    tenantId: user.tenantId,
    tenantSlug: user.tenant.slug,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  return { token, user: payload };
}

// Verify JWT token (for App Router)
export function verifyJwt(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

// Middleware wrappers (for App Router, optional)
export async function requireAuth(token: string | null) {
  if (!token) return null;
  return verifyJwt(token);
}

// Check role (for App Router route logic)
export function requireRole(payload: AuthPayload, role: Role) {
  if (!payload) return false;
  return payload.role === role;
}
