"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, PlusCircle, Trash2, Edit, Save, Eye, User, Mail, Phone, FileText, RefreshCw 
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

  // دالة طلب آمنة تمنع خطأ JSON.parse
  const safeFetchJSON = async (url, options = {}) => {
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        return { success: false, error: "استجابة الخادم ليست بصيغة JSON مقبولة." };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // جلب البيانات مع دمج التخزين المحلي كنسخة احتياطية
  const fetchTools = async () => {
    setLoading(true);
    const data = await safeFetchJSON("/api/software-tool");
    if (data.success && Array.isArray(data.data)) {
      setTools(data.data);
      localStorage.setItem("smart_tools_cache", JSON.stringify(data.data));
    } else {
      const local = localStorage.getItem("smart_tools_cache");
      if (local) setTools(JSON.parse(local));
    }
    setLoading(false);
  };

  const fetchRequests = async () => {
    const data = await safeFetchJSON("/api/software-tool?type=requests");
    let serverReqs = (data.success && Array.isArray(data.data)) ? data.data : [];
    
    // دمجه مع الطلبات المحفوظة محلياً لضمان وصول كافة الطلبات
    const localReqs = JSON.parse(localStorage.getItem("smart_tool_requests_local") || "[]");
    const merged = [...serverReqs];
    localReqs.forEach(lr => {
      if (!merged.some(sr => sr.id === lr.id)) merged.unshift(lr);
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveTool = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("الرجاء تعبئة العنوان والوصف.");
      return;
    }

    const placeholders = formData.placeholdersInput
      ? formData.placeholdersInput.split(",").map((p) => p.trim()).filter(Boolean)
      : [];

    let variables = [];
    if (formData.category === "live-web-apps" && formData.variablesInput) {
      try {
        variables = JSON.parse(formData.variablesInput);
      } catch {
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

    const url = "/api/software-tool";
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? JSON.stringify({ id: editingId, ...payload }) : JSON.stringify(payload);

    const result = await safeFetchJSON(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body
    });

    if (result.success) {
      alert(editingId ? "تم التعديل بنجاح!" : "تم نشر الأداة بنجاح!");
      resetForm();
      setActiveTab("tools-list");
      fetchTools();
    } else {
      alert("تنبيه: " + (result.error || "تعذر حفظ البيانات في الخادم."));
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
    if (confirm("هل أنت متأكد من حذف هذه الأداة؟")) {
      const result = await safeFetchJSON(`/api/software-tool?id=${id}`, { method: "DELETE" });
      if (result.success) {
        alert("تم الحذف بنجاح.");
        fetchTools();
      } else {
        alert("خطأ أثناء الحذف: " + result.error);
      }
    }
  };

  const handleDeleteRequest = async (id) => {
    if (confirm("هل تود أرشفة هذا الطلب؟")) {
      await safeFetchJSON(`/api/software-tool?id=${id}&type=request`, { method: "DELETE" });
      
      // مسح من التخزين المحلي أيضاً
      const localReqs = JSON.parse(localStorage.getItem("smart_tool_requests_local") || "[]");
      const updatedLocal = localReqs.filter(r => r.id !== id);
      localStorage.setItem("smart_tool_requests_local", JSON.stringify(updatedLocal));

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
      <div className="flex justify-center items-center min-h-screen bg-slate-950 text-right" dir="rtl">
        <form onSubmit={handleLoginSubmit} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl">
          <h2 className="text-xl font-bold text-cyan-400 text-center mb-6">🔐 تسجيل دخول لوحة الأدمن</h2>
          {loginError && <p className="text-red-400 text-xs text-center mb-4">{loginError}</p>}
          <input type="email" placeholder="الإيميل الرسمي" required onChange={(e) => setLoginEmail(e.target.value)} className="w-full p-3 mb-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs" />
          <input type="password" placeholder="كلمة السر" required onChange={(e) => setLoginPassword(e.target.value)} className="w-full p-3 mb-6 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs" />
          <button type="submit" className="w-full p-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all">تسجيل الدخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans rtl" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              <ShieldAlert className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">لوحة إدارة برمجيات منصة الهندسة الذكية</h1>
              <p className="text-slate-400 text-xs mt-0.5">التحكم الفوري المباشر بتبويبات البرمجيات والأدوات</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => { fetchTools(); fetchRequests(); }} className="bg-slate-800 p-2.5 rounded-xl text-xs border border-slate-700 hover:bg-slate-700">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => { resetForm(); setActiveTab("add-tool"); }} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5">
              <PlusCircle className="h-4 w-4" />
              <span>إدراج أداة جديدة</span>
            </button>
            <button onClick={() => window.open("/software-tools", "_blank")} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700">
              <Eye className="h-4 w-4" />
              <span>معاينة الواجهة ↗</span>
            </button>
          </div>
        </header>

        <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto">
          <button onClick={() => setActiveTab("tools-list")} className={`px-4 py-2 font-bold text-xs border-b-2 ${activeTab === "tools-list" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>
            الأدوات المنشورة ({tools.length})
          </button>
          <button onClick={() => setActiveTab("add-tool")} className={`px-4 py-2 font-bold text-xs border-b-2 ${activeTab === "add-tool" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>
            {editingId ? "تعديل الأداة" : "إضافة أداة جديدة"}
          </button>
          <button onClick={() => setActiveTab("received-requests")} className={`px-4 py-2 font-bold text-xs border-b-2 relative ${activeTab === "received-requests" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>
            طلبات الجمهور ({requests.length})
            {requests.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">!</span>}
          </button>
        </div>

        {activeTab === "tools-list" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {tools.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">لا توجد أدوات منشورة حالياً.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-800/80 border-b border-slate-800 text-slate-300 font-bold">
                      <th className="p-4">عنوان الأداة</th>
                      <th className="p-4">التصنيف</th>
                      <th className="p-4">الشارة</th>
                      <th className="p-4">البيئة / AI</th>
                      <th className="p-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-slate-800/20">
                        <td className="p-4 font-bold text-white">{tool.title}</td>
                        <td className="p-4 text-slate-400">{tool.category}</td>
                        <td className="p-4"><span className="bg-slate-800 px-2 py-1 rounded text-amber-400">{tool.badge}</span></td>
                        <td className="p-4 font-mono text-cyan-400">{tool.aiPlatform}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEditClick(tool)} className="p-1.5 bg-blue-600/10 text-blue-400 rounded-lg"><Edit className="h-4 w-4" /></button>
                            <button onClick={() => handleDeleteClick(tool.id)} className="p-1.5 bg-red-600/10 text-red-400 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                          </div>
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
          <form onSubmit={handleSaveTool} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 max-w-4xl mx-auto shadow-2xl">
            <h2 className="text-base font-bold text-white">{editingId ? "تعديل بيانات الأداة" : "إدراج أداة جديدة"}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-300">عنوان الأداة *</label>
                <input type="text" required name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-300">التصنيف *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white">
                  <option value="prompt-engineering">هندسة الأوامر الذكية</option>
                  <option value="live-web-apps">تطبيقات الويب الحية</option>
                  <option value="automation-software">برمجيات الأتمتة المتقدمة</option>
                  <option value="ai-solutions">حلول الذكاء الاصطناعي</option>
                  <option value="management-control">الإدارة والتحكم الفني</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-300">الشارة التسويقية</label>
                <input type="text" name="badge" value={formData.badge} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-300">بيئة AI / المعالجة</label>
                <input type="text" name="aiPlatform" value={formData.aiPlatform} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono text-cyan-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-300">الوصف الفني *</label>
              <textarea rows="3" required name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"></textarea>
            </div>

            {formData.category === "prompt-engineering" && (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-blue-400">نص الـ Prompt السري:</label>
                <textarea rows="3" name="secretPrompt" value={formData.secretPrompt} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono"></textarea>
                <label className="block text-xs font-bold text-slate-400">المتغيرات (مفصولة بفاصلة):</label>
                <input type="text" name="placeholdersInput" value={formData.placeholdersInput} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white" />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => { resetForm(); setActiveTab("tools-list"); }} className="px-4 py-2 bg-slate-800 text-xs font-bold rounded-xl">إلغاء</button>
              <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"><Save className="h-4 w-4" /><span>حفظ الأداة</span></button>
            </div>
          </form>
        )}

        {activeTab === "received-requests" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-4xl mx-auto shadow-2xl">
            <h2 className="text-base font-bold text-white mb-4">صندوق طلبات الجمهور الواردة ({requests.length})</h2>
            {requests.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">لا توجد طلبات جديدة.</div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative space-y-2">
                    <button onClick={() => handleDeleteRequest(req.id)} className="absolute left-3 top-3 text-slate-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-300">
                      <span className="flex items-center gap-1 text-white"><User className="h-3.5 w-3.5 text-blue-400" />{req.name}</span>
                      <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-cyan-400" />{req.email}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-emerald-400" />{req.phone}</span>
                      <span className="text-[10px] text-slate-500 font-mono mr-auto">{req.date || req.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-850 leading-relaxed">{req.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}