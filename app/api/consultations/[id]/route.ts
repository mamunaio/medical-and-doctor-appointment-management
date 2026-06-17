import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import MedicalRecord from "@/models/MedicalRecord";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";

async function getConsultation(
  req: NextRequest,
  user: AuthUser,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await dbConnect();
    const resolvedParams = await props.params;
    const { id } = resolvedParams;

    const record = await MedicalRecord.findById(id)
      .populate("patient", "name patientId phone gender bloodGroup dateOfBirth address medicalHistory")
      .populate("doctor", "name role doctorProfile.specialization")
      .populate("appointment", "appointmentId timeSlot status date chiefComplaint")
      .populate("department", "name code");

    if (!record) {
      return apiResponse.error("Consultation record not found", 404);
    }

    return apiResponse.success(record);
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

async function updateConsultation(
  req: NextRequest,
  user: AuthUser,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await dbConnect();
    const resolvedParams = await props.params;
    const { id } = resolvedParams;
    const body = await req.json();

    const record = await MedicalRecord.findById(id);
    if (!record) {
      return apiResponse.error("Consultation record not found", 404);
    }

    if (user.role === 'doctor' && record.doctor.toString() !== user.userId) {
      return apiResponse.error("Unauthorized to update this record", 403);
    }

    const allowedFields = [
      'vitals', 'chiefComplaint', 'historyOfPresentIllness',
      'physicalExamination', 'systemicExamination',
      'primaryDiagnosis', 'secondaryDiagnoses',
      'treatmentPlan', 'advice', 'dietAdvice',
      'followUpDate', 'followUpNotes',
      'referral', 'admittedToIPD', 'ipdAdmission'
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

    if (updates.vitals?.weight && updates.vitals?.height) {
      const heightM = updates.vitals.height / 100;
      updates.vitals.bmi = Math.round((updates.vitals.weight / (heightM * heightM)) * 10) / 10;
    }

    const updated = await MedicalRecord.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    )
      .populate("patient", "name patientId phone gender")
      .populate("doctor", "name role");

    return apiResponse.success(updated, "Consultation record updated successfully");
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

async function deleteConsultation(
  req: NextRequest,
  user: AuthUser,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await dbConnect();
    const resolvedParams = await props.params;
    const { id } = resolvedParams;

    if (!['admin', 'super_admin'].includes(user.role)) {
      return apiResponse.error("Only admins can delete consultation records", 403);
    }

    const record = await MedicalRecord.findByIdAndDelete(id);
    if (!record) {
      return apiResponse.error("Consultation record not found", 404);
    }

    return apiResponse.success(null, "Consultation record deleted successfully");
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

export const GET = requireAuth(getConsultation);
export const PATCH = requireAuth(updateConsultation);
export const DELETE = requireAuth(deleteConsultation);
