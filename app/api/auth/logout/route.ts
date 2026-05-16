import { NextRequest, NextResponse } from "next/server";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth } from "@/lib/authMiddleware";

async function logoutHandler(req: NextRequest) {
  // In a real app, you might blacklist the token in Redis or DB
  return apiResponse.success(null, "Log out successful");
}

export const POST = requireAuth(logoutHandler);
