"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, PlusCircle, Trash2, Edit, Save, Eye, Layers, CheckCircle2, Sliders, RefreshCw, Layers3, Cpu } from "lucide-react";

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
      alert(editingId ? "تم تحديث الأداة فورياً في الواجهة!" : "تم نشر الأداة للجمهور بنجاح!");
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

  const startEditTool = (tool) => {
    setEditingId(tool.id);
    setFormData({
      ...tool,
      placeholdersInput: tool.placeholders ? tool.placeholders.join(", ") : "",
      variablesInput: tool.variables ? JSON.stringify(tool.variables) : ""
    });
    setActiveTab("add-tool");
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
      setLoginError("❌ بيانات الدخول غير صحيحة!");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center p-4 font-sans rtl" dir="rtl">
        <form onSubmit={handleLoginSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md space-y-4 shadow-2xl">
          <div className="text-center">
            <ShieldAlert className="h-10 w-10 text-cyan-400 mx-auto mb-2" />
            <h2 className="text-xl font-black text-white">لوحة تحكم الأدوات البرمجية</h2>
            <p className="text-xs text-slate-400 mt-1">الرجاء تسجيل الدخول للإدارة والتعديل الفوري</p>
          </div>
          {loginError && <p className="text-red-400 text-xs text-center font-bold bg-red-500/10 p-2 rounded-xl">{loginError}</p>}
          <input type="email" placeholder="البريد الإلكتروني" required onChange={(e) => setLoginEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500" />
          <input type="password" placeholder="كلمة السر" required onChange={(e) => setLoginPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500" />
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl text-xs transition-all">تسجيل الدخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased rtl" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4 bg-slate-900/60 p-6 rounded-3xl border">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-600/20 p-3.5 rounded-2xl border border-cyan-500/30">
              <ShieldAlert className="h-7 w-7 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">لوحة تحكم برمجيات وأدوات المنصة</h1>
              <p className="text-slate-400 text-xs">صلاحيات كاملة للحذف، التعديل، والإضافة المباشرة للجمهور</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => { resetForm(); setActiveTab("add-tool"); }} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/10">
              <PlusCircle className="h-4 w-4" />
              <span>نشر أداة جديدة</span>
            </button>
            <button onClick={() => window.open("/software-tools", "_blank")} className="bg-slate-800 border border-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>معاينة للجمهور ↗</span>
            </button>
          </div>
        </header>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">إجمالي البرمجيات</span>
              <span className="text-xl font-black text-white">{tools.length} أداة</span>
            </div>
            <Cpu className="h-8 w-8 text-cyan-400/40" />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">طلبات التخصيص المستلمة</span>
              <span className="text-xl font-black text-white">{requests.length} طلبات</span>
            </div>
            <Layers3 className="h-8 w-8 text-emerald-400/40" />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">حالة المزامنة المباشرة</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> نشطة ومزامنة تلقائية
              </span>
            </div>
            <RefreshCw className="h-8 w-8 text-blue-400/40" />
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex border-b border-slate-800 mb-6 gap-2 overflow-x-auto">
          <button onClick={() => setActiveTab("tools-list")} className={`px-5 py-2.5 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${activeTab === "tools-list" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400"}`}>
            الأدوات المنشورة ({tools.length})
          </button>
          <button onClick={() => setActiveTab("add-tool")} className={`px-5 py-2.5 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${activeTab === "add-tool" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400"}`}>
            {editingId ? "✏️ تعديل أداة" : "➕ إضافة أداة جديدة"}
          </button>
          <button onClick={() => setActiveTab("received-requests")} className={`px-5 py-2.5 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${activeTab === "received-requests" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400"}`}>
            طلبات الأدوات المستلمة ({requests.length})
          </button>
        </div>

        {/* Tab 1: Tools Table */}
        {activeTab === "tools-list" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 font-bold border-b border-slate-800">
                  <th className="p-4">اسم الأداة</th>
                  <th className="p-4">التصنيف الرئيسية</th>
                  <th className="p-4">المرحلة</th>
                  <th className="p-4">الباج / Badge</th>
                  <th className="p-4 text-center">العمليات والتحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-white">{tool.title}</td>
                    <td className="p-4 text-slate-400">{tool.category}</td>
                    <td className="p-4 text-slate-400">{tool.stage}</td>
                    <td className="p-4">
                      <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold">
                        {tool.badge}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2 space-x-reverse">
                      <button onClick={() => startEditTool(tool)} className="p-1.5 text-blue-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(tool.id)} className="p-1.5 text-red-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Add/Edit Form */}
        {activeTab === "add-tool" && (
          <form onSubmit={handleSaveTool} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-w-3xl mx-auto shadow-2xl">
            <h3 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>{editingId ? "تعديل بيانات الأداة المحددة" : "إضافة ونشر أداة برمجية جديدة فورياً"}</span>
            </h3>

            <input 
              type="text" required name="title" value={formData.title} onChange={handleInputChange} 
              placeholder="عنوان الأداة أو اسم البرومبت" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select name="category" value={formData.category} onChange={handleInputChange} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none">
                <option value="prompt-engineering">A. هندسة الأوامر (Prompt Engineering)</option>
                <option value="live-web-apps">B. تطبيقات الويب الحية (Live Web Apps)</option>
                <option value="automation-software">C. برمجيات الأتمتة (Automation Software)</option>
                <option value="ai-solutions">D. حلول الذكاء الاصطناعي (AI Solutions)</option>
                <option value="management-control">E. الإدارة والتحكم (Management & Control)</option>
              </select>

              <select name="stage" value={formData.stage} onChange={handleInputChange} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none">
                <option value="design">مرحلة التصميم</option>
                <option value="execution">مرحلة التنفيذ والموقع</option>
                <option value="technical-office">المكتب الفني والكميات</option>
              </select>

              <select name="badge" value={formData.badge} onChange={handleInputChange} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none">
                <option value="مجانية">مجانية</option>
                <option value="تجريبية">تجريبية</option>
                <option value="Pro">Pro (احترافية)</option>
              </select>
            </div>

            <textarea 
              rows="3" required name="description" value={formData.description} onChange={handleInputChange} 
              placeholder="الوصف الفني والشرح المفصل للأداة..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
            ></textarea>

            {formData.category === "prompt-engineering" && (
              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold text-cyan-400">إعدادات قوالب البرومبت</h4>
                <textarea rows="3" name="secretPrompt" value={formData.secretPrompt} onChange={handleInputChange} placeholder="قالب البرومبت الذكي (استخدم [input_area] و [input_price] للمتغيرات)..." className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"></textarea>
                <input type="text" name="placeholdersInput" value={formData.placeholdersInput} onChange={handleInputChange} placeholder="الحقول المحددة تفصلها فاصلة (مثال: input_area, input_price)" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none" />
              </div>
            )}

            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20">
              <Save className="h-4 w-4 inline ml-1" />
              <span>{editingId ? "حفظ التعديلات والتحديث المباشر" : "نشر الأداة فورياً للجمهور"}</span>
            </button>
          </form>
        )}

        {/* Tab 3: Tool Requests */}
        {activeTab === "received-requests" && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {requests.length === 0 ? (
              <p className="text-center text-slate-500 text-xs py-12 bg-slate-900 border border-slate-800 rounded-2xl">لا توجد طلبات مستلمة حالياً من واجهة الجمهور.</p>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative space-y-2">
                  <button onClick={() => handleDeleteRequest(req.id)} className="absolute left-4 top-4 text-red-400 hover:text-white bg-slate-800 p-1.5 rounded-lg border border-slate-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <p className="text-xs font-bold text-cyan-400">{req.name} ({req.email} | {req.phone})</p>
                  <p className="text-[10px] text-slate-500 font-mono">{req.createdAt}</p>
                  <p className="text-xs text-slate-200 bg-slate-950 p-3.5 rounded-xl border border-slate-850 mt-2 leading-relaxed">{req.details}</p>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}