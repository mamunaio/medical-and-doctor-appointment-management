import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import IPDAdmission from "@/models/IPDAdmission";
import Bed from "@/models/Bed";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";
import { autoId } from "@/lib/autoId";

async function getIPDAdmissions(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query: any = {};
    if (patientId) query.patient = patientId;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const total = await IPDAdmission.countDocuments(query);
    const admissions = await IPDAdmission.find(query)
      .populate("patient", "name patientId phone gender")
      .populate("admittingDoctor", "name role")
      .populate("bed", "bedNumber ward bedType")
      .sort({ admissionDate: -1 })
      .skip(skip)
      .limit(limit);

    return apiResponse.paginate(admissions, total, page, limit);
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

async function createIPDAdmission(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const body = await req.json();

    const { patient, bed, ward, admissionType, admissionDiagnosis, department } = body;

    if (!patient || !bed) {
      return apiResponse.error("Patient and bed are required", 400);
    }

    const bedDoc = await Bed.findById(bed);
    if (!bedDoc) {
      return apiResponse.error("Bed not found", 404);
    }
    if (bedDoc.status !== "available") {
      return apiResponse.error("Selected bed is not available", 400);
    }

    const admissionId = await autoId.generateAdmissionId();

    const admission = await IPDAdmission.create({
      admissionId,
      patient,
      admittingDoctor: user.userId,
      department: department || bedDoc.department,
      ward: ward || bedDoc.ward,
      bed,
      admissionDate: new Date(),
      admissionType: admissionType || "planned",
      admissionDiagnosis: admissionDiagnosis || undefined,
      admittedBy: user.userId,
      status: "admitted",
    });

    await Bed.findByIdAndUpdate(bed, {
      status: "occupied",
      currentPatient: patient,
      currentAdmission: admission._id,
    });

    const populated = await IPDAdmission.findById(admission._id)
      .populate("patient", "name patientId phone gender")
      .populate("admittingDoctor", "name role")
      .populate("bed", "bedNumber ward bedType dailyRate");

    return apiResponse.success(populated, "Patient admitted to IPD successfully", 201);
  } catch (error: any) {
    return apiResponse.error(error.message, 400);
  }
}

export const GET = requireAuth(getIPDAdmissions);
export const POST = requireAuth(createIPDAdmission);
