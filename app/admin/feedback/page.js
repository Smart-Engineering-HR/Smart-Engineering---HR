"use client";

import React, { useState, useEffect } from "react";
import { 
  Inbox, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  X, 
  Filter, 
  RefreshCw 
} from "lucide-react";

export default function AdminFeedbackDashboard() {
  // متغيرات حماية تسجيل الدخول المتكاملة العامة
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const defaultServices = ["تصميم إنشائي", "استشارة تقنية", "دورة تدريبية"];
  const [services, setServices] = useState(defaultServices);
  const [newService, setNewService] = useState("");
  const [editingServiceIdx, setEditingServiceIdx] = useState(null);
  const [editingServiceText, setEditingServiceText] = useState("");

  const [inbox, setInbox] = useState([]);
  const [filterType, setFilterType] = useState("all");

  // معالجة القراءة المبدئية والتأكد الكامل من صحة نوع البيانات (Array Verification)
  useEffect(() => {
    // فحص هل الأدمن سجل دخوله سابقاً على هذا المتصفح؟
    const authStatus = localStorage.getItem("feedback_admin_logged_in");
    if (authStatus === "true") {
      setIsLoggedIn(true);
    }
    try {
      const savedServices = localStorage.getItem("smart_engineering_services");
      if (savedServices) {
        const parsed = JSON.parse(savedServices);
        if (Array.isArray(parsed)) {
          setServices(parsed);
        } else {
          localStorage.setItem("smart_engineering_services", JSON.stringify(defaultServices));
        }
      } else {
        localStorage.setItem("smart_engineering_services", JSON.stringify(defaultServices));
      }
    } catch (e) {
      console.error(e);
      setServices(defaultServices);
    }

    try {
      const savedInbox = localStorage.getItem("smart_engineering_inbox");
      if (savedInbox) {
        const parsedInbox = JSON.parse(savedInbox);
        if (Array.isArray(parsedInbox)) {
          setInbox(parsedInbox);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveServicesToStorage = (updatedServices) => {
    if (Array.isArray(updatedServices)) {
      setServices(updatedServices);
      localStorage.setItem("smart_engineering_services", JSON.stringify(updatedServices));
    }
  };

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newService.trim()) return;
    const updated = [...services, newService.trim()];
    saveServicesToStorage(updated);
    setNewService("");
  };

  const handleDeleteService = (idx) => {
    const updated = services.filter((_, i) => i !== idx);
    saveServicesToStorage(updated);
  };

  const startEditService = (idx) => {
    setEditingServiceIdx(idx);
    setEditingServiceText(services[idx]);
  };

  const handleSaveEditService = () => {
    if (!editingServiceText.trim()) return;
    const updated = [...services];
    updated[editingServiceIdx] = editingServiceText.trim();
    saveServicesToStorage(updated);
    setEditingServiceIdx(null);
  };

  const handleDeleteInboxItem = (id) => {
    const updatedInbox = inbox.filter(item => item.id !== id);
    setInbox(updatedInbox);
    localStorage.setItem("smart_engineering_inbox", JSON.stringify(updatedInbox));
  };

  const handleUpdateItemStatus = (id, newStatus) => {
    const updatedInbox = inbox.map(item => {
      if (item.id === id) return { ...item, status: newStatus };
      return item;
    });
    setInbox(updatedInbox);
    localStorage.setItem("smart_engineering_inbox", JSON.stringify(updatedInbox));
  };

  const filteredInbox = Array.isArray(inbox) 
    ? (filterType === "all" ? inbox : inbox.filter(item => item.type === filterType))
    : [];
    // دالة معالجة واستقبال بيانات تسجيل الدخول
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const correctEmail = "admin@smartacademy.com"; // يمكنك تغييره
    const correctPassword = "AdminPassword2026"; // يمكنك تغييره

    if (loginEmail === correctEmail && loginPassword === correctPassword) {
      localStorage.setItem("feedback_admin_logged_in", "true");
      setIsLoggedIn(true);
      setLoginError("");
      setLoginEmail("");
      setLoginPassword("");
    } else {
      setLoginError("❌ البريد الإلكتروني أو كلمة السر غير صحيحة!");
    }
  };

  // دالة تسجيل الخروج الفورية
  const handleLogout = () => {
    if (confirm("هل أنت متأكد من رغبتك في تسجيل الخروج وإغلاق لوحة التحكم؟")) {
      localStorage.removeItem("feedback_admin_logged_in");
      setIsLoggedIn(false);
    }
  };

  // حاجز الحماية: إذا لم يسجل الدخول، اقطع قراءة باقي الملف واعرض شاشة اللوجن فقط
  if (!isLoggedIn) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0f172a", direction: "rtl", fontFamily: "sans-serif", padding: "20px" }}>
        <div style={{ background: "#1e293b", padding: "40px", borderRadius: "16px", border: "1px solid #334155", width: "100%", maxWidth: "420px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}>
          <h2 style={{ color: "#38bdf8", marginBottom: "10px", textAlign: "center", fontWeight: "bold" }}>🔐 تسجيل دخول الإدارة</h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "25px", textAlign: "center" }}>يرجى إدخال البيانات للوصول إلى قسم الآراء والتواصل</p>
          
          {loginError && <div style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid #ef4444", padding: "12px", borderRadius: "8px", marginBottom: "15px", textAlign: "center", fontSize: "14px" }}>{loginError}</div>}
          
          <form onSubmit={handleLoginSubmit}>
            <label style={{ display: "block", color: "#e2e8f0", marginBottom: "8px", fontSize: "14px" }}>البريد الإلكتروني:</label>
            <input type="email" placeholder="example@domain.com" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#fff", boxSizing: "border-box" }}/>
            
            <label style={{ display: "block", color: "#e2e8f0", marginBottom: "8px", fontSize: "14px" }}>كلمة السر:</label>
            <input type="password" placeholder="••••••••" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "25px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#fff", boxSizing: "border-box" }}/>
            
            <button type="submit" style={{ background: "#38bdf8", color: "#0f172a", padding: "12px", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", width: "100%" }}>دخول آمن 🚀</button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6" style={{ direction: 'rtl' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* الهيدر العلوي للوحة الإدارة */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              لوحة تحكم الأدمن لـ "شاركنا رأيك"
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              التحكم والسيطرة الفنية 100% بكافة مدخلات ومخرجات ومقترحات المنصة الذكية المتصلة بالجمهور
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.reload()} 
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-cyan-400"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <div className="text-xs bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 px-4 py-2 rounded-xl font-medium">
              حالة النظام: متصل بالواجهة العامة للجمهور
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* العمود الجانبي: التحكم بالخدمات */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                <Plus className="text-cyan-400 w-5 h-5" /> التحكم بقائمة الخدمات الهندسية
              </h3>
              
              <form onSubmit={handleAddService} className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  placeholder="إضافة خدمة جديدة للمنصة..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                />
                <button type="submit" className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all">
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {Array.isArray(services) && services.map((srv, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800/60 rounded-xl">
                    {editingServiceIdx === idx ? (
                      <div className="flex gap-1 w-full">
                        <input 
                          type="text" 
                          className="flex-1 bg-slate-900 border border-cyan-500 rounded-lg px-2 py-1 text-xs text-slate-200"
                          value={editingServiceText}
                          onChange={(e) => setEditingServiceText(e.target.value)}
                        />
                        <button onClick={handleSaveEditService} className="p-1 text-emerald-400 hover:bg-slate-800 rounded"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingServiceIdx(null)} className="p-1 text-rose-400 hover:bg-slate-800 rounded"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-medium text-slate-300">{srv}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEditService(idx)} className="p-1.5 text-slate-400 hover:text-cyan-400 transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteService(idx)} className="p-1.5 text-slate-400 hover:text-rose-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* العمود الرئيسي: صندوق الوارد الفوري والبطاقات الذكية */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-slate-200">صندوق المقترحات والآراء المستلمة</h3>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  {[
                    { id: "all", label: "الكل" },
                    { id: "general", label: "الذكية العامة" },
                    { id: "service", label: "الخدمات" },
                    { id: "code", label: "المقترحات البرمجية" },
                    { id: "ux", label: "تجربة المستخدم" },
                    { id: "success", label: "قصص النجاح" }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setFilterType(btn.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                        filterType === btn.id
                          ? "bg-purple-600 text-white"
                          : "bg-slate-950 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredInbox.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    لا توجد أي طلبات أو آراء مستلمة حالياً ضمن التصنيف المختار.
                  </div>
                ) : (
                  filteredInbox.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-5 bg-slate-950 border rounded-xl transition-all relative group ${
                        item.status === 'resolved' ? 'border-emerald-900/60 opacity-75' : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                            item.type === 'general' ? 'bg-cyan-950 text-cyan-400' :
                            item.type === 'service' ? 'bg-amber-950 text-amber-400' :
                            item.type === 'code' ? 'bg-purple-950 text-purple-400' :
                            item.type === 'ux' ? 'bg-blue-950 text-blue-400' : 'bg-teal-950 text-teal-400'
                          }`}>
                            {item.type === 'general' && 'النموذج العام'}
                            {item.type === 'service' && 'تقييم خدمة'}
                            {item.type === 'code' && 'مقترح برمي'}
                            {item.type === 'ux' && 'تجربة المستخدم'}
                            {item.type === 'success' && 'قصة نجاح'}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">{item.submittedAt}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all">
                          {item.status !== 'resolved' ? (
                            <button 
                              onClick={() => handleUpdateItemStatus(item.id, 'resolved')}
                              className="p-1.5 text-emerald-400 hover:bg-slate-900 rounded-lg" 
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleUpdateItemStatus(item.id, 'pending')}
                              className="p-1.5 text-amber-400 hover:bg-slate-900 rounded-lg" 
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteInboxItem(item.id)}
                            className="p-1.5 text-rose-400 hover:bg-slate-900 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-slate-300 leading-relaxed">
                        {item.type === "general" && item.data && (
                          <>
                            <p><strong className="text-slate-400">الاسم:</strong> {item.data.name || "مجهول"}</p>
                            <p><strong className="text-slate-400">التخصص:</strong> {item.data.specialty}</p>
                            <p><strong className="text-slate-400">نوع المشاركة:</strong> {item.data.type}</p>
                            <p className="bg-slate-900 p-3 rounded-lg border border-slate-800/80 mt-1"><strong className="text-slate-400 block mb-1">الموضوع:</strong>{item.data.subject}</p>
                          </>
                        )}

                        {item.type === "service" && item.data && (
                          <>
                            <p><strong className="text-slate-400">الخدمة المقيمة:</strong> {item.data.service}</p>
                            <div className="flex gap-4 my-2 text-xs text-amber-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
                              <span>الجودة: {item.data.quality} ★</span>
                              <span>المواعيد: {item.data.timing} ★</span>
                              <span>التواصل: {item.data.response} ★</span>
                            </div>
                            {item.data.improvement && <p><strong className="text-slate-400">مقترحات التحسين:</strong> {item.data.improvement}</p>}
                          </>
                        )}

                        {item.type === "code" && item.data && (
                          <div className="bg-slate-900/80 p-3 rounded-lg border border-purple-900/20">
                            <strong className="text-purple-400 block mb-1">الأداة المطلوبة / السكريبت المقترح:</strong>
                            <p className="font-mono text-xs">{item.data.proposal}</p>
                          </div>
                        )}

                        {item.type === "ux" && item.data && (
                          <>
                            <p><strong className="text-slate-400">مستوى الرضا والسهولة:</strong> <span className="text-cyan-400 font-bold">{item.data.rating}</span></p>
                            {item.data.screenshot && <p className="text-xs text-rose-400 font-mono mt-1">📎 مرفق لقطة شاشة: {item.data.screenshot}</p>}
                          </>
                        )}

                        {item.type === "success" && item.data && (
                          <>
                            <p><strong className="text-slate-400">الاسم والتخصص:</strong> {item.data.name || "مجهول"} - {item.data.specialty}</p>
                            <p className="bg-slate-900 p-3 rounded-lg border border-slate-800 mt-1">{item.data.subject}</p>
                            <p className="text-xs text-emerald-400 mt-1">✓ {item.data.allowPublish ? "يسمح بالنشر في الصفحة الرئيسية" : "يرغب بالخصوصية"}</p>
                          </>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}