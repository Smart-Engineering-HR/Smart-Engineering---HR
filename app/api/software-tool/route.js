"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, PlusCircle, Trash2, Edit, Save, Eye, User, Mail, Phone, RefreshCw
} from "lucide-react";

export default function SoftwareToolsAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [tools, setTools] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("tools-list");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "prompt-engineering",
    badge: "أداة حصرية",
    aiPlatform: "ChatGPT / Claude 3",
    description: "",
    secretPrompt: "",
    placeholdersInput: "",
    logic: "",
    variablesInput: "",
    validation: "",
    template: ""
  });

  const safeFetchJson = async (url, options = {}) => {
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      
      try {
        const parsed = JSON.parse(text);
        return { ok: res.ok, status: res.status, data: parsed };
      } catch (err) {
        return { 
          ok: false, 
          status: res.status, 
          error: `حدث خطأ بالخادم (رمز ${res.status}). يرجى إعادة المحاولة أو التحقق من الربط.` 
        };
      }
    } catch (err) {
      return { ok: false, status: 0, error: "تعذر الاتصال بالشبكة: " + err.message };
    }
  };

  const fetchTools = async () => {
    setLoading(true);
    const res = await safeFetchJson("/api/software-tools");
    if (res.data && res.data.success) {
      setTools(res.data.data);
    }
    setLoading(false);
  };

  const fetchRequests = async () => {
    const res = await safeFetchJson("/api/software-tools?type=requests");
    let serverRequests = (res.data && res.data.success) ? res.data.data : [];
    
    let localRequests = [];
    try {
      localRequests = JSON.parse(localStorage.getItem("smart_tools_custom_requests") || "[]");
    } catch(e) {}

    const merged = [...serverRequests];
    localRequests.forEach(lr => {
      if (!merged.some(sr => sr.id === lr.id || (sr.email === lr.email && sr.details === lr.details))) {
        merged.unshift(lr);
      }
    });

    setRequests(merged);
  };

  useEffect(() => {
    if (localStorage.getItem("smart_admin_logged_in") === "true") {
      setIsLoggedIn(true);
    }
    fetchTools();
    fetchRequests();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveTool = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("الرجاء تعبئة الحقول الأساسية (العنوان والوصف).");
      return;
    }

    const placeholders = formData.placeholdersInput
      ? formData.placeholdersInput.split(",").map((p) => p.trim()).filter(Boolean)
      : [];

    let variables = [];
    if (formData.category === "live-web-apps" && formData.variablesInput.trim()) {
      try {
        variables = JSON.parse(formData.variablesInput);
      } catch (err) {
        variables = [
          { name: "Ac", label: "مساحة المقطع (mm²)", type: "number", unit: "mm²" },
          { name: "fc", label: "مقاومة الخرسانة (MPa)", type: "number", unit: "MPa" }
        ];
      }
    }

    const payload = {
      title: formData.title,
      category: formData.category,
      badge: formData.badge,
      aiPlatform: formData.aiPlatform,
      description: formData.description,
      secretPrompt: formData.secretPrompt,
      placeholders,
      logic: formData.logic,
      variables,
      validation: formData.validation,
      template: formData.template
    };

    const res = await safeFetchJson("/api/software-tools", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload)
    });

    if (res.data && res.data.success) {
      alert(editingId ? "تم تعديل الأداة بنجاح!" : "تم نشر الأداة البرمجية بنجاح للجمهور!");
      resetForm();
      setActiveTab("tools-list");
      fetchTools();
    } else {
      alert("خطأ أثناء الحفظ: " + (res.data?.error || res.error || "خطأ غير معروف"));
    }
  };

  const handleEditClick = (tool) => {
    setEditingId(tool.id);
    setFormData({
      title: tool.title || "",
      category: tool.category || "prompt-engineering",
      badge: tool.badge || "أداة حصرية",
      aiPlatform: tool.aiPlatform || "ChatGPT / Claude 3",
      description: tool.description || "",
      secretPrompt: tool.secretPrompt || "",
      placeholdersInput: tool.placeholders ? tool.placeholders.join(", ") : "",
      logic: tool.logic || "",
      variablesInput: tool.variables ? JSON.stringify(tool.variables, null, 2) : "",
      validation: tool.validation || "",
      template: tool.template || ""
    });
    setActiveTab("add-tool");
  };

  const handleDeleteClick = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذه الأداة نهائياً؟")) {
      const res = await safeFetchJson(`/api/software-tools?id=${id}`, { method: "DELETE" });
      if (res.data && res.data.success) {
        alert("تم الحذف بنجاح.");
        fetchTools();
      } else {
        alert("فشل الحذف: " + (res.data?.error || res.error));
      }
    }
  };

  const handleDeleteRequest = async (id) => {
    if (confirm("هل تريد إزالة هذا الطلب؟")) {
      await safeFetchJson(`/api/software-tools?id=${id}&type=request`, { method: "DELETE" });
      try {
        let local = JSON.parse(localStorage.getItem("smart_tools_custom_requests") || "[]");
        local = local.filter(r => r.id !== id);
        localStorage.setItem("smart_tools_custom_requests", JSON.stringify(local));
      } catch(e) {}
      fetchRequests();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "prompt-engineering",
      badge: "أداة حصرية",
      aiPlatform: "ChatGPT / Claude 3",
      description: "",
      secretPrompt: "",
      placeholdersInput: "",
      logic: "",
      variablesInput: "",
      validation: "",
      template: ""
    });
    setEditingId(null);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail === "admin@smartacademy.com" && loginPassword === "AdminPassword2026") {
      localStorage.setItem("smart_admin_logged_in", "true");
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("❌ بيانات الدخول غير صحيحة!");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950 text-white font-sans" dir="rtl">
        <form onSubmit={handleLoginSubmit} className="bg-slate-900 p-8 rounded-2xl w-full max-w-md border border-slate-800 shadow-2xl">
          <h2 className="text-xl font-bold text-center text-cyan-400 mb-6">🔐 تسجيل دخول لوحة الأدمن</h2>
          {loginError && <p className="text-red-400 text-xs text-center mb-4">{loginError}</p>}
          <input type="email" placeholder="البريد الإلكتروني" required onChange={(e) => setLoginEmail(e.target.value)} className="w-full p-3 mb-4 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs" />
          <input type="password" placeholder="كلمة السر" required onChange={(e) => setLoginPassword(e.target.value)} className="w-full p-3 mb-6 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs" />
          <button type="submit" className="w-full p-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all">تسجيل الدخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/20 p-3 rounded-xl border border-red-500/30">
              <ShieldAlert className="h-7 w-7 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">لوحة تحكم إدارة البرمجيات والأدوات</h1>
              <p className="text-slate-400 text-xs mt-0.5">النشر الفوري المباشر للجمهور واستقبال الطلبات الواردة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => { fetchTools(); fetchRequests(); }} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2.5 rounded-xl text-xs border border-slate-700">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => { resetForm(); setActiveTab("add-tool"); }} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow">
              <PlusCircle className="h-4 w-4" />
              <span>نشر أداة برمجية جديدة</span>
            </button>
            <button onClick={() => window.open("/software-tools", "_blank")} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-700">
              <Eye className="h-4 w-4 inline ml-1" />
              <span>معاينة واجهة الجمهور ↗</span>
            </button>
          </div>
        </header>

        <div className="flex border-b border-slate-800 mb-6 gap-2">
          <button onClick={() => setActiveTab("tools-list")} className={`px-4 py-2 font-bold text-xs border-b-2 transition-all ${activeTab === "tools-list" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>
            الأدوات المنشورة ({tools.length})
          </button>
          <button onClick={() => setActiveTab("add-tool")} className={`px-4 py-2 font-bold text-xs border-b-2 transition-all ${activeTab === "add-tool" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>
            {editingId ? "تعديل أداة محدده" : "إدراج ونشر أداة جديدة"}
          </button>
          <button onClick={() => setActiveTab("received-requests")} className={`px-4 py-2 font-bold text-xs border-b-2 transition-all relative ${activeTab === "received-requests" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>
            طلبات الجمهور الخاص المباشرة ({requests.length})
            {requests.length > 0 && <span className="ml-1 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">جديد</span>}
          </button>
        </div>

        {activeTab === "tools-list" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {tools.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">لا توجد أدوات منشورة حالياً.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-800/80 border-b border-slate-800 text-slate-300 font-bold">
                      <th className="p-4">اسم وعنوان الأداة</th>
                      <th className="p-4">القسم والتصنيف</th>
                      <th className="p-4">الشارة</th>
                      <th className="p-4">منصة المعالجة</th>
                      <th className="p-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-slate-800/20">
                        <td className="p-4 font-bold text-white">{tool.title}</td>
                        <td className="p-4 text-slate-400">{tool.category}</td>
                        <td className="p-4"><span className="bg-slate-800 px-2 py-1 text-amber-400 rounded border border-slate-700">{tool.badge}</span></td>
                        <td className="p-4 font-mono text-cyan-400">{tool.aiPlatform}</td>
                        <td className="p-4 text-center space-x-2 space-x-reverse">
                          <button onClick={() => handleEditClick(tool)} className="p-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleDeleteClick(tool.id)} className="p-1.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "add-tool" && (
          <form onSubmit={handleSaveTool} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-white">{editingId ? "تعديل أداة" : "نشر أداة برمجية جديدة للجمهور"}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">العنوان *</label>
                <input type="text" required name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">التصنيف *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white">
                  <option value="prompt-engineering">هندسة الأوامر (Prompt Engineering)</option>
                  <option value="live-web-apps">تطبيقات الويب الحية (Live Web Apps)</option>
                  <option value="automation-software">برمجيات الأتمتة المتقدمة</option>
                  <option value="ai-solutions">حلول الذكاء الاصطناعي</option>
                  <option value="management-control">الإدارة والتحكم الفني</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">الشارة التسويقية</label>
                <input type="text" name="badge" value={formData.badge} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">بيئة المعالجة / AI Platform</label>
                <input type="text" name="aiPlatform" value={formData.aiPlatform} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-cyan-400 font-mono" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">الوصف الفني *</label>
              <textarea rows="3" required name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"></textarea>
            </div>

            {formData.category === "prompt-engineering" && (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                <label className="block text-xs font-bold text-blue-400">نص البرومبت السري ([المتغير]):</label>
                <textarea rows="3" name="secretPrompt" value={formData.secretPrompt} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono"></textarea>
                <input type="text" name="placeholdersInput" placeholder="المتغيرات مفصولة بفاصلة (مثال: المادة, الكود)" value={formData.placeholdersInput} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white" />
              </div>
            )}

            {formData.category === "live-web-apps" && (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                <label className="block text-xs font-bold text-cyan-400">المعادلة الحسابية JavaScript:</label>
                <input type="text" name="logic" value={formData.logic} onChange={handleInputChange} placeholder="(0.85 * fc * Ac) / 1000" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono" />
                <input type="text" name="template" value={formData.template} onChange={handleInputChange} placeholder="النتيجة هي: {Result} kN" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white" />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setActiveTab("tools-list")} className="px-5 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs">إلغاء</button>
              <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow flex items-center gap-1.5"><Save className="h-4 w-4" /><span>حفظ ونشر فوراً</span></button>
            </div>
          </form>
        )}

        {activeTab === "received-requests" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-4xl mx-auto space-y-4">
            <h2 className="text-base font-bold text-white mb-4">صندوق طلبات الجمهور الواردة المباشرة</h2>
            {requests.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">لا توجد طلبات خاصة حالياً.</div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 relative space-y-3">
                  <button onClick={() => handleDeleteRequest(req.id)} className="absolute left-4 top-4 text-slate-500 hover:text-red-400 p-1"><Trash2 className="h-4 w-4" /></button>
                  <div className="flex flex-wrap gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1 text-white font-bold"><User className="h-4 w-4 text-blue-400" /><span>{req.name}</span></div>
                    <div className="flex items-center gap-1 text-slate-400"><Mail className="h-4 w-4 text-cyan-400" /><span>{req.email}</span></div>
                    <div className="flex items-center gap-1 text-slate-400"><Phone className="h-4 w-4 text-emerald-400" /><span>{req.phone}</span></div>
                    <span className="text-[10px] text-slate-500 font-mono mr-auto">{req.date || req.createdAt}</span>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{req.details}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}