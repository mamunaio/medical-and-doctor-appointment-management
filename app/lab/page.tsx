"use client";

import React, { useState, useEffect, useCallback } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  FlaskConical, ClipboardList, FileText, Settings, Search, Filter, 
  MoreVertical, Plus, Beaker, CheckCircle2, Clock, ArrowRight, 
  TrendingUp, Download, Eye, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "react-hot-toast";

const tabs = [
  { id: "orders", label: "Lab Orders", icon: ClipboardList },
  { id: "entry", label: "Result Entry", icon: Beaker },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "catalog", label: "Test Catalog", icon: Settings },
];

export default function Laboratory() {
  const { token, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("orders");

  const [orders, setOrders] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Result Entry State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedTestId, setSelectedTestId] = useState<string>("");
  const [resultValues, setResultValues] = useState<any>({});
  const [interpretation, setInterpretation] = useState("");

  // New Test Catalog State
  const [showNewTestForm, setShowNewTestForm] = useState(false);
  const [newTest, setNewTest] = useState({
    testName: "", testCode: "", category: "Hematology", price: "", sampleType: "",
    parameters: [{ name: "", unit: "", normalRange: { male: "", female: "", child: "" } }]
  });

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [ordersRes, testsRes] = await Promise.all([
        fetch("/api/lab-orders", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/lab-tests", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const [ordersData, testsData] = await Promise.all([
        ordersRes.json(),
        testsRes.json()
      ]);

      if (ordersData.success) setOrders(ordersData.data || []);
      if (testsData.success) setTests(testsData.data || []);

    } catch (err) {
      toast.error("Failed to fetch lab data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived state for orders
  const pendingSamples = orders.filter(o => o.overallStatus === "pending").length;
  const processingSamples = orders.filter(o => o.overallStatus === "processing").length;
  const readyReports = orders.filter(o => o.overallStatus === "completed").length;
  const urgentOrders = orders.filter(o => o.priority === "urgent" || o.priority === "stat").length;

  const handleCollectSample = async (orderId: string, testId: string) => {
    if (!token) return;
    setActionLoading(`${orderId}-${testId}`);
    try {
      const res = await fetch(`/api/lab-orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "collect_sample", testId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Sample collected successfully");
        fetchData();
      } else {
        toast.error(data.message || "Failed to collect sample");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateTest = async () => {
    if (!token) return;
    if (!newTest.testName || !newTest.testCode || !newTest.price) {
      toast.error("Please fill required fields (Name, Code, Price)");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...newTest,
        price: Number(newTest.price),
        sampleType: newTest.sampleType ? [newTest.sampleType] : [],
      };
      const res = await fetch(`/api/lab-tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Test created successfully");
        setShowNewTestForm(false);
        setNewTest({
          testName: "", testCode: "", category: "Hematology", price: "", sampleType: "",
          parameters: [{ name: "", unit: "", normalRange: { male: "", female: "", child: "" } }]
        });
        fetchData();
      } else {
        toast.error(data.message || "Failed to create test");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const loadResultEntry = (order: any, test: any) => {
    setSelectedOrder(order);
    setSelectedTestId(test._id);
    setResultValues({});
    setInterpretation("");
    setActiveTab("entry");
  };

  const getTestParameters = (testRefId: string) => {
    // Find the test from the catalog to get the parameters
    const catalogTest = tests.find(t => t._id === testRefId);
    return catalogTest?.parameters || [];
  };

  const handleSubmitResult = async () => {
    if (!token || !selectedOrder || !selectedTestId) return;
    setSubmitting(true);
    try {
      // Format results based on parameters
      const parameters = getTestParameters(selectedOrder.tests.find((t: any) => t._id === selectedTestId)?.testId).map((p: any) => {
        const val = resultValues[p.name] || "";
        // Basic flagging logic (can be improved)
        let flag = "normal";
        const numericVal = parseFloat(val);
        if (!isNaN(numericVal)) {
           // simple assumption: normalRange.male has format "10 - 20"
           const rangeParts = p.normalRange?.male?.split("-").map((s: string) => parseFloat(s.trim()));
           if (rangeParts && rangeParts.length === 2) {
              if (numericVal < rangeParts[0]) flag = "low";
              if (numericVal > rangeParts[1]) flag = "high";
           }
        }
        return {
          name: p.name,
          value: val,
          unit: p.unit,
          normalRange: p.normalRange?.male || "", // Simplification
          flag
        };
      });

      const res = await fetch(`/api/lab-orders/${selectedOrder._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          action: "enter_result", 
          testId: selectedTestId,
          results: { parameters, interpretation } 
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Results saved successfully");
        setSelectedOrder(null);
        setSelectedTestId("");
        setActiveTab("orders");
        fetchData();
      } else {
        toast.error(data.message || "Failed to save results");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Diagnostic Laboratory" />
        
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

          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Pending Samples", val: pendingSamples.toString(), color: "amber" },
                  { label: "Processing", val: processingSamples.toString(), color: "blue" },
                  { label: "Ready Reports", val: readyReports.toString(), color: "green" },
                  { label: "Urgent (STAT)", val: urgentOrders.toString(), color: "red" },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-border-hms shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                    <p className={cn(
                      "text-3xl font-black",
                      s.color === "amber" && "text-warning-amber",
                      s.color === "blue" && "text-medical-blue",
                      s.color === "green" && "text-medical-green",
                      s.color === "red" && "text-emergency-red",
                    )}>{s.val}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-border-hms overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border-hms flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search orders or patients..." className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-teal-hms outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-gray-50 text-gray-600 px-4 py-2.5 rounded-xl text-xs font-bold border border-gray-100 flex items-center gap-2">
                      <Filter className="w-4 h-4" /> Filter
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto min-h-[300px]">
                  {loading ? (
                    <div className="flex justify-center items-center h-48">
                      <Loader2 className="w-8 h-8 text-teal-hms animate-spin" />
                    </div>
                  ) : orders.filter(o => o.overallStatus !== "completed").length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                      <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-bold">No pending lab orders found.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order #</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tests</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                          <th className="px-6 py-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.filter(o => o.overallStatus !== "completed").map((row) => (
                          <React.Fragment key={row._id}>
                            {row.tests.map((test: any) => (
                              <tr key={test._id} className="hover:bg-gray-50 transition-all group">
                                <td className="px-6 py-5 text-sm font-black text-gray-900">{row.orderId}</td>
                                <td className="px-6 py-5">
                                  <p className="text-sm font-bold text-gray-900">{row.patient?.name}</p>
                                  <p className="text-[10px] text-gray-400 font-medium">ID: {row.patient?.patientId}</p>
                                </td>
                                <td className="px-6 py-5 text-sm text-gray-600 font-medium">{test.testName}</td>
                                <td className="px-6 py-5">
                                  <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    row.priority === "urgent" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                                  )}>
                                    {row.priority}
                                  </span>
                                </td>
                                <td className="px-6 py-5">
                                  <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    test.status === "pending" && "bg-warning-amber/10 text-warning-amber",
                                    test.status === "processing" && "bg-purple-hms/10 text-purple-hms",
                                    test.status === "completed" && "bg-medical-green/10 text-medical-green",
                                  )}>
                                    {test.status}
                                  </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                  {test.status === "pending" && (
                                    <button 
                                      onClick={() => handleCollectSample(row._id, test._id)}
                                      disabled={actionLoading === `${row._id}-${test._id}`}
                                      className="text-xs font-black text-teal-hms hover:underline uppercase tracking-widest disabled:opacity-50"
                                    >
                                      {actionLoading === `${row._id}-${test._id}` ? "Processing..." : "Collect Sample"}
                                    </button>
                                  )}
                                  {test.status === "processing" && (
                                    <button 
                                      onClick={() => loadResultEntry(row, test)}
                                      className="text-xs font-black text-medical-blue hover:underline uppercase tracking-widest"
                                    >
                                      Enter Result
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "entry" && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              {!selectedOrder ? (
                <div className="bg-white p-20 text-center rounded-3xl border border-border-hms shadow-sm">
                  <Beaker className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-gray-900 mb-2">No Order Selected</h3>
                  <p className="text-gray-500 font-bold mb-6">Go to the Lab Orders tab and click "Enter Result" on a processing test.</p>
                  <button 
                    onClick={() => setActiveTab("orders")}
                    className="bg-teal-hms text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-teal-hms/20"
                  >
                    View Orders
                  </button>
                </div>
              ) : (() => {
                const testObj = selectedOrder.tests.find((t: any) => t._id === selectedTestId);
                const parameters = getTestParameters(testObj?.testId);

                return (
                  <div className="bg-white p-8 rounded-3xl border border-border-hms shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Result Entry</h2>
                      <div className="bg-teal-hms/5 px-4 py-2 rounded-xl border border-teal-hms/10 flex items-center gap-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID:</span>
                        <span className="text-sm font-black text-teal-hms">{selectedOrder.orderId}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</p>
                        <p className="text-lg font-black text-gray-900">{selectedOrder.patient?.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Test Name</p>
                        <p className="text-lg font-black text-teal-hms">{testObj?.testName}</p>
                      </div>
                    </div>

                    {parameters.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4 px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 rounded-lg">
                          <div className="col-span-1">Parameter</div>
                          <div>Value</div>
                          <div>Unit</div>
                          <div>Normal Range</div>
                        </div>
                        {parameters.map((p: any, i: number) => (
                          <div key={i} className="grid grid-cols-4 gap-4 px-4 py-3 items-center border-b border-gray-100 last:border-0 group hover:bg-gray-50 transition-colors">
                            <div className="text-sm font-bold text-gray-900">{p.name}</div>
                            <div>
                              <input 
                                type="text" 
                                value={resultValues[p.name] || ""}
                                onChange={(e) => setResultValues({ ...resultValues, [p.name]: e.target.value })}
                                placeholder="Enter value"
                                className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm font-black focus:ring-2 focus:ring-teal-hms outline-none"
                              />
                            </div>
                            <div className="text-xs font-bold text-gray-400 uppercase">{p.unit}</div>
                            <div className="text-xs font-bold text-gray-500">{p.normalRange?.male}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 text-amber-700 rounded-lg text-sm font-bold mb-4">
                        This test has no predefined parameters. You can write the overall result in the notes below.
                      </div>
                    )}

                    <div className="mt-10">
                      <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-widest">Lab Interpretation / Notes</label>
                      <textarea 
                        value={interpretation}
                        onChange={(e) => setInterpretation(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-teal-hms h-24 resize-none outline-none" 
                        placeholder="Enter comments about patient's results here..."
                      ></textarea>
                    </div>

                    <div className="flex gap-4 mt-10">
                      <button 
                        onClick={() => { setSelectedOrder(null); setActiveTab("orders"); }}
                        className="flex-1 bg-white border-2 border-gray-100 text-gray-600 font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSubmitResult}
                        disabled={submitting}
                        className="flex-[2] bg-teal-hms text-white font-black py-4 rounded-xl shadow-lg shadow-teal-hms/20 hover:scale-[1.01] transition-all uppercase tracking-widest text-xs disabled:opacity-50 flex justify-center items-center gap-2"
                      >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save & Publish Result
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === "reports" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {orders.filter(o => o.overallStatus === "completed").length === 0 ? (
                <div className="col-span-full text-center py-20 text-gray-400 bg-white rounded-3xl border border-gray-100">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-bold">No completed reports found.</p>
                </div>
              ) : (
                orders.filter(o => o.overallStatus === "completed").map((order) => (
                  <div key={order._id} className="bg-white p-6 rounded-2xl border border-border-hms shadow-sm group hover:border-teal-hms transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-teal-hms/10 text-teal-hms rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black text-medical-green bg-medical-green/10 px-2 py-1 rounded-full uppercase">Ready</span>
                    </div>
                    <h4 className="text-lg font-black text-gray-900 mb-1">{order.tests.map((t:any) => t.testName).join(", ")}</h4>
                    <p className="text-xs text-gray-500 mb-4">Patient: {order.patient?.name} • {new Date(order.orderDate).toLocaleDateString()}</p>
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                      <button className="text-xs font-black text-teal-hms flex items-center gap-2 hover:underline">
                        <Eye className="w-4 h-4" /> View Data
                      </button>
                      <button className="text-xs font-black text-gray-400 flex items-center gap-2 hover:text-gray-900">
                        <Download className="w-4 h-4" /> Download PDF
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "catalog" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-border-hms shadow-sm">
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Test Catalog</h3>
                <button 
                  onClick={() => setShowNewTestForm(!showNewTestForm)}
                  className="bg-teal-hms text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-teal-hms/20 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> {showNewTestForm ? "Cancel" : "Add New Test"}
                </button>
              </div>

              {showNewTestForm && (
                <div className="bg-white p-8 rounded-3xl border border-teal-hms shadow-sm animate-in slide-in-from-top-4">
                  <h4 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest">Create New Lab Test</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Test Name</label>
                      <input type="text" value={newTest.testName} onChange={e => setNewTest({...newTest, testName: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-hms outline-none" placeholder="e.g. Complete Blood Count" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Test Code</label>
                      <input type="text" value={newTest.testCode} onChange={e => setNewTest({...newTest, testCode: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-hms outline-none" placeholder="e.g. CBC-01" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Category</label>
                      <select value={newTest.category} onChange={e => setNewTest({...newTest, category: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-hms outline-none">
                        <option>Hematology</option>
                        <option>Biochemistry</option>
                        <option>Immunology</option>
                        <option>Microbiology</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Price (BDT)</label>
                      <input type="number" value={newTest.price} onChange={e => setNewTest({...newTest, price: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-hms outline-none" placeholder="e.g. 500" />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Test Parameters (Optional)</label>
                    {newTest.parameters.map((param, index) => (
                      <div key={index} className="flex gap-2 mb-2 items-center">
                        <input type="text" placeholder="Parameter Name (e.g. Hemoglobin)" value={param.name} onChange={e => {
                          const newParams = [...newTest.parameters];
                          newParams[index].name = e.target.value;
                          setNewTest({...newTest, parameters: newParams});
                        }} className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-teal-hms outline-none" />
                        <input type="text" placeholder="Unit (e.g. g/dL)" value={param.unit} onChange={e => {
                          const newParams = [...newTest.parameters];
                          newParams[index].unit = e.target.value;
                          setNewTest({...newTest, parameters: newParams});
                        }} className="w-24 bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-teal-hms outline-none" />
                        <input type="text" placeholder="Normal Range" value={param.normalRange.male} onChange={e => {
                          const newParams = [...newTest.parameters];
                          newParams[index].normalRange.male = e.target.value;
                          setNewTest({...newTest, parameters: newParams});
                        }} className="w-32 bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-teal-hms outline-none" />
                        {index === newTest.parameters.length - 1 && (
                          <button onClick={() => setNewTest({...newTest, parameters: [...newTest.parameters, {name:"", unit:"", normalRange: {male:"", female:"", child:""}}]})} className="bg-gray-100 p-2.5 rounded-xl hover:bg-gray-200">
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={handleCreateTest}
                    disabled={submitting}
                    className="w-full bg-teal-hms text-white font-black py-4 rounded-xl shadow-lg shadow-teal-hms/20 uppercase tracking-widest text-xs disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Save Test to Catalog"}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {tests.map(test => (
                  <div key={test._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-teal-hms bg-teal-hms/10 px-2 py-1 rounded-md uppercase tracking-wider">{test.testCode}</span>
                      <span className="text-sm font-black text-gray-900">৳ {test.price}</span>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1 leading-tight">{test.testName}</h4>
                    <p className="text-xs text-gray-500 font-medium mb-3">{test.category}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest border-t border-gray-50 pt-3">
                      {test.parameters?.length || 0} Parameters
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
