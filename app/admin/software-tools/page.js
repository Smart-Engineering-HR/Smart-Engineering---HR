"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, PlusCircle, Trash2, Edit, Save, Eye, User, Mail, Phone, FileText } from "lucide-react";

export default function SoftwareToolsAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [tools, setTools] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("tools-list");

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "", category: "prompt-engineering", badge: "أداة حصرية",
    aiPlatform: "ChatGPT / Claude 3", description: "", secretPrompt: "",
    placeholdersInput: "", logic: "", variablesInput: "", validation: "", template: ""
  });

  // استدعاء البيانات المباشرة من الـ API
  const fetchData = async () => {
    try {
      const resTools = await fetch("/api/software-tools");
      const dataTools = await resTools.json();
      if (dataTools.success) setTools(dataTools.data);

      const resReqs = await fetch("/api/software-tools?type=requests");
      const dataReqs = await resReqs.json();
      if (dataReqs.success) setRequests(dataReqs.data);
    } catch (err) {
      console.error("فشل جلب البيانات من الـ API:", err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("smart_admin_logged_in") === "true") {
      setIsLoggedIn(true);
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // حفظ ونشر الأدوات المحدثة
  const handleSaveTool = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("الرجاء تعبئة الحقول الأساسية.");
      return;
    }

    const placeholders = formData.placeholdersInput ? formData.placeholdersInput.split(",").map(p => p.trim()) : [];
    let variables = [];
    if (formData.variablesInput) {
      try { variables = JSON.parse(formData.variablesInput); } catch (err) {}
    }

    const payload = {
      ...formData,
      placeholders,
      variables
    };

    const method = editingId ? "PUT" : "POST";
    if (editingId) payload.id = editingId;

    const res = await fetch("/api/software-tools", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (result.success) {
      alert(editingId ? "تم تحديث الأداة وتزامنها مع الجمهور." : "تم نشر الأداة للجمهور بنجاح.");
      resetForm();
      fetchData();
      setActiveTab("tools-list");
    } else {
      alert("خطأ: " + result.error);
    }
  };

  const handleDeleteClick = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذه الأداة نهائياً من قائمة الجمهور؟")) {
      const res = await fetch(`/api/software-tools?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        alert("تم الحذف بنجاح.");
        fetchData();
      }
    }
  };

  const handleDeleteRequest = async (id) => {
    if (confirm("هل تريد أرشفة وحذف هذا الطلب؟")) {
      const res = await fetch(`/api/software-tools?id=${id}&type=request`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) fetchData();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "", category: "prompt-engineering", badge: "أداة حصرية",
      aiPlatform: "ChatGPT / Claude 3", description: "", secretPrompt: "",
      placeholdersInput: "", logic: "", variablesInput: "", validation: "", template: ""
    });
    setEditingId(null);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail === "admin@smartacademy.com" && loginPassword === "AdminPassword2026") {
      localStorage.setItem("smart_admin_logged_in", "true");
      setIsLoggedIn(true);
    } else {
      setLoginError("❌ البيانات خاطئة!");
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0a192f", direction: "rtl" }}>
        <form onSubmit={handleLoginSubmit} style={{ background: "#112240", padding: "40px", borderRadius: "10px", width: "100%", maxWidth: "400px" }}>
          <h2 style={{ color: "#64ffda", textAlign: "center" }}>🔐 تسجيل الدخول</h2>
          {loginError && <p style={{ color: "red", textAlign: "center" }}>{loginError}</p>}
          <input type="email" placeholder="الإيميل" required onChange={(e) => setLoginEmail(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px" }} />
          <input type="password" placeholder="كلمة السر" required onChange={(e) => setLoginPassword(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px" }} />
          <button type="submit" style={{ width: "100%", padding: "12px", background: "#64ffda", color: "#0a192f", fontWeight: "bold", border: "none", borderRadius: "5px", cursor: "pointer" }}>دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased rtl" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600/15 p-3 rounded-xl border border-red-500/30">
              <ShieldAlert className="h-7 w-7 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">لوحة تحكم برمجيات منصة الهندسة الذكية</h1>
              <p className="text-slate-400 text-xs">نشر الأدوات الحية واستقبال طلبات الجمهور المباشرة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => { resetForm(); setActiveTab("add-tool"); }} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5">
              <PlusCircle className="h-4 w-4" />
              <span>إدراج أداة جديدة</span>
            </button>
            <button onClick={() => window.open("/software-tools", "_blank")} className="bg-slate-800 border border-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>معاينة واجهة الجمهور ↗</span>
            </button>
          </div>
        </header>

        <div className="flex border-b border-slate-800 mb-6 gap-2">
          <button onClick={() => setActiveTab("tools-list")} className={`px-4 py-2 font-bold text-xs border-b-2 ${activeTab === "tools-list" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>
            الأدوات المنشورة للجمهور ({tools.length})
          </button>
          <button onClick={() => setActiveTab("add-tool")} className={`px-4 py-2 font-bold text-xs border-b-2 ${activeTab === "add-tool" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>
            {editingId ? "تعديل أداة" : "نشر أداة جديدة"}
          </button>
          <button onClick={() => setActiveTab("received-requests")} className={`px-4 py-2 font-bold text-xs border-b-2 ${activeTab === "received-requests" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>
            طلبات الأدوات المستلمة ({requests.length})
          </button>
        </div>

        {activeTab === "tools-list" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-800 text-slate-300 font-bold border-b border-slate-800">
                  <th className="p-4">اسم الأداة</th>
                  <th className="p-4">التصنيف</th>
                  <th className="p-4 text-center">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {tools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-slate-800/20">
                    <td className="p-4 font-bold text-white">{tool.title}</td>
                    <td className="p-4 text-slate-400">{tool.category}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => { setEditingId(tool.id); setFormData({...tool, placeholdersInput: tool.placeholders?.join(", ") || ""}); setActiveTab("add-tool"); }} className="p-1.5 text-blue-400 hover:text-white"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDeleteClick(tool.id)} className="p-1.5 text-red-400 hover:text-white"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "add-tool" && (
          <form onSubmit={handleSaveTool} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-w-3xl mx-auto">
            <input type="text" required name="title" value={formData.title} onChange={handleInputChange} placeholder="عنوان الأداة" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white" />
            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white">
              <option value="prompt-engineering">هندسة الأوامر الذكية</option>
              <option value="live-web-apps">تطبيقات الويب الحية</option>
              <option value="automation-software">برمجيات الأتمتة</option>
              <option value="ai-solutions">حلول الذكاء الاصطناعي</option>
            </select>
            <textarea rows="3" required name="description" value={formData.description} onChange={handleInputChange} placeholder="الوصف الفني" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"></textarea>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-xs"><Save className="h-4 w-4 inline ml-1" /> حفظ ونشر الأداة للجمهور</button>
          </form>
        )}

        {activeTab === "received-requests" && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {requests.map((req) => (
              <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative">
                <button onClick={() => handleDeleteRequest(req.id)} className="absolute left-4 top-4 text-red-400"><Trash2 className="h-4 w-4" /></button>
                <p className="text-xs font-bold text-blue-400 mb-1">{req.name} ({req.email} | {req.phone})</p>
                <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-850 mt-2">{req.details}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}