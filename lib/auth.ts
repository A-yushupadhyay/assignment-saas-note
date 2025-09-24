import jwt from 'jsonwebtoken';
import prisma from './prisma';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'supersecret';

// Role type from your schema
export type Role = 'ADMIN' | 'MEMBER';

// Payload type stored in JWT
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

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  return { token, user: payload };
}

// Verify token
export function verifyToken(req: NextApiRequest): AuthPayload | null {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

// Middleware wrapper: Require Auth
export function requireAuth(
  handler: (req: NextApiRequest & { user: AuthPayload }, res: NextApiResponse) => void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const payload = verifyToken(req);
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    (req as NextApiRequest & { user: AuthPayload }).user = payload;
    return handler(req as NextApiRequest & { user: AuthPayload }, res);
  };
}

// Middleware wrapper: Require specific Role
export function requireRole(
  role: Role,
  handler: (req: NextApiRequest & { user: AuthPayload }, res: NextApiResponse) => void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const userReq = req as NextApiRequest & { user?: AuthPayload };
    if (!userReq.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (userReq.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return handler(userReq as NextApiRequest & { user: AuthPayload }, res);
  };
}  
// Verify raw token (for App Router NextRequest)
export function verifyJwt(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}
