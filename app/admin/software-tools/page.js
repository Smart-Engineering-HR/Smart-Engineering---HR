"use client";

import React, { useState, useEffect } from "react";
import { 
  Cpu, ShieldAlert, PlusCircle, Trash2, Edit, Save, Eye, User, Mail, Phone, FileText
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resTools, resRequests] = await Promise.all([
        fetch("/api/software-tools"),
        fetch("/api/software-tools?type=requests")
      ]);
      
      const dataTools = await resTools.json();
      const dataRequests = await resRequests.json();

      if (dataTools.success) setTools(dataTools.data);
      if (dataRequests.success) setRequests(dataRequests.data);
    } catch (err) {
      console.error("خطأ جلب البيانات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authStatus = localStorage.getItem("smart_admin_logged_in");
    if (authStatus === "true") {
      setIsLoggedIn(true);
      fetchData();
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail === "admin@smartacademy.com" && loginPassword === "AdminPassword2026") {
      localStorage.setItem("smart_admin_logged_in", "true");
      setIsLoggedIn(true);
      setLoginError("");
      fetchData();
    } else {
      setLoginError("❌ البيانات خاطئة!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveTool = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("الرجاء تعبئة الحقول الأساسية مثل العنوان والوصف.");
      return;
    }

    const placeholders = formData.placeholdersInput
      ? formData.placeholdersInput.split(",").map(p => p.trim())
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
        res = await fetch("/api/software-tools", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload })
        });
      } else {
        res = await fetch("/api/software-tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      const result = await res.json();
      if (result.success) {
        alert(editingId ? "تم تحديث الأداة بنجاح!" : "تم نشر الأداة بنجاح!");
        resetForm();
        fetchData();
        setActiveTab("tools-list");
      } else {
        alert("حدث خطأ: " + result.error);
      }
    } catch (err) {
      alert("فشل الاتصال بالخادم.");
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
      try {
        const res = await fetch(`/api/software-tools?id=${id}`, { method: "DELETE" });
        const result = await res.json();
        if (result.success) {
          alert("تم الحذف بنجاح.");
          fetchData();
        }
      } catch (err) {
        alert("فشل إجراء الحذف.");
      }
    }
  };

  const handleDeleteRequest = async (id) => {
    if (confirm("هل تود أرشفة هذا الطلب؟")) {
      try {
        const res = await fetch(`/api/software-tools?id=${id}&type=request`, { method: "DELETE" });
        const result = await res.json();
        if (result.success) {
          fetchData();
        }
      } catch (err) {
        alert("فشل الحذف.");
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

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950 text-white font-sans dir-rtl" dir="rtl">
        <form onSubmit={handleLoginSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <h2 className="text-xl font-bold text-cyan-400 text-center mb-6">🔐 تسجيل دخول لوحة التحكم</h2>
          {loginError && <p className="text-red-400 text-xs text-center mb-4">{loginError}</p>}
          <input 
            type="email" placeholder="البريد الإلكتروني" required value={loginEmail} 
            onChange={(e) => setLoginEmail(e.target.value)} 
            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl mb-4 text-xs focus:outline-none focus:border-cyan-500" 
          />
          <input 
            type="password" placeholder="كلمة المرور" required value={loginPassword} 
            onChange={(e) => setLoginPassword(e.target.value)} 
            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl mb-6 text-xs focus:outline-none focus:border-cyan-500" 
          />
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 rounded-xl text-xs hover:from-blue-500 hover:to-cyan-500 transition-all">
            دخول
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased dir-rtl" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600/15 p-3 rounded-xl border border-red-500/30">
              <ShieldAlert className="h-7 w-7 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">لوحة تحكم برمجيات منصة الهندسة الذكية</h1>
              <p className="text-slate-400 text-xs mt-0.5">إدارة وتحديث الأدوات والبرمجيات واستقبال الطلبات مباشرة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("tools-list")}
            className={`px-4 py-2 font-bold text-xs border-b-2 transition-all ${activeTab === "tools-list" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}
          >
            الأدوات المنشورة ({tools.length})
          </button>
          <button
            onClick={() => setActiveTab("add-tool")}
            className={`px-4 py-2 font-bold text-xs border-b-2 transition-all ${activeTab === "add-tool" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}
          >
            {editingId ? "تعديل الأداة الحالية" : "نشر أداة جديدة"}
          </button>
          <button
            onClick={() => setActiveTab("received-requests")}
            className={`px-4 py-2 font-bold text-xs border-b-2 transition-all relative ${activeTab === "received-requests" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}
          >
            طلبات الجمهور ({requests.length})
          </button>
        </div>

        {activeTab === "tools-list" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-xs">جاري تحميل البيانات...</div>
            ) : tools.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">لا توجد أدوات منشورة حالياً.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-800/80 border-b border-slate-800 text-slate-300 font-bold">
                      <th className="p-4">العنوان</th>
                      <th className="p-4">التصنيف</th>
                      <th className="p-4">الشارة</th>
                      <th className="p-4">منصة الذكاء الاصطناعي</th>
                      <th className="p-4 text-center">العمليات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-slate-800/20">
                        <td className="p-4 font-bold text-white">{tool.title}</td>
                        <td className="p-4 text-slate-400 font-medium">{tool.category}</td>
                        <td className="p-4"><span className="bg-slate-800 px-2.5 py-1 text-[11px] rounded border border-slate-700 font-bold text-amber-400">{tool.badge}</span></td>
                        <td className="p-4 font-mono text-cyan-400">{tool.aiPlatform}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEditClick(tool)} className="p-1.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"><Edit className="h-4 w-4" /></button>
                            <button onClick={() => handleDeleteClick(tool.id)} className="p-1.5 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
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
            <h2 className="text-lg font-bold text-white">{editingId ? "تعديل بيانات الأداة" : "إضافة أداة برمجية جديدة"}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان الأداة *</label>
                <input type="text" required name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">التصنيف *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs">
                  <option value="prompt-engineering">هندسة الأوامر الذكية</option>
                  <option value="live-web-apps">تطبيقات الويب الحية</option>
                  <option value="automation-software">برمجيات الأتمتة المتقدمة</option>
                  <option value="ai-solutions">حلول الذكاء الاصطناعي</option>
                  <option value="management-control">الإدارة والتحكم الفني</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">الشارة التسويقية</label>
                <input type="text" name="badge" value={formData.badge} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">منصة الـ AI</label>
                <input type="text" name="aiPlatform" value={formData.aiPlatform} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-mono text-cyan-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">الوصف الفني *</label>
              <textarea rows="3" required name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs" />
            </div>

            {formData.category === "prompt-engineering" && (
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">نص الـ Prompt السري (استخدم [المتغير]):</label>
                  <textarea rows="4" name="secretPrompt" value={formData.secretPrompt} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">المتغيرات (مفصولة بفاصلة):</label>
                  <input type="text" name="placeholdersInput" value={formData.placeholdersInput} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white" />
                </div>
              </div>
            )}

            {formData.category === "live-web-apps" && (
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">المعادلة الرياضية (JavaScript Syntax):</label>
                  <input type="text" name="logic" value={formData.logic} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono text-left" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">حقول المتغيرات بصيغة JSON:</label>
                  <textarea rows="4" name="variablesInput" value={formData.variablesInput} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono text-left" />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => { resetForm(); setActiveTab("tools-list"); }} className="px-5 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl">إلغاء</button>
              <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5">
                <Save className="h-4 w-4" />
                <span>حفظ وتحديث الواجهة</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === "received-requests" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-4xl mx-auto shadow-2xl">
            <h2 className="text-base font-bold text-white mb-4">طلبات البرمجيات الخاصة المستلمة</h2>
            {requests.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">صندوق الوارد فارغ.</div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 relative">
                    <button onClick={() => handleDeleteRequest(req.id)} className="absolute left-4 top-4 text-slate-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
                      <div className="flex items-center gap-1.5 text-white"><User className="h-4 w-4 text-blue-400" /><span>{req.name}</span></div>
                      <div className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-cyan-400" /><span>{req.email}</span></div>
                      <div className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-emerald-400" /><span>{req.phone}</span></div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
                      <p>{req.details}</p>
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