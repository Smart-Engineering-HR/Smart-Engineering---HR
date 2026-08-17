"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, PlusCircle, Trash2, Edit, Save, Eye, Layers, User, Mail, Phone, FileText, CheckCircle2, Sliders } from "lucide-react";

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
    title: "",
    category: "prompt-engineering",
    stage: "design",
    badge: "مجانية",
    aiPlatform: "ChatGPT / Claude 3",
    description: "",
    secretPrompt: "",
    placeholdersInput: "input_area, input_price",
    logic: "",
    variablesInput: "",
    validation: "",
    template: ""
  });

  const fetchData = async () => {
    try {
      const resTools = await fetch("/api/software-tools");
      const dataTools = await resTools.json();
      if (dataTools.success) setTools(dataTools.data);

      const resReqs = await fetch("/api/software-tools?type=requests");
      const dataReqs = await resReqs.json();
      if (dataReqs.success) setRequests(dataReqs.data);
    } catch (err) {
      console.error("خطأ في جلب البيانات:", err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("smart_admin_logged_in") === "true") {
      setIsLoggedIn(true);
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSaveTool = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("الرجاء تعبئة العنوان والوصف.");
      return;
    }

    const placeholders = formData.placeholdersInput ? formData.placeholdersInput.split(",").map(p => p.trim()) : [];
    let variables = [];
    if (formData.variablesInput) {
      try { variables = JSON.parse(formData.variablesInput); } catch (err) {}
    }

    const payload = { ...formData, placeholders, variables };
    const method = editingId ? "PUT" : "POST";
    if (editingId) payload.id = editingId;

    const res = await fetch("/api/software-tools", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (result.success) {
      alert(editingId ? "تم تحديث الأداة وتحديثها فورياً للجمهور!" : "تم نشر الأداة للجمهور بنجاح!");
      resetForm();
      fetchData();
      setActiveTab("tools-list");
    } else {
      alert("خطأ: " + result.error);
    }
  };

  const handleDeleteClick = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذه الأداة من واجهة الجمهور؟")) {
      const res = await fetch(`/api/software-tools?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        alert("تم الحذف بنجاح.");
        fetchData();
      }
    }
  };

  const handleDeleteRequest = async (id) => {
    if (confirm("هل تريد حذف هذا الطلب المخصص؟")) {
      const res = await fetch(`/api/software-tools?id=${id}&type=request`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) fetchData();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "prompt-engineering",
      stage: "design",
      badge: "مجانية",
      aiPlatform: "ChatGPT / Claude 3",
      description: "",
      secretPrompt: "",
      placeholdersInput: "input_area, input_price",
      logic: "",
      variablesInput: "",
      validation: "",
      template: ""
    });
    setEditingId(null);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail === "admin@smartengineering.com" && loginPassword === "AdminSmart2026") {
      localStorage.setItem("smart_admin_logged_in", "true");
      setIsLoggedIn(true);
    } else {
      setLoginError("❌ البيانات خاطئة!");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center p-4 font-sans rtl" dir="rtl">
        <form onSubmit={handleLoginSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
          <h2 className="text-xl font-black text-blue-400 text-center flex items-center justify-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            <span>لوحة تحكم الأدوات البرمجية</span>
          </h2>
          {loginError && <p className="text-red-400 text-xs text-center">{loginError}</p>}
          <input type="email" placeholder="البريد الإلكتروني" required onChange={(e) => setLoginEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white" />
          <input type="password" placeholder="كلمة السر" required onChange={(e) => setLoginPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white" />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-all">تسجيل الدخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased rtl" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-500/30">
              <ShieldAlert className="h-7 w-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">لوحة تحكم برمجيات وأدوات منصة الهندسة الذكية</h1>
              <p className="text-slate-400 text-xs">إضافة، تعديل، حذف الأدوات واستقبال طلبات الجمهور المباشرة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => { resetForm(); setActiveTab("add-tool"); }} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5">
              <PlusCircle className="h-4 w-4" />
              <span>نشر أداة جديدة</span>
            </button>
            <button onClick={() => window.open("/software-tools", "_blank")} className="bg-slate-800 border border-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>معاينة للجمهور ↗</span>
            </button>
          </div>
        </header>

        <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto">
          <button onClick={() => setActiveTab("tools-list")} className={`px-4 py-2 font-bold text-xs border-b-2 whitespace-nowrap ${activeTab === "tools-list" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>
            الأدوات المنشورة ({tools.length})
          </button>
          <button onClick={() => setActiveTab("add-tool")} className={`px-4 py-2 font-bold text-xs border-b-2 whitespace-nowrap ${activeTab === "add-tool" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>
            {editingId ? "تعديل الأداة الحالية" : "نشر أداة جديدة"}
          </button>
          <button onClick={() => setActiveTab("received-requests")} className={`px-4 py-2 font-bold text-xs border-b-2 whitespace-nowrap ${activeTab === "received-requests" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>
            طلبات الأدوات المستلمة ({requests.length})
          </button>
        </div>

        {activeTab === "tools-list" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-800 text-slate-300 font-bold">
                  <th className="p-4">اسم الأداة</th>
                  <th className="p-4">التصنيف الرئيسي</th>
                  <th className="p-4">مرحلة المشروع</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-center">التحكم والعمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {tools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-slate-800/20">
                    <td className="p-4 font-bold text-white">{tool.title}</td>
                    <td className="p-4 text-slate-400">{tool.category}</td>
                    <td className="p-4 text-slate-400">{tool.stage}</td>
                    <td className="p-4"><span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px]">{tool.badge}</span></td>
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
            <h3 className="text-sm font-bold text-blue-400 mb-2">{editingId ? "تعديل أداة برمجة منشورة" : "إدراج ونشر أداة برمجية جديدة للجمهور"}</h3>
            <input type="text" required name="title" value={formData.title} onChange={handleInputChange} placeholder="عنوان الأداة أو اسم الأمر" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select name="category" value={formData.category} onChange={handleInputChange} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white">
                <option value="prompt-engineering">A. هندسة الأوامر (Prompt Engineering)</option>
                <option value="live-web-apps">B. تطبيقات الويب الحية (Live Web Apps)</option>
                <option value="automation-software">C. برمجيات الأتمتة (Automation Software)</option>
                <option value="ai-solutions">D. حلول الذكاء الاصطناعي (AI Solutions)</option>
                <option value="management-control">E. الإدارة والتحكم (Management & Control)</option>
              </select>

              <select name="stage" value={formData.stage} onChange={handleInputChange} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white">
                <option value="design">مرحلة التصميم</option>
                <option value="execution">مرحلة التنفيذ والموقع</option>
                <option value="technical-office">المكتب الفني والكميات</option>
              </select>

              <select name="badge" value={formData.badge} onChange={handleInputChange} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white">
                <option value="مجانية">مجانية</option>
                <option value="تجريبية">تجريبية</option>
                <option value="Pro">Pro (احترافية)</option>
              </select>
            </div>

            <textarea rows="3" required name="description" value={formData.description} onChange={handleInputChange} placeholder="الشرح والوصف الفني للأداة" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"></textarea>

            {formData.category === "prompt-engineering" && (
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-cyan-400">إعدادات قالب البرومبت الحصرية</h4>
                <textarea rows="3" name="secretPrompt" value={formData.secretPrompt} onChange={handleInputChange} placeholder="قالب البرومبت الذكي..." className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"></textarea>
                <input type="text" name="placeholdersInput" value={formData.placeholdersInput} onChange={handleInputChange} placeholder="الحقول المحددة (مثلاً: input_area, input_price)" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white" />
              </div>
            )}

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-xs"><Save className="h-4 w-4 inline ml-1" /> حفظ ونشر الأداة فورياً للجمهور</button>
          </form>
        )}

        {activeTab === "received-requests" && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {requests.length === 0 ? (
              <p className="text-center text-slate-500 text-xs py-8">لا توجد طلبات مستلمة حالياً.</p>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative space-y-2">
                  <button onClick={() => handleDeleteRequest(req.id)} className="absolute left-4 top-4 text-red-400 hover:text-white"><Trash2 className="h-4 w-4" /></button>
                  <p className="text-xs font-bold text-blue-400">{req.name} ({req.email} | {req.phone})</p>
                  <p className="text-[10px] text-slate-500">{req.createdAt}</p>
                  <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800 mt-2">{req.details}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}