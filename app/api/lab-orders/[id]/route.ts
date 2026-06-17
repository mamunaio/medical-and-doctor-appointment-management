import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import LabOrder from "@/models/LabOrder";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";

async function updateLabOrder(req: NextRequest, user: AuthUser, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const order = await LabOrder.findById(id);
    if (!order) {
      return apiResponse.error("Lab order not found", 404);
    }

    // Handle overall status updates (e.g. from UI "Collect Sample" button)
    if (body.overallStatus) {
      order.overallStatus = body.overallStatus;
      // Also update individual tests if it makes sense, e.g. marking all as processing
      if (body.overallStatus === "processing") {
        order.tests.forEach((t: any) => {
          if (t.status === "pending") t.status = "processing";
        });
      }
    }

    // Handle single test sample collection
    if (body.action === "collect_sample" && body.testId) {
      const testIndex = order.tests.findIndex((t: any) => t._id.toString() === body.testId);
      if (testIndex > -1) {
        order.tests[testIndex].status = "processing";
        order.tests[testIndex].sampleCollectedAt = new Date();
        order.tests[testIndex].collectedBy = user.userId;
      }
      
      // Update overall status if all tests are processing
      const allProcessing = order.tests.every((t: any) => t.status === "processing" || t.status === "completed");
      if (allProcessing && order.overallStatus === "pending") {
        order.overallStatus = "processing";
      }
    }

    // Handle result entry
    if (body.action === "enter_result" && body.testId && body.results) {
      const { parameters, interpretation } = body.results;
      
      order.results.push({
        testId: body.testId,
        parameters,
        interpretation,
        resultDate: new Date(),
        enteredBy: user.userId
      });

      // Mark the specific test as completed
      const testIndex = order.tests.findIndex((t: any) => t._id.toString() === body.testId || t.testId?.toString() === body.testId);
      if (testIndex > -1) {
        order.tests[testIndex].status = "completed";
      }

      // Check if all tests are completed
      const allCompleted = order.tests.every((t: any) => t.status === "completed");
      if (allCompleted) {
        order.overallStatus = "completed";
      }
    }

    await order.save();

    const populated = await LabOrder.findById(id)
      .populate("patient", "name patientId phone")
      .populate("orderedBy", "name role");

    return apiResponse.success(populated, "Lab order updated successfully");
  } catch (error: any) {
    return apiResponse.error(error.message, 400);
  }
}

export const PATCH = requireAuth(updateLabOrder);
