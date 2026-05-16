import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { apiResponse } from "@/lib/apiResponse";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("department");
    const search = searchParams.get("search") || "";

    let query: any = { role: 'doctor', isActive: true };
    if (departmentId) query["doctorProfile.department"] = departmentId;
    if (search) query.name = { $regex: search, $options: "i" };

    const doctors = await User.find(query)
      .select("name email phone avatar doctorProfile")
      .populate("doctorProfile.department", "name");

    return apiResponse.success(doctors);
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}
