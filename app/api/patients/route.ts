import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";
import User from "@/models/User";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, requireRole, AuthUser } from "@/lib/authMiddleware";
import { autoId } from "@/lib/autoId";
import { validateRequest, patientSchema } from "@/lib/validators";

async function getPatients(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    let query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { patientId: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return apiResponse.paginate(patients, total, page, limit);
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

async function createPatient(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const body = await req.json();

    const { data, error } = validateRequest(patientSchema, body);
    if (error) return apiResponse.error("Validation failed", 400);

    // Auto-generate patient ID
    data.patientId = await autoId.generatePatientId();
    data.registeredBy = user.userId;

    const patient = await Patient.create(data);
    
    // Create a patient user account if email is provided
    if (data.email) {
      await User.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'patient',
        password: 'defaultPassword123', // Should be random or chosen by user
        isActive: true
      });
    }

    return apiResponse.success(patient, "Patient registered successfully", 201);
  } catch (error: any) {
    return apiResponse.error(error.message, 400);
  }
}

export const GET = requireRole(['admin', 'doctor', 'nurse', 'receptionist'], getPatients);
export const POST = requireRole(['receptionist', 'admin'], createPatient);
