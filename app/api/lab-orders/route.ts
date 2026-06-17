import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import LabOrder from "@/models/LabOrder";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";
import { autoId } from "@/lib/autoId";

async function getLabOrders(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query: any = {};
    if (patientId) query.patient = patientId;

    const skip = (page - 1) * limit;
    const total = await LabOrder.countDocuments(query);
    const orders = await LabOrder.find(query)
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

async function createLabOrder(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const body = await req.json();

    const { patient, tests, priority, notes, prescription } = body;

    if (!patient || !tests || !Array.isArray(tests) || tests.length === 0) {
      return apiResponse.error("Patient and at least one test are required", 400);
    }

    const orderId = await autoId.generateLabOrderId();

    const totalAmount = tests.reduce((sum: number, t: any) => sum + (t.price || 0), 0);

    const order = await LabOrder.create({
      orderId,
      patient,
      orderedBy: user.userId,
      prescription: prescription || undefined,
      orderDate: new Date(),
      priority: priority || "routine",
      tests: tests.map((t: any) => ({
        testId: t.testId || undefined,
        testName: t.testName,
        testCode: t.testCode,
        price: t.price || 0,
        status: "pending",
        sampleType: t.sampleType || undefined,
      })),
      overallStatus: "pending",
      notes: notes || undefined,
      totalAmount,
    });

    const populated = await LabOrder.findById(order._id)
      .populate("patient", "name patientId phone")
      .populate("orderedBy", "name role");

    return apiResponse.success(populated, "Lab order created successfully", 201);
  } catch (error: any) {
    return apiResponse.error(error.message, 400);
  }
}

export const GET = requireAuth(getLabOrders);
export const POST = requireAuth(createLabOrder);
