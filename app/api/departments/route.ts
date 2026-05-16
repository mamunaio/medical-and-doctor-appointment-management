import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Department from "@/models/Department";
import User from "@/models/User";
import { apiResponse } from "@/lib/apiResponse";
import { requireRole } from "@/lib/authMiddleware";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const departments = await Department.find({ isActive: true });
    
    // Add doctor count for each department
    const deptsWithCounts = await Promise.all(departments.map(async (dept) => {
      const doctorCount = await User.countDocuments({ role: 'doctor', 'doctorProfile.department': dept._id });
      return { ...dept.toObject(), doctorCount };
    }));

    return apiResponse.success(deptsWithCounts);
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

async function createDepartment(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const department = await Department.create(body);
    return apiResponse.success(department, "Department created successfully", 201);
  } catch (error: any) {
    return apiResponse.error(error.message, 400);
  }
}

export const POST = requireRole(['admin'], createDepartment);
