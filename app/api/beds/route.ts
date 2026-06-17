import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Bed from "@/models/Bed";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";

async function getBeds(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const ward = searchParams.get("ward");
    const status = searchParams.get("status");
    const availableOnly = searchParams.get("availableOnly") === "true";

    let query: any = { isActive: true };

    if (ward) query.ward = ward;
    if (status) query.status = status;
    if (availableOnly) query.status = "available";

    const beds = await Bed.find(query)
      .populate("department", "name code")
      .sort({ ward: 1, bedNumber: 1 });

    return apiResponse.success(beds);
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

export const GET = requireAuth(getBeds);
