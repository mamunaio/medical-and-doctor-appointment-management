import Patient from "@/models/Patient";
import Appointment from "@/models/Appointment";
import Invoice from "@/models/Invoice";
import LabOrder from "@/models/LabOrder";
import Prescription from "@/models/Prescription";
import IPDAdmission from "@/models/IPDAdmission";
import EmergencyCase from "@/models/EmergencyCase";
import InsuranceClaim from "@/models/InsuranceClaim";
import dbConnect from "./mongodb";

export const generateId = async (model: any, prefix: string) => {
  await dbConnect();
  const count = await model.countDocuments();
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${(count + 1).toString().padStart(5, '0')}`;
};

export const autoId = {
  generatePatientId: () => generateId(Patient, 'PAT'),
  generateAppointmentId: () => generateId(Appointment, 'APT'),
  generateInvoiceId: () => generateId(Invoice, 'INV'),
  generateLabOrderId: () => generateId(LabOrder, 'LAB'),
  generatePrescriptionId: () => generateId(Prescription, 'RX'),
  generateAdmissionId: () => generateId(IPDAdmission, 'IPD'),
  generateEmergencyId: () => generateId(EmergencyCase, 'EMR'),
  generateClaimId: () => generateId(InsuranceClaim, 'CLM'),
};
