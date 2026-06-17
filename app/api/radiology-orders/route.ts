import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import RadiologyOrder from "@/models/RadiologyOrder";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";
import { autoId } from "@/lib/autoId";

async function getRadiologyOrders(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");
    const appointmentId = searchParams.get("appointmentId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query: any = {};
    if (patientId) query.patient = patientId;
    if (appointmentId) query.appointment = appointmentId;

    const skip = (page - 1) * limit;
    const total = await RadiologyOrder.countDocuments(query);
    const orders = await RadiologyOrder.find(query)
      .populate("patient", "name patientId phone")
      .populate("orderedBy", "name role")
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit);

    return apiResponse.paginate(orders, total, page, limit);
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

async function createRadiologyOrder(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const body = await req.json();

    const { patient, studies, priority, clinicalHistory, reasonForExam, notes, appointment, medicalRecord } = body;

    if (!patient || !studies || !Array.isArray(studies) || studies.length === 0) {
      return apiResponse.error("Patient and at least one study are required", 400);
    }

    const orderId = await autoId.generateRadiologyOrderId();

    const order = await RadiologyOrder.create({
      orderId,
      patient,
      orderedBy: user.userId,
      appointment: appointment || undefined,
      medicalRecord: medicalRecord || undefined,
      orderDate: new Date(),
      priority: priority || "routine",
      studies: studies.map((s: any) => ({
        testName: s.testName,
        modality: s.modality || "other",
        bodyPart: s.bodyPart || undefined,
        instructions: s.instructions || undefined,
        contrast: s.contrast || false,
        status: "pending",
      })),
      clinicalHistory: clinicalHistory || undefined,
      reasonForExam: reasonForExam || undefined,
      overallStatus: "pending",
      notes: notes || undefined,
    });

    const populated = await RadiologyOrder.findById(order._id)
      .populate("patient", "name patientId phone")
      .populate("orderedBy", "name role");

    return apiResponse.success(populated, "Radiology order created successfully", 201);
  } catch (error: any) {
    return apiResponse.error(error.message, 400);
  }
}

export const GET = requireAuth(getRadiologyOrders);
export const POST = requireAuth(createRadiologyOrder);
