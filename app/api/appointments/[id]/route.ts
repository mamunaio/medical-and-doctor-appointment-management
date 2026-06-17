import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";

async function updateAppointment(
  req: NextRequest,
  user: AuthUser,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await dbConnect();
    const resolvedParams = await props.params;
    const { id } = resolvedParams;
    const body = await req.json();
    const { status, cancelReason } = body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return apiResponse.error("Appointment not found", 404);
    }

    // Role checks
    if (user.role === 'patient' && appointment.patient.toString() !== user.userId) {
      return apiResponse.error("Unauthorized", 403);
    }

    const updates: any = {};

    if (status) {
      updates.status = status;
      
      if (status === 'waiting' && appointment.status !== 'waiting') {
        updates.checkInTime = new Date();
      } else if (status === 'in_consultation' && appointment.status !== 'in_consultation') {
        updates.consultStartTime = new Date();
      } else if (status === 'completed' && appointment.status !== 'completed') {
        updates.consultEndTime = new Date();
      } else if (status === 'cancelled' && appointment.status !== 'cancelled') {
        updates.cancelledBy = user.userId;
        updates.cancelledAt = new Date();
        if (cancelReason) {
          updates.cancelReason = cancelReason;
        }
      }
    }

    // Allow updating other fields as needed
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.chiefComplaint !== undefined) updates.chiefComplaint = body.chiefComplaint;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    return apiResponse.success(updatedAppointment, "Appointment updated successfully");
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

export const PATCH = requireAuth(updateAppointment);
export const PUT = requireAuth(updateAppointment);
