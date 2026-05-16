import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { apiResponse } from './apiResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export interface AuthUser {
  userId: string;
  role: string;
  name: string;
  email: string;
}

export const verifyToken = (req: NextRequest): AuthUser | null => {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const requireAuth = (handler: Function) => {
  return async (req: NextRequest, ...args: any[]) => {
    const user = verifyToken(req);
    if (!user) return apiResponse.unauthorized();
    
    // Attach user to req (NextRequest is immutable, so we pass it to handler)
    return handler(req, user, ...args);
  };
};

export const requireRole = (roles: string[], handler: Function) => {
  return async (req: NextRequest, ...args: any[]) => {
    const user = verifyToken(req);
    if (!user) return apiResponse.unauthorized();
    if (!roles.includes(user.role)) return apiResponse.forbidden();
    
    return handler(req, user, ...args);
  };
};
