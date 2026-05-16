import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Patient from "@/models/Patient";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";
import { autoId } from "@/lib/autoId";
import { validateRequest, appointmentSchema } from "@/lib/validators";

async function getAppointments(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const doctorId = searchParams.get("doctorId");
    
    let query: any = {};
    if (user.role === 'doctor') query.doctor = user.userId;
    if (user.role === 'patient') query.patient = user.userId;
    if (doctorId && user.role !== 'doctor') query.doctor = doctorId;
    
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "name patientId phone")
      .populate("doctor", "name role")
      .sort({ date: 1, timeSlot: 1 });
      
    return apiResponse.success(appointments);
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

async function createAppointment(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const body = await req.json();

    const { data, error } = validateRequest(appointmentSchema, body);
    if (error) return apiResponse.error("Validation failed", 400);

    // Check availability (basic)
    const existing = await Appointment.findOne({ 
      doctor: data.doctorId, 
      date: new Date(data.date), 
      timeSlot: data.timeSlot,
      status: { $nin: ['cancelled'] }
    });
    if (existing) return apiResponse.error("This slot is already booked", 400);

    data.appointmentId = await autoId.generateAppointmentId();
    data.bookedBy = user.userId;

    const appointment = await Appointment.create(data);
    return apiResponse.success(appointment, "Appointment booked successfully", 201);
  } catch (error: any) {
    return apiResponse.error(error.message, 400);
  }
}

export const GET = requireAuth(getAppointments);
export const POST = requireAuth(createAppointment);
