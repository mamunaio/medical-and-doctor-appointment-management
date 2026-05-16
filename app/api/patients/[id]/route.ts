import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";
import Appointment from "@/models/Appointment";
import Prescription from "@/models/Prescription";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth } from "@/lib/authMiddleware";

async function getPatientById(req: NextRequest, user: any, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const patient = await Patient.findById(id);
    if (!patient) return apiResponse.error("Patient not found", 404);

    // Populate recent data
    const recentAppointments = await Appointment.find({ patient: id })
      .sort({ date: -1 })
      .limit(5)
      .populate('doctor', 'name');

    const recentPrescriptions = await Prescription.find({ patient: id })
      .sort({ createdAt: -1 })
      .limit(3);

    return apiResponse.success({
      patient,
      recentAppointments,
      recentPrescriptions
    });
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

async function updatePatient(req: NextRequest, user: any, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const patient = await Patient.findByIdAndUpdate(id, body, { new: true });
    if (!patient) return apiResponse.error("Patient not found", 404);
    return apiResponse.success(patient, "Patient updated successfully");
  } catch (error: any) {
    return apiResponse.error(error.message, 400);
  }
}

export const GET = requireAuth(getPatientById);
export const PATCH = requireAuth(updatePatient);
