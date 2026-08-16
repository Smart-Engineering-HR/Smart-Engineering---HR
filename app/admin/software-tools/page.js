"use client";

import React, { useState, useEffect } from "react";
import { 
  Terminal, Cpu, Settings, ShieldAlert, Sliders, PlusCircle, 
  Trash2, Edit, Save, Eye, User, Mail, Phone, FileText, RefreshCw
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

  // دالة قراءة الاستجابة الآمنة لحماية النظام من خطأ JSON.parse
  const parseSafeResponse = async (res) => {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }
    const rawText = await res.text();
    throw new Error(`استجابة غير متوقعة من الخادم (Status ${res.status}): ${rawText.slice(0, 100)}...`);
  };

  // جلب البيانات مع مزامنة الـ Buffer المحترفة
  const fetchTools = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/software-tool");
      const data = await parseSafeResponse(res);
      if (data.success) {
        setTools(data.data);
      }
    } catch (err) {
      console.error("فشل جلب الأدوات:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/software-tool?type=requests");
      const data = await parseSafeResponse(res);
      
      // جلب الطلبات المحفوظة محلياً لدمجها لضمان عدم ضياع أي طلب
      const localReqs = JSON.parse(localStorage.getItem("smart_tool_requests") || "[]");
      const apiReqs = data.success ? data.data : [];
      
      // دمج الطلبات بدون تكرار
      const combinedMap = new Map();
      [...apiReqs, ...localReqs].forEach((item) => combinedMap.set(item.id, item));
      
      const mergedRequests = Array.from(combinedMap.values());
      setRequests(mergedRequests);
    } catch (err) {
      console.error("فشل جلب الطلبات:", err);
      const localReqs = JSON.parse(localStorage.getItem("smart_tool_requests") || "[]");
      setRequests(localReqs);
    }
  };

  useEffect(() => {
    const authStatus = localStorage.getItem("smart_admin_logged_in");
    if (authStatus === "true") {
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
      alert("الرجاء تعبئة الحقول الأساسية مثل العنوان والوصف التفصيلي.");
      return;
    }

    const placeholders = formData.placeholdersInput
      ? formData.placeholdersInput.split(",").map((p) => p.trim()).filter(Boolean)
      : [];

    let variables = [];
    if (formData.category === "live-web-apps" && formData.variablesInput) {
      try {
        variables = JSON.parse(formData.variablesInput);
      } catch (err) {
        variables = [
          { name: "Ac", label: "مساحة المقطع الخرساني الإجمالي (mm²)", type: "number", unit: "mm²" },
          { name: "fc", label: "المقاومة المميزة للخرسانة fc' (MPa)", type: "number", unit: "MPa" }
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

    try {
      let res;
      if (editingId) {
        res = await fetch("/api/software-tool", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload })
        });
      } else {
        res = await fetch("/api/software-tool", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      const result = await parseSafeResponse(res);
      if (result.success) {
        alert(editingId ? "تم تعديل الأداة بنجاح!" : "تم نشر الأداة البرمجية الجديدة للجمهور بنجاح!");
        resetForm();
        setActiveTab("tools-list");
        fetchTools();
      } else {
        alert("تنبيه: " + result.error);
      }
    } catch (err) {
      alert("خطأ الاتصال: " + err.message);
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
    if (confirm("هل أنت متأكد من حذف هذه الأداة من منصة الجمهور؟")) {
      try {
        const res = await fetch(`/api/software-tool?id=${id}`, { method: "DELETE" });
        const result = await parseSafeResponse(res);
        if (result.success) {
          alert("تمت إزالة وحذف الأداة بنجاح.");
          fetchTools();
        } else {
          alert("تنبيه: " + result.error);
        }
      } catch (err) {
        alert("فشل إجراء الحذف: " + err.message);
      }
    }
  };

  const handleDeleteRequest = async (id) => {
    if (confirm("هل تود أرشفة وإزالة هذا الطلب الوارد؟")) {
      try {
        // حذف محلي ومن API
        const updatedLocal = JSON.parse(localStorage.getItem("smart_tool_requests") || "[]").filter((r) => r.id !== id);
        localStorage.setItem("smart_tool_requests", JSON.stringify(updatedLocal));

        const res = await fetch(`/api/software-tool?id=${id}&type=request`, { method: "DELETE" });
        await parseSafeResponse(res).catch(() => {});
        fetchRequests();
      } catch (err) {
        fetchRequests();
      }
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
      <div className="flex justify-center items-center min-h-screen bg-slate-950 dir-rtl" dir="rtl">
        <form onSubmit={handleLoginSubmit} className="bg-slate-900 p-8 rounded-2xl w-full max-w-md border border-slate-800 shadow-2xl">
          <h2 className="text-xl font-bold text-cyan-400 text-center mb-6">🔐 تسجيل دخول لوحة الأدمن</h2>
          {loginError && <p className="text-red-400 text-xs text-center mb-4 font-bold">{loginError}</p>}
          <input type="email" placeholder="الإيميل الرسمي" required onChange={(e) => setLoginEmail(e.target.value)} className="w-full p-3 mb-4 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs" />
          <input type="password" placeholder="كلمة السر" required onChange={(e) => setLoginPassword(e.target.value)} className="w-full p-3 mb-6 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs" />
          <button type="submit" className="w-full p-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all">تسجيل الدخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased rtl" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600/15 p-3 rounded-xl border border-red-500/30 shadow-lg">
              <ShieldAlert className="h-7 w-7 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">لوحة تحكم وإدارة برمجيات منصة الهندسة الذكية</h1>
              <p className="text-slate-400 text-xs mt-0.5">إدارة ومزامنة الأدوات واستقبال الطلبات المباشرة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { fetchTools(); fetchRequests(); }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all border border-slate-700"
              title="تحديث البيانات"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => { resetForm(); setActiveTab("add-tool"); }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow"
            >
              <PlusCircle className="h-4 w-4" />
              <span>إدراج أداة برمجية جديدة</span>
            </button>
            <button
              onClick={() => window.open("/software-tools", "_blank")}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all border border-slate-700"
            >
              <Eye className="h-4 w-4" />
              <span>معاينة واجهة الجمهور ↗</span>
            </button>
          </div>
        </header>

        {/* التبويبات */}
        <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("tools-list")}
            className={`px-4 py-2 font-bold text-xs whitespace-nowrap border-b-2 transition-all ${activeTab === "tools-list" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
          >
            الأدوات المنشورة ({tools.length})
          </button>
          <button
            onClick={() => setActiveTab("add-tool")}
            className={`px-4 py-2 font-bold text-xs whitespace-nowrap border-b-2 transition-all ${activeTab === "add-tool" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
          >
            {editingId ? "تعديل أداة" : "نشر أداة جديدة"}
          </button>
          <button
            onClick={() => setActiveTab("received-requests")}
            className={`px-4 py-2 font-bold text-xs whitespace-nowrap border-b-2 transition-all relative ${activeTab === "received-requests" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
          >
            طلبات الجمهور الواردة ({requests.length})
            {requests.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">!</span>}
          </button>
        </div>

        {/* التبويب 1: قائمة الأدوات */}
        {activeTab === "tools-list" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {tools.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                {loading ? "جاري جلب البيانات..." : "لا توجد أدوات منشورة حالياً."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-800/80 border-b border-slate-800 text-slate-300 font-bold">
                      <th className="p-4">عنوان الأداة</th>
                      <th className="p-4">القسم</th>
                      <th className="p-4">الشارة</th>
                      <th className="p-4">المنصة</th>
                      <th className="p-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 font-bold text-white">{tool.title}</td>
                        <td className="p-4 text-slate-400 font-medium">
                          {tool.category === "prompt-engineering" && "هندسة الأوامر"}
                          {tool.category === "live-web-apps" && "تطبيقات الويب"}
                          {tool.category === "automation-software" && "الأتمتة المتقدمة"}
                          {tool.category === "ai-solutions" && "الذكاء الاصطناعي"}
                          {tool.category === "management-control" && "الإدارة والتحكم"}
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-800 px-2.5 py-1 text-[11px] rounded border border-slate-700 font-bold text-amber-400">
                            {tool.badge}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-cyan-400 font-medium">{tool.aiPlatform}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEditClick(tool)} className="p-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteClick(tool.id)} className="p-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
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

        {/* التبويب 2: النشر والتعديل */}
        {activeTab === "add-tool" && (
          <form onSubmit={handleSaveTool} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-white">
              {editingId ? "تعديل الأداة البرمجية" : "إدراج ونشر أداة برمجية جديدة"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان الأداة *</label>
                <input type="text" required name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">التصنيف *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-bold">
                  <option value="prompt-engineering">هندسة الأوامر الذكية (Prompt Engineering)</option>
                  <option value="live-web-apps">تطبيقات الويب الحية (Live Web Apps)</option>
                  <option value="automation-software">برمجيات الأتمتة المتقدمة (Automation Software)</option>
                  <option value="ai-solutions">حلول الذكاء الاصطناعي الموجه (AI Solutions)</option>
                  <option value="management-control">الإدارة والتحكم الفني (Management & Control)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">الشارة التسويقية *</label>
                <input type="text" name="badge" value={formData.badge} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">المنصة / المحرك *</label>
                <input type="text" name="aiPlatform" value={formData.aiPlatform} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-mono text-cyan-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">الوصف الفني *</label>
              <textarea rows="3" required name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs"></textarea>
            </div>

            {formData.category === "prompt-engineering" && (
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-blue-400">تكوين الـ Prompt</h3>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">نص الأمر ([المتغير]):</label>
                  <textarea rows="4" name="secretPrompt" value={formData.secretPrompt} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono"></textarea>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">المتغيرات (بفاصلة ,):</label>
                  <input type="text" name="placeholdersInput" value={formData.placeholdersInput} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white" />
                </div>
              </div>
            )}

            {formData.category === "live-web-apps" && (
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-cyan-400">محرك الحاسبة الحية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1.5">المعادلة (JavaScript):</label>
                    <input type="text" name="logic" value={formData.logic} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono text-left" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1.5">شروط التحقق:</label>
                    <input type="text" name="validation" value={formData.validation} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white" />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => { resetForm(); setActiveTab("tools-list"); }} className="px-5 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs">إلغاء</button>
              <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-1.5">
                <Save className="h-4 w-4" />
                <span>حفظ الأداة ونشرها للجمهور</span>
              </button>
            </div>
          </form>
        )}

        {/* التبويب 3: الطلبات الواردة */}
        {activeTab === "received-requests" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto">
            <h2 className="text-base font-bold text-white mb-4">صندوق طلبات الجمهور المباشرة</h2>
            {requests.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">لا توجد طلبات واردة حالياً.</div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 relative">
                    <button onClick={() => handleDeleteRequest(req.id)} className="absolute left-4 top-4 text-slate-500 hover:text-red-400 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
                      <div className="flex items-center gap-1.5 text-white font-bold"><User className="h-4 w-4 text-blue-400" /><span>{req.name}</span></div>
                      <div className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-cyan-400" /><span>{req.email}</span></div>
                      <div className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-emerald-400" /><span>{req.phone}</span></div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
                      {req.details}
                    </div>
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