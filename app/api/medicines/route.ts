import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Medicine from "@/models/Medicine";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";

async function getMedicines(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    let query: any = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { genericName: { $regex: search, $options: "i" } },
      ];
    }
    
    if (category && category !== "All Categories") {
      query.category = category;
    }

    const medicines = await Medicine.find(query).sort({ name: 1 });
    return apiResponse.success(medicines);
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

async function createMedicine(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const body = await req.json();

    const existingMedicine = await Medicine.findOne({ 
      name: { $regex: new RegExp(`^${body.name}$`, "i") }
    });
    
    if (existingMedicine) {
      return apiResponse.error("Medicine with this name already exists", 400);
    }

    const medicine = await Medicine.create(body);
    return apiResponse.success(medicine, "Medicine created successfully", 201);
  } catch (error: any) {
    return apiResponse.error(error.message, 400);
  }
}

export const GET = requireAuth(getMedicines);
export const POST = requireAuth(createMedicine);
