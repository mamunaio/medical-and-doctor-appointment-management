import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";

async function meHandler(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const userData = await User.findById(user.userId).select("-passwordHash");
    if (!userData) return apiResponse.error("User not found", 404);
    
    return apiResponse.success(userData);
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

export const GET = requireAuth(meHandler);
