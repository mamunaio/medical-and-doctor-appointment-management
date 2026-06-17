import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Medicine from "@/models/Medicine";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";

async function updateMedicine(req: NextRequest, user: AuthUser, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return apiResponse.error("Medicine not found", 404);
    }

    if (body.action === "update_stock") {
      medicine.stock += Number(body.quantity || 0);
    } else {
      Object.assign(medicine, body);
    }

    await medicine.save();
    return apiResponse.success(medicine, "Medicine updated successfully");
  } catch (error: any) {
    return apiResponse.error(error.message, 400);
  }
}

export const PATCH = requireAuth(updateMedicine);
