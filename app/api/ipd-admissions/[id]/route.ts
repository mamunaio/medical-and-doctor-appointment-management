import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import IPDAdmission from "@/models/IPDAdmission";
import Bed from "@/models/Bed";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";

async function updateIPDAdmission(req: NextRequest, user: AuthUser, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const admission = await IPDAdmission.findById(id);
    if (!admission) {
      return apiResponse.error("Admission not found", 404);
    }

    // Handle Discharge Logic
    if (body.status === "discharged" && admission.status !== "discharged") {
      admission.status = "discharged";
      admission.dischargeDate = new Date();
      admission.dischargeDiagnosis = body.dischargeDiagnosis;
      admission.dischargeCondition = body.dischargeCondition || "improved";
      admission.dischargeInstructions = body.dischargeInstructions;
      admission.isDischargedBy = user.userId;

      // Free the bed
      if (admission.bed) {
        await Bed.findByIdAndUpdate(admission.bed, {
          status: "cleaning", // Put bed in cleaning mode
          $unset: { currentPatient: "", currentAdmission: "" }
        });
      }
    } else {
      // Update other fields
      Object.assign(admission, body);
    }

    await admission.save();

    const populated = await IPDAdmission.findById(id)
      .populate("patient", "name patientId phone gender")
      .populate("admittingDoctor", "name role")
      .populate("bed", "bedNumber ward bedType");

    return apiResponse.success(populated, "Admission updated successfully");
  } catch (error: any) {
    return apiResponse.error(error.message, 400);
  }
}

export const PATCH = requireAuth(updateIPDAdmission);
