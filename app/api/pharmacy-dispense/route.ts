import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import PharmacyDispense from "@/models/PharmacyDispense";
import Medicine from "@/models/Medicine";
import Prescription from "@/models/Prescription";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";
import { autoId } from "@/lib/autoId";

async function createDispense(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // items should be array of: { medicineId, quantity, unitPrice, totalPrice, batchNumber }
    const { patient, prescription, items, totalAmount, netAmount, paymentMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return apiResponse.error("No items to dispense", 400);
    }

    // Begin processing stock deductions
    for (const item of items) {
      const med = await Medicine.findById(item.medicine);
      if (!med) {
        return apiResponse.error(`Medicine not found: ${item.medicine}`, 404);
      }
      if (med.stock < item.quantity) {
        return apiResponse.error(`Insufficient stock for ${med.name}. Available: ${med.stock}`, 400);
      }
      
      // Deduct stock
      med.stock -= item.quantity;
      await med.save();
    }

    const dispenseId = await autoId.generateInvoiceId(); // Reuse invoice ID logic or separate

    const dispense = await PharmacyDispense.create({
      dispenseId: `DISP-${Date.now().toString().slice(-6)}`,
      patient,
      prescription,
      dispensedBy: user.userId,
      items,
      totalAmount,
      netAmount,
      paymentMethod: paymentMethod || "cash"
    });

    // Mark prescription as dispensed
    if (prescription) {
      await Prescription.findByIdAndUpdate(prescription, {
        isDispensed: true,
        dispensedAt: new Date(),
        dispensedBy: user.userId
      });
    }

    return apiResponse.success(dispense, "Medicines dispensed successfully", 201);
  } catch (error: any) {
    return apiResponse.error(error.message, 400);
  }
}

export const POST = requireAuth(createDispense);
