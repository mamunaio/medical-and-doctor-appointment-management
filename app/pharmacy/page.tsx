"use client";

import React, { useState, useEffect, useCallback } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  Pill, Package, PlusSquare, Clock, Search, Filter, 
  MoreVertical, Plus, ShoppingCart, CheckCircle2, 
  AlertTriangle, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "react-hot-toast";

const tabs = [
  { id: "dispense", label: "Dispense", icon: ShoppingCart },
  { id: "inventory", label: "Inventory", icon: Package },
];

export default function Pharmacy() {
  const { token, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("dispense");

  // Inventory State
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNewMedicineForm, setShowNewMedicineForm] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "", genericName: "", category: "Tablet", stock: 0, sellingPrice: 0, reorderLevel: 50
  });

  const [addStockId, setAddStockId] = useState<string | null>(null);
  const [addStockQty, setAddStockQty] = useState(0);

  // Dispense State
  const [searchPrescriptionId, setSearchPrescriptionId] = useState("");
  const [prescription, setPrescription] = useState<any>(null);
  const [dispenseItems, setDispenseItems] = useState<any[]>([]);
  const [dispensing, setDispensing] = useState(false);

  const fetchMedicines = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/medicines", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setMedicines(data.data || []);
      }
    } catch (err) {
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "inventory") {
      fetchMedicines();
    }
  }, [activeTab, fetchMedicines]);

  // Handle Inventory Creation
  const handleAddMedicine = async () => {
    if (!token) return;
    if (!newMed.name || !newMed.genericName) {
      toast.error("Please fill Name and Generic Name");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...newMed,
        stock: Number(newMed.stock),
        sellingPrice: Number(newMed.sellingPrice),
        reorderLevel: Number(newMed.reorderLevel),
      };
      const res = await fetch("/api/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Medicine added to inventory");
        setShowNewMedicineForm(false);
        setNewMed({ name: "", genericName: "", category: "Tablet", stock: 0, sellingPrice: 0, reorderLevel: 50 });
        fetchMedicines();
      } else {
        toast.error(data.message || "Failed to add medicine");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStock = async (id: string) => {
    if (!token || addStockQty <= 0) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/medicines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "update_stock", quantity: addStockQty }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Stock updated successfully");
        setAddStockId(null);
        setAddStockQty(0);
        fetchMedicines();
      } else {
        toast.error(data.message || "Failed to update stock");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Dispense Logic
  const handleSearchPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !searchPrescriptionId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/prescriptions?search=${searchPrescriptionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data?.data?.length > 0) {
        const found = data.data.data[0];
        setPrescription(found);
        
        // Load medicines info
        // Need to match prescription medicines with inventory to check stock & prices
        const currentMedicinesRes = await fetch("/api/medicines", { headers: { Authorization: `Bearer ${token}` } });
        const currentMedicinesData = await currentMedicinesRes.json();
        const inventory = currentMedicinesData.data || [];

        const items = found.medicines.map((m: any) => {
          // match by medicineId if present, else by name
          const invItem = m.medicineId 
            ? inventory.find((inv: any) => inv._id === m.medicineId)
            : inventory.find((inv: any) => inv.name.toLowerCase() === m.medicineName.toLowerCase());
          
          return {
            medicineId: invItem?._id || null,
            name: m.medicineName,
            requestedQty: m.quantity || 10, // fallback to 10 if not specified
            stock: invItem?.stock || 0,
            price: invItem?.sellingPrice || 0,
            isAvailable: !!invItem
          };
        });
        setDispenseItems(items);
      } else {
        toast.error("Prescription not found");
        setPrescription(null);
        setDispenseItems([]);
      }
    } catch (err) {
      toast.error("Failed to search prescription");
    } finally {
      setLoading(false);
    }
  };

  const handleDispenseQtyChange = (index: number, newQty: number) => {
    const updated = [...dispenseItems];
    updated[index].requestedQty = newQty;
    setDispenseItems(updated);
  };

  const calculateTotal = () => {
    return dispenseItems.reduce((sum, item) => sum + (item.price * item.requestedQty), 0);
  };

  const handleConfirmDispense = async () => {
    if (!token || !prescription) return;
    
    // Check if all items exist in DB
    const missingItems = dispenseItems.filter(i => !i.medicineId);
    if (missingItems.length > 0) {
      toast.error(`Cannot dispense. Missing from inventory: ${missingItems.map(i => i.name).join(', ')}`);
      return;
    }

    // Check stock
    const outOfStock = dispenseItems.filter(i => i.stock < i.requestedQty);
    if (outOfStock.length > 0) {
      toast.error(`Insufficient stock for: ${outOfStock.map(i => i.name).join(', ')}`);
      return;
    }

    setDispensing(true);
    try {
      const payload = {
        patient: prescription.patient._id,
        prescription: prescription._id,
        items: dispenseItems.map(i => ({
          medicine: i.medicineId,
          medicineName: i.name,
          quantity: i.requestedQty,
          unitPrice: i.price,
          totalPrice: i.price * i.requestedQty
        })),
        totalAmount: calculateTotal(),
        netAmount: calculateTotal(),
        paymentMethod: "cash"
      };

      const res = await fetch("/api/pharmacy-dispense", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Medicines dispensed successfully");
        setPrescription(null);
        setSearchPrescriptionId("");
        setDispenseItems([]);
      } else {
        toast.error(data.message || "Failed to dispense");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setDispensing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Pharmacy Management" />
        
        <main className="p-6">
          <div className="bg-white p-2 rounded-2xl border border-border-hms flex gap-2 mb-6 overflow-x-auto no-scrollbar shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 min-w-[150px] flex items-center justify-center gap-3 py-3 px-6 rounded-xl text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-teal-hms text-white shadow-lg shadow-teal-hms/20" 
                    : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "dispense" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-border-hms shadow-sm">
                  <h2 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tighter flex items-center gap-3">
                    <Search className="w-6 h-6 text-teal-hms" />
                    Dispense Medicine
                  </h2>
                  <form onSubmit={handleSearchPrescription} className="mb-8">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Search Prescription ID</label>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={searchPrescriptionId}
                        onChange={(e) => setSearchPrescriptionId(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-100 rounded-xl py-4 px-4 text-sm font-black focus:ring-2 focus:ring-teal-hms outline-none" 
                        placeholder="e.g. RX-2024-XXXX" 
                      />
                      <button 
                        type="submit"
                        disabled={loading || !searchPrescriptionId}
                        className="bg-teal-hms text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                      </button>
                    </div>
                  </form>

                  {prescription && (
                    <>
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Prescription Details</h3>
                          <span className="text-[10px] font-bold text-teal-hms bg-teal-hms/10 px-2 py-1 rounded-full uppercase">ID: {prescription.prescriptionId}</span>
                        </div>
                        {dispenseItems.length === 0 ? (
                          <p className="text-sm text-gray-500 font-bold">No medicines found in this prescription.</p>
                        ) : (
                          <div className="space-y-4">
                            {dispenseItems.map((item, i) => {
                              const isOut = !item.isAvailable || item.stock === 0;
                              const isLow = item.stock > 0 && item.stock < item.requestedQty;
                              return (
                                <div key={i} className={cn("flex items-center justify-between bg-white p-4 rounded-xl border", isOut ? "border-red-100 bg-red-50/30" : "border-gray-100")}>
                                  <div className="flex-1">
                                    <p className="text-sm font-black text-gray-900">{item.name}</p>
                                    <div className="flex gap-4 mt-1">
                                      <span className="text-[10px] font-bold text-gray-400 uppercase">Prescribed Qty: {item.requestedQty}</span>
                                      {item.isAvailable ? (
                                        <span className={cn(
                                          "text-[10px] font-black uppercase",
                                          isOut ? "text-emergency-red" : isLow ? "text-warning-amber" : "text-medical-green"
                                        )}>
                                          Stock: {item.stock}
                                        </span>
                                      ) : (
                                        <span className="text-[10px] font-black uppercase text-emergency-red">Not in Inventory</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                    <div className="text-right">
                                      <p className="text-xs font-black text-gray-900">৳{(item.price * item.requestedQty).toFixed(2)}</p>
                                      <p className="text-[8px] text-gray-400 font-bold uppercase">৳{item.price} / unit</p>
                                    </div>
                                    <input 
                                      type="number" 
                                      value={item.requestedQty} 
                                      onChange={(e) => handleDispenseQtyChange(i, Number(e.target.value))}
                                      min={0}
                                      className="w-16 bg-gray-50 border border-gray-100 rounded-lg py-2 px-2 text-center text-sm font-black focus:ring-2 focus:ring-teal-hms outline-none" 
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center bg-teal-hms text-white p-6 rounded-2xl shadow-lg shadow-teal-hms/20">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Payable Amount</p>
                          <p className="text-3xl font-black">৳{calculateTotal().toFixed(2)}</p>
                        </div>
                        <button 
                          onClick={handleConfirmDispense}
                          disabled={dispensing || dispenseItems.length === 0}
                          className="bg-white text-teal-hms px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3 shadow-xl disabled:opacity-50"
                        >
                          {dispensing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />} 
                          Confirm Dispense
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {prescription && prescription.patient && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-border-hms shadow-sm">
                    <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Patient Quick Info</h3>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${prescription.patient.name}`} className="w-full h-full object-cover" alt="Patient" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-gray-900 leading-tight">{prescription.patient.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{prescription.patient.patientId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-white rounded-2xl border border-border-hms overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border-hms flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Inventory List</h3>
                  <button 
                    onClick={() => setShowNewMedicineForm(!showNewMedicineForm)}
                    className="bg-teal-hms text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-teal-hms/20 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> {showNewMedicineForm ? "Cancel" : "Add New Medicine"}
                  </button>
                </div>

                {showNewMedicineForm && (
                  <div className="p-6 bg-gray-50 border-b border-gray-100 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Medicine Name</label>
                        <input type="text" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-hms outline-none" placeholder="e.g. Napa Extend" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Generic Name</label>
                        <input type="text" value={newMed.genericName} onChange={e => setNewMed({...newMed, genericName: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-hms outline-none" placeholder="e.g. Paracetamol" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Category / Form</label>
                        <select value={newMed.category} onChange={e => setNewMed({...newMed, category: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-hms outline-none">
                          <option>Tablet</option>
                          <option>Capsule</option>
                          <option>Syrup</option>
                          <option>Injection</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Selling Price (BDT)</label>
                        <input type="number" value={newMed.sellingPrice} onChange={e => setNewMed({...newMed, sellingPrice: Number(e.target.value)})} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-hms outline-none" />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Initial Stock</label>
                        <input type="number" value={newMed.stock} onChange={e => setNewMed({...newMed, stock: Number(e.target.value)})} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-hms outline-none" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Reorder Level</label>
                        <input type="number" value={newMed.reorderLevel} onChange={e => setNewMed({...newMed, reorderLevel: Number(e.target.value)})} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-hms outline-none" />
                      </div>
                    </div>
                    <button onClick={handleAddMedicine} disabled={submitting} className="mt-6 bg-teal-hms text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-md">
                      {submitting ? "Saving..." : "Save Medicine"}
                    </button>
                  </div>
                )}

                <div className="overflow-x-auto min-h-[300px]">
                  {loading ? (
                    <div className="flex justify-center items-center h-48">
                      <Loader2 className="w-8 h-8 text-teal-hms animate-spin" />
                    </div>
                  ) : medicines.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-bold">No medicines in inventory.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Medicine</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reorder Level</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                          <th className="px-6 py-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {medicines.map((row) => {
                          const isOut = row.stock === 0;
                          const isLow = row.stock > 0 && row.stock <= row.reorderLevel;
                          return (
                            <tr key={row._id} className={cn(
                              "hover:bg-gray-50 transition-all group",
                              isOut && "bg-red-50/50",
                              isLow && "bg-amber-50/50"
                            )}>
                              <td className="px-6 py-5">
                                <p className="text-sm font-bold text-gray-900">{row.name}</p>
                                <p className="text-[10px] text-gray-400 font-medium italic">{row.genericName}</p>
                              </td>
                              <td className="px-6 py-5">
                                <span className="text-[10px] font-bold text-teal-hms bg-teal-hms/10 px-2 py-0.5 rounded-full uppercase">{row.category}</span>
                              </td>
                              <td className="px-6 py-5">
                                {addStockId === row._id ? (
                                  <div className="flex items-center gap-2">
                                    <input type="number" value={addStockQty} onChange={e=>setAddStockQty(Number(e.target.value))} className="w-16 border rounded p-1 text-xs outline-none" />
                                    <button onClick={() => handleUpdateStock(row._id)} className="bg-teal-hms text-white px-2 py-1 rounded text-[10px] font-bold">Add</button>
                                    <button onClick={() => setAddStockId(null)} className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-[10px] font-bold">Cancel</button>
                                  </div>
                                ) : (
                                  <p className={cn(
                                    "text-sm font-black",
                                    isOut ? "text-emergency-red" : isLow ? "text-warning-amber" : "text-gray-900"
                                  )}>{row.stock} <span className="text-[10px] font-bold text-gray-400">units</span></p>
                                )}
                              </td>
                              <td className="px-6 py-5 text-sm font-bold text-gray-400">{row.reorderLevel}</td>
                              <td className="px-6 py-5 text-sm font-black text-gray-900">৳{row.sellingPrice?.toFixed(2)}</td>
                              <td className="px-6 py-5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => {setAddStockId(row._id); setAddStockQty(0);}} className="p-2 hover:bg-teal-hms/10 text-gray-400 hover:text-teal-hms rounded-lg transition-colors" title="Add Stock">
                                    <PlusSquare className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
