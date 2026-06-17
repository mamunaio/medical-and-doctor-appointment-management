import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Prescription from "@/models/Prescription";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";
import { autoId } from "@/lib/autoId";
import { validateRequest, prescriptionSchema } from "@/lib/validators";

async function getPrescriptions(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const patientId = searchParams.get("patientId");
    const appointmentId = searchParams.get("appointmentId");
    const search = searchParams.get("search");
    const date = searchParams.get("date");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query: any = {};

    if (user.role === 'doctor') query.doctor = user.userId;
    if (user.role === 'patient') query.patient = user.userId;
    if (doctorId && user.role !== 'doctor') query.doctor = doctorId;
    if (patientId) query.patient = patientId;
    if (appointmentId) query.appointment = appointmentId;
    if (search) {
      query.$or = [
        { prescriptionId: { $regex: search, $options: "i" } }
      ];
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.prescriptionDate = { $gte: start, $lt: end };
    }

    const skip = (page - 1) * limit;
    const total = await Prescription.countDocuments(query);
    const prescriptions = await Prescription.find(query)
      .populate("patient", "name patientId phone gender")
      .populate("doctor", "name role doctorProfile.specialization")
      .populate("medicalRecord", "recordId primaryDiagnosis")
      .populate("appointment", "appointmentId timeSlot status")
      .sort({ prescriptionDate: -1 })
      .skip(skip)
      .limit(limit);

    return apiResponse.paginate(prescriptions, total, page, limit);
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

async function createPrescription(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const body = await req.json();

    const { data: rawData, error } = validateRequest(prescriptionSchema, body);
    if (error) return apiResponse.error("Validation failed: " + JSON.stringify(error), 400);

    const data = rawData as any;

    data.prescriptionId = await autoId.generatePrescriptionId();
    data.doctor = user.userId;
    data.prescriptionDate = new Date(data.prescriptionDate);

    if (data.followUpDate) {
      data.followUpDate = new Date(data.followUpDate);
    }

    const prescription = await Prescription.create(data);
    const populated = await Prescription.findById(prescription._id)
      .populate("patient", "name patientId phone gender")
      .populate("doctor", "name role");

    return apiResponse.success(populated, "Prescription created successfully", 201);
  } catch (error: any) {
    return apiResponse.error(error.message, 400);
  }
}

export const GET = requireAuth(getPrescriptions);
export const POST = requireAuth(createPrescription);
