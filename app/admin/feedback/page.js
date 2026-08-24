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
  RefreshCw,
  LogOut,
  Lock,
  ShieldCheck,
  CheckCircle,
  Clock,
  ExternalLink,
  Layers
} from "lucide-react";

export default function AdminFeedbackDashboard() {
  // متغيرات حماية وتسجيل دخول الأدمن
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // القائمة الديناميكية للخدمات
  const defaultServices = [
    "تصميم إنشائي",
    "استشارة تقنية",
    "دورة تدريبية",
    "تخطيط معماري",
    "إدارة مشاريع هندسية",
    "أتمتة وبرمجيات هندسية"
  ];
  const [services, setServices] = useState(defaultServices);
  const [newService, setNewService] = useState("");
  const [editingServiceIdx, setEditingServiceIdx] = useState(null);
  const [editingServiceText, setEditingServiceText] = useState("");

  // صندوق الرسائل الواردة والفلترة
  const [inbox, setInbox] = useState([]);
  const [filterType, setFilterType] = useState("all");

  // التحقق المبدئي والتأكد الكامل من استدعاء البيانات
  useEffect(() => {
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
      console.error("خطأ في جلب الخدمات:", e);
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
      console.error("خطأ في جلب الرسائل:", e);
    }
  }, []);

  // حفظ قائمة الخدمات وإعادة التزامن مع الواجهة الرئيسية
  const saveServicesToStorage = (updatedServices) => {
    if (Array.isArray(updatedServices)) {
      setServices(updatedServices);
      localStorage.setItem("smart_engineering_services", JSON.stringify(updatedServices));
    }
  };

  // إضافة خدمة جديدة للجمهور
  const handleAddService = (e) => {
    e.preventDefault();
    if (!newService.trim()) return;
    const updated = [...services, newService.trim()];
    saveServicesToStorage(updated);
    setNewService("");
  };

  // حذف خدمة من الخدمات المعروضة للجمهور
  const handleDeleteService = (idx) => {
    if (confirm("هل أنت متأكد من حذف هذه الخدمة من القائمة العامة؟")) {
      const updated = services.filter((_, i) => i !== idx);
      saveServicesToStorage(updated);
    }
  };

  // بدء التعديل على الخدمة
  const startEditService = (idx) => {
    setEditingServiceIdx(idx);
    setEditingServiceText(services[idx]);
  };

  // حفظ تعديل الخدمة
  const handleSaveEditService = () => {
    if (!editingServiceText.trim()) return;
    const updated = [...services];
    updated[editingServiceIdx] = editingServiceText.trim();
    saveServicesToStorage(updated);
    setEditingServiceIdx(null);
  };

  // حذف عنصر من صندوق الوارد
  const handleDeleteInboxItem = (id) => {
    if (confirm("هل أنت متأكد من حذف هذه المشاركة نهائياً؟")) {
      const updatedInbox = inbox.filter(item => item.id !== id);
      setInbox(updatedInbox);
      localStorage.setItem("smart_engineering_inbox", JSON.stringify(updatedInbox));
    }
  };

  // تغيير حالة الرسالة (مكتملة / قيد الانتظار)
  const handleUpdateItemStatus = (id, newStatus) => {
    const updatedInbox = inbox.map(item => {
      if (item.id === id) return { ...item, status: newStatus };
      return item;
    });
    setInbox(updatedInbox);
    localStorage.setItem("smart_engineering_inbox", JSON.stringify(updatedInbox));
  };

  // تصفية الرسائل الواردة بناءً على الفلتر المختار
  const filteredInbox = Array.isArray(inbox) 
    ? (filterType === "all" ? inbox : inbox.filter(item => item.type === filterType))
    : [];

  // معالجة تسجيل دخول الأدمن
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const correctEmail = "adminsmartaprotonc9@smfffartacademy.com";
    const correctPassword = "AdminPass&^%$bbbbb2026%&^&^%$bbbbb2026%&^word2026";

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

  // تسجيل الخروج الآمن
  const handleLogout = () => {
    if (confirm("هل أنت متأكد من رغبتك في إغلاق لوحة التحكم؟")) {
      localStorage.removeItem("feedback_admin_logged_in");
      setIsLoggedIn(false);
    }
  };

  // حائل حماية لوحة الأدمن عند عدم تسجيل الدخول
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4" style={{ direction: "rtl" }}>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-center text-slate-100 mb-1">تسجيل دخول الإدارة</h2>
          <p className="text-xs text-slate-400 text-center mb-6">منصة الهندسة الذكية - لوحة التحكم لقائمة "شاركنا رأيك"</p>
          
          {loginError && (
            <div className="bg-rose-950/60 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs text-center mb-4 font-bold">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">البريد الإلكتروني للإدارة:</label>
              <input 
                type="email" 
                required 
                placeholder="admin@smartengineering.com"
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة المرور:</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
            
            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-500/20 transition-all text-sm">
              دخول آمن للوحة التحكم 🚀
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8" style={{ direction: 'rtl' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* الهيدر العلوي لعمليات الإدارة */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-cyan-400" />
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                لوحة تحكم الأدمن الشاملة - شاركنا رأيك
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              إدارة خدمات تقييم الجمهور، نشر وتعديل وتحديث الخدمات، ومتابعة جميع المقترحات والرسائل الموجهة للإيميلات والداشبورد.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.reload()} 
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-cyan-400"
              title="تحديث البيانات"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-950/40 border border-rose-800/50 hover:bg-rose-900/60 text-rose-300 rounded-xl text-xs font-bold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* العمود الأول: التحكم وإضافة ونشر الخدمات العامة */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Plus className="text-cyan-400 w-5 h-5" /> إضافة وتحديث الخدمات للجمهور
              </h3>
              
              <form onSubmit={handleAddService} className="flex gap-2 mb-5">
                <input 
                  type="text" 
                  placeholder="اسم الخدمة الجديدة..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                />
                <button type="submit" className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all text-xs shrink-0 flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  <span>إضافة</span>
                </button>
              </form>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {Array.isArray(services) && services.map((srv, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800/80 rounded-xl">
                    {editingServiceIdx === idx ? (
                      <div className="flex gap-1 w-full">
                        <input 
                          type="text" 
                          className="flex-1 bg-slate-900 border border-cyan-500 rounded-lg px-2 py-1 text-xs text-slate-200"
                          value={editingServiceText}
                          onChange={(e) => setEditingServiceText(e.target.value)}
                        />
                        <button onClick={handleSaveEditService} className="p-1.5 text-emerald-400 hover:bg-slate-800 rounded-lg"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingServiceIdx(null)} className="p-1.5 text-rose-400 hover:bg-slate-800 rounded-lg"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-semibold text-slate-300">{srv}</span>
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

          {/* العمود الثاني: صندوق الرسائل والآراء والتحكم الإداري */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-slate-200">صندوق الآراء والمشاركات المستلمة ({filteredInbox.length})</h3>
                </div>
                
                {/* أزرار الفلترة التصنيفية */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: "all", label: "الكل" },
                    { id: "general", label: "الذكي العام" },
                    { id: "service", label: "الخدمات" },
                    { id: "code", label: "برمجة" },
                    { id: "ux", label: "UX" },
                    { id: "success", label: "قصص النجاح" }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setFilterType(btn.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                        filterType === btn.id
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                          : "bg-slate-950 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* قائمة البطاقات الواردة */}
              <div className="space-y-4">
                {filteredInbox.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    لا توجد مشاركات مستلمة حالياً في هذا التصنيف.
                  </div>
                ) : (
                  filteredInbox.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-5 bg-slate-950 border rounded-2xl transition-all relative ${
                        item.status === 'resolved' ? 'border-emerald-900/60 opacity-80 bg-slate-950/60' : 'border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-slate-900 pb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-black ${
                            item.type === 'general' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50' :
                            item.type === 'service' ? 'bg-amber-950 text-amber-400 border border-amber-800/50' :
                            item.type === 'code' ? 'bg-purple-950 text-purple-400 border border-purple-800/50' :
                            item.type === 'ux' ? 'bg-blue-950 text-blue-400 border border-blue-800/50' : 'bg-teal-950 text-teal-400 border border-teal-800/50'
                          }`}>
                            {item.type === 'general' && 'النموذج الذكي العام'}
                            {item.type === 'service' && 'تقييم خدمة'}
                            {item.type === 'code' && 'مقترح برمجي'}
                            {item.type === 'ux' && 'تجربة المستخدم'}
                            {item.type === 'success' && 'قصة نجاح'}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">{item.submittedAt}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleUpdateItemStatus(item.id, item.status === 'resolved' ? 'pending' : 'resolved')}
                            className={`p-1.5 rounded-lg transition-all text-xs flex items-center gap-1 ${
                              item.status === 'resolved' ? 'text-amber-400 bg-amber-950/30' : 'text-emerald-400 bg-emerald-950/30'
                            }`}
                            title={item.status === 'resolved' ? "إعادة للمعالجة" : "تعليم كمكتمل"}
                          >
                            {item.status === 'resolved' ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                          </button>

                          <button 
                            onClick={() => handleDeleteInboxItem(item.id)}
                            className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg transition-all"
                            title="حذف النهائي"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* تفاصيل المحتوى المدخل لكل نوع */}
                      <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                        {item.type === "general" && item.data && (
                          <>
                            <p><strong className="text-slate-400">الاسم:</strong> {item.data.name || "مجهول"}</p>
                            <p><strong className="text-slate-400">التخصص:</strong> {item.data.specialty}</p>
                            <p><strong className="text-slate-400">نوع المشاركة:</strong> {item.data.type}</p>
                            <p className="bg-slate-900 p-3 rounded-xl border border-slate-800 mt-2"><strong className="text-cyan-400 block mb-1">الموضوع:</strong>{item.data.subject}</p>
                          </>
                        )}

                        {item.type === "service" && item.data && (
                          <>
                            <p><strong className="text-slate-400">الخدمة المقيمة:</strong> <span className="text-amber-400 font-bold">{item.data.service}</span></p>
                            <div className="flex flex-wrap gap-3 my-2 text-[11px] text-amber-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                              <span>جودة التنفيذ: {item.data.quality} ⭐</span>
                              <span>الالتزام بالمواعيد: {item.data.timing} ⭐</span>
                              <span>سرعة الاستجابة: {item.data.response} ⭐</span>
                            </div>
                            {item.data.improvement && <p><strong className="text-slate-400">الملاحظات والتحسينات:</strong> {item.data.improvement}</p>}
                          </>
                        )}

                        {item.type === "code" && item.data && (
                          <div className="bg-slate-900/90 p-3 rounded-xl border border-purple-900/30">
                            <strong className="text-purple-400 block mb-1">الأداة البرمجية أو السكريبت المقترح:</strong>
                            <p className="font-mono text-xs text-purple-200">{item.data.proposal}</p>
                          </div>
                        )}

                        {item.type === "ux" && item.data && (
                          <>
                            <p><strong className="text-slate-400">مستوى سهولة الاستخدام:</strong> <span className="text-cyan-400 font-bold">{item.data.rating}</span></p>
                            {item.data.screenshot && <p className="text-xs text-rose-400 font-mono mt-1">📎 المرفق: {item.data.screenshot}</p>}
                          </>
                        )}

                        {item.type === "success" && item.data && (
                          <>
                            <p><strong className="text-slate-400">الاسم والتخصص:</strong> {item.data.name || "مجهول"} ({item.data.specialty})</p>
                            <p className="bg-slate-900 p-3 rounded-xl border border-slate-800 mt-2">{item.data.subject}</p>
                            <p className="text-xs text-teal-400 font-bold mt-2">
                              {item.data.allowPublish ? "✓ يسمح بالنشر في قسم آراء العملاء بالصفحة الرئيسية" : "✕ يفضل الخصوصية (عدم النشر)"}
                            </p>
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