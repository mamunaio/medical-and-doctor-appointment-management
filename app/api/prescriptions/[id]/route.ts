import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Prescription from "@/models/Prescription";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";

async function getPrescription(
  req: NextRequest,
  user: AuthUser,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await dbConnect();
    const resolvedParams = await props.params;
    const { id } = resolvedParams;

    const prescription = await Prescription.findById(id)
      .populate("patient", "name patientId phone gender bloodGroup dateOfBirth address medicalHistory")
      .populate("doctor", "name role doctorProfile.specialization doctorProfile.bmdcNumber")
      .populate("medicalRecord", "recordId primaryDiagnosis secondaryDiagnoses chiefComplaint vitals")
      .populate("appointment", "appointmentId timeSlot status date")
      .populate("labTests", "orderId testName status");

    if (!prescription) {
      return apiResponse.error("Prescription not found", 404);
    }

    return apiResponse.success(prescription);
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

async function updatePrescription(
  req: NextRequest,
  user: AuthUser,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await dbConnect();
    const resolvedParams = await props.params;
    const { id } = resolvedParams;
    const body = await req.json();

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return apiResponse.error("Prescription not found", 404);
    }

    if (user.role === 'doctor' && prescription.doctor.toString() !== user.userId) {
      return apiResponse.error("Unauthorized to update this prescription", 403);
    }

    const allowedFields = [
      'diagnosis', 'medicines', 'labTests', 'radiologyOrders',
      'generalAdvice', 'dietAdvice', 'activityAdvice', 'customAdvice',
      'followUpDate', 'followUpBring', 'isDispensed', 'dispensedAt', 'dispensedBy'
    ];

    const updates: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (updates.followUpDate) {
      updates.followUpDate = new Date(updates.followUpDate);
    }

    if (updates.isDispensed && !prescription.isDispensed) {
      updates.dispensedAt = new Date();
      updates.dispensedBy = user.userId;
    }

    const updated = await Prescription.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    )
      .populate("patient", "name patientId phone gender")
      .populate("doctor", "name role");

    return apiResponse.success(updated, "Prescription updated successfully");
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

async function deletePrescription(
  req: NextRequest,
  user: AuthUser,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await dbConnect();
    const resolvedParams = await props.params;
    const { id } = resolvedParams;

    if (!['admin', 'super_admin'].includes(user.role)) {
      return apiResponse.error("Only admins can delete prescriptions", 403);
    }

    const prescription = await Prescription.findByIdAndDelete(id);
    if (!prescription) {
      return apiResponse.error("Prescription not found", 404);
    }

    return apiResponse.success(null, "Prescription deleted successfully");
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

export const GET = requireAuth(getPrescription);
export const PATCH = requireAuth(updatePrescription);
export const DELETE = requireAuth(deletePrescription);
