import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import MedicalRecord from "@/models/MedicalRecord";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";
import { autoId } from "@/lib/autoId";
import { validateRequest, medicalRecordSchema } from "@/lib/validators";

async function getConsultations(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const patientId = searchParams.get("patientId");
    const appointmentId = searchParams.get("appointmentId");
    const date = searchParams.get("date");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query: any = {};

    if (user.role === 'doctor') query.doctor = user.userId;
    if (user.role === 'patient') query.patient = user.userId;
    if (doctorId && user.role !== 'doctor') query.doctor = doctorId;
    if (patientId) query.patient = patientId;
    if (appointmentId) query.appointment = appointmentId;

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.visitDate = { $gte: start, $lt: end };
    }

    const skip = (page - 1) * limit;
    const total = await MedicalRecord.countDocuments(query);
    const records = await MedicalRecord.find(query)
      .populate("patient", "name patientId phone gender")
      .populate("doctor", "name role")
      .populate("appointment", "appointmentId timeSlot status")
      .sort({ visitDate: -1 })
      .skip(skip)
      .limit(limit);

    return apiResponse.paginate(records, total, page, limit);
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

async function createConsultation(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const body = await req.json();

    const { data: rawData, error } = validateRequest(medicalRecordSchema, body);
    if (error) return apiResponse.error("Validation failed: " + JSON.stringify(error), 400);

    const data = rawData as any;

    data.recordId = await autoId.generateMedicalRecordId();
    data.doctor = user.userId;
    data.visitDate = new Date(data.visitDate);

    if (data.followUpDate) {
      data.followUpDate = new Date(data.followUpDate);
    }

    if (data.vitals?.bloodPressure?.systolic && data.vitals?.bloodPressure?.diastolic && data.vitals?.weight && data.vitals?.height) {
      const heightM = data.vitals.height / 100;
      data.vitals.bmi = Math.round((data.vitals.weight / (heightM * heightM)) * 10) / 10;
    }

    if (data.vitals) {
      data.vitals.recordedAt = new Date();
      data.vitals.recordedBy = user.userId;
    }

    const record = await MedicalRecord.create(data);
    const populated = await MedicalRecord.findById(record._id)
      .populate("patient", "name patientId phone gender")
      .populate("doctor", "name role");

    return apiResponse.success(populated, "Consultation record created successfully", 201);
  } catch (error: any) {
    return apiResponse.error(error.message, 400);
  }
}

export const GET = requireAuth(getConsultations);
export const POST = requireAuth(createConsultation);
