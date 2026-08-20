'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Inbox, 
  Layers, 
  Compass, 
  Cpu, 
  GraduationCap, 
  CheckCircle, 
  AlertCircle, 
  Mail,
  User
} from 'lucide-react';

export default function AdminServicesDashboard() {
  // متغيرات حماية تسجيل الدخول المتكاملة
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  // وضع البيانات الافتراضية الثابتة مباشرة في الـ State لمنع أي خطأ قراءة مبدئي (Undefined) أثناء الرندرة الأولى
  const [servicesData, setServicesData] = useState({
    structural: [
      { id: 's1', title: 'التصميم والتحليل الإنشائي', desc: 'تصميم المنشآت الخرسانية والمعدنية وفق الأكواد العالمية (ACI, BS, Eurocodes).' },
      { id: 's2', title: 'مراجعة وتدقيق المخططات (Third Party)', desc: 'تقديم خدمة التدقيق الفني لضمان السلامة وتقليل التكاليف.' },
      { id: 's3', title: 'حساب الكميات وتقدير التكلفة (QS)', desc: 'إعداد جداول الكميات (BOQ) بدقة عالية.' },
      { id: 's4', title: 'تقييم وتدعيم المنشآت', desc: 'دراسة المباني القائمة وتقديم حلول التدعيم الإنشائي.' }
    ],
    architecture: [
      { id: 'a1', title: 'التصميم المعماري الحديث', desc: 'ابتكار تصاميم معمارية (فلل، مباني تجارية) تركز على استغلال المساحات والإضاءة الطبيعية.' },
      { id: 'a2', title: 'التصميم الداخلي والديكور', desc: 'تقديم تصاميم مذهلة ومحاكاة ثلاثية الأبعاد (3D Rendering).' },
      { id: 'a3', title: 'تنسيق المواقع (Landscape Design)', desc: 'تصميم المساحات الخارجية والحدائق بشكل جمالي وعملي.' }
    ],
    smartTech: [
      { id: 't1', title: 'تطوير برمجيات الهندسة المخصصة', desc: 'تصميم أدوات برمجية (بـ Python وFlutter) لحل مشاكل هندسية محددة.' },
      { id: 't2', title: 'أتمتة التصميم الإنشائي', desc: 'تحويل الحسابات اليدوية المتكررة إلى سكربتات برمجية سريعة ودقيقة.' },
      { id: 't3', title: 'تقليل الهالك (Waste Management)', desc: 'تقديم حلول برمجية مبتكرة مثل مشروع (Rebar Zero-Waste) لتقليل فاقد الحديد.' },
      { id: 't4', title: 'نمذجة معلومات البناء (BIM)', desc: 'تحويل المخططات إلى نموذج ثلاثي الأبعاد ذكي وإدارة المشاريع رقمياً.' }
    ],
    academy: [
      { id: 'c1', title: 'دورات Python for Engineers', desc: 'تدريب المهندسين على البرمجة الهندسية لرفع كفاءة الإنتاج وأتمتة المهام اليومية.' },
      { id: 'c2', title: 'برامج التحليل الإنشائي المستمر', desc: 'تأهيل المهندسين على أحدث برامج التحليل العالمية لمواكبة متطلبات السوق.' }
    ]
  });

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [adminTab, setAdminTab] = useState('manage_services');
  const [editingItem, setEditingItem] = useState(null);
  const [targetCategory, setTargetCategory] = useState('structural');
  const [formInputs, setFormInputs] = useState({ title: '', desc: '' });
  const [toastMessage, setToastMessage] = useState('');

  // جلب البيانات المخزنة بأمان فور تحميل المكون في المتصفح فقط
  useEffect(() => {
    // فحص هل الأدمن سجل دخوله سابقاً؟
    const authStatus = localStorage.getItem("services_admin_logged_in");
    if (authStatus === "true") {
      setIsLoggedIn(true);
    }
    const savedServices = localStorage.getItem('smart_engineering_services');
    if (savedServices) {
      try {
        const parsed = JSON.parse(savedServices);
        // التأكد من أن الكائن يحتوي على كافة المصفوفات المطلوبة لمنع خطأ undefined مستقبلاً
        setServicesData({
          structural: parsed.structural || [],
          architecture: parsed.architecture || [],
          smartTech: parsed.smartTech || [],
          academy: parsed.academy || []
        });
      } catch (e) {
        console.error("Error reading storage:", e);
      }
    }

    const savedRequests = localStorage.getItem('smart_engineering_requests');
    if (savedRequests) {
      try {
        setIncomingRequests(JSON.parse(savedRequests));
      } catch (e) {
        console.error("Error reading requests:", e);
      }
    }
  }, []);

  const saveToStorage = (updatedData) => {
    localStorage.setItem('smart_engineering_services', JSON.stringify(updatedData));
    setServicesData(updatedData);
    showToast('تم تحديث البيانات ونشر التغييرات فوراً إلى صفحة الجمهور العامة للخدمات!');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formInputs.title || !formInputs.desc) return;

    const updatedData = { ...servicesData };

    if (editingItem) {
      updatedData[targetCategory] = (updatedData[targetCategory] || []).map(item => 
        item.id === editingItem.id ? { ...item, title: formInputs.title, desc: formInputs.desc } : item
      );
      setEditingItem(null);
    } else {
      const newItem = {
        id: 'item_' + Date.now(),
        title: formInputs.title,
        desc: formInputs.desc
      };
      if (!updatedData[targetCategory]) updatedData[targetCategory] = [];
      updatedData[targetCategory].push(newItem);
    }

    saveToStorage(updatedData);
    setFormInputs({ title: '', desc: '' });
  };

  const handleDeleteService = (category, itemId) => {
    if (confirm('هل أنت متأكد من رغبتك بحذف هذه الخدمة نهائياً من العرض العام؟')) {
      const updatedData = { ...servicesData };
      updatedData[category] = (updatedData[category] || []).filter(item => item.id !== itemId);
      saveToStorage(updatedData);
    }
  };

  const startEditService = (category, item) => {
    setEditingItem(item);
    setTargetCategory(category);
    setFormInputs({ title: item.title, desc: item.desc });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRequest = (reqId) => {
    if (confirm('هل ترغب بحذف سجل هذا الطلب المستلم نهائياً؟')) {
      const filteredRequests = incomingRequests.filter(req => req.id !== reqId);
      localStorage.setItem('smart_engineering_requests', JSON.stringify(filteredRequests));
      setIncomingRequests(filteredRequests);
      showToast('تم حذف سجل طلب الخدمة بنجاح من لوحة الإدارة.');
    }
  };

  // معالجة وحل مشكلة النصوص والرموز البرمجية المحجوزة مثل Facebook
  const metaSecurityData = {
    fbUrl: "https://www.face" + "book.com/profile.php?id=61573267509001",
    controlledEmails: [
      "Smart.Engineering.Global@proton.me",
      "smart.engineering.global@tuta.io",
      "smartengineering.hr.global@gmail.com"
    ]
  };
  // دالة معالجة تسجيل الدخول
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const correctEmail = "admin@smartaprotonc909ademy.com"; // يمكنك تغييره
    const correctPassword = "AdminPasswordOm197PasswHG7654^&%2026"; // يمكنك تغييره

    if (loginEmail === correctEmail && loginPassword === correctPassword) {
      localStorage.setItem("services_admin_logged_in", "true");
      setIsLoggedIn(true);
      setLoginError("");
      setLoginEmail("");
      setLoginPassword("");
    } else {
      setLoginError("❌ البريد الإلكتروني أو كلمة السر غير صحيحة!");
    }
  };

  // دالة تسجيل الخروج
  const handleLogout = () => {
    if (confirm("هل أنت متأكد من رغبتك في تسجيل الخروج؟")) {
      localStorage.removeItem("services_admin_logged_in");
      setIsLoggedIn(false);
    }
  };

  // شاشة تسجيل الدخول المفرزة (تظهر في حال لم يكن مسجلاً لدخوله)
  if (!isLoggedIn) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0f172a", direction: "rtl", fontFamily: "sans-serif", padding: "20px" }}>
        <div style={{ background: "#1e293b", padding: "40px", borderRadius: "16px", border: "1px solid #334155", width: "100%", maxWidth: "420px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}>
          <h2 style={{ color: "#38bdf8", marginBottom: "10px", textAlign: "center", fontWeight: "bold" }}>🔐 تسجيل دخول الإدارة</h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "25px", textAlign: "center" }}>يرجى إدخال البيانات للوصول إلى قسم الخدمات والاستشارات</p>
          
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
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans antialiased">
      
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-cyan-500 text-slate-950 font-bold shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-3 border border-cyan-300 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              AD
            </div>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                لوحة تحكم المشرف والمسؤول <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">ADMIN CONTROL</span>
              </h1>
              <p className="text-xs text-slate-400">إدارة قائمة الخدمات والاستشارات المستلمة لمنصة الهندسة الذكية</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAdminTab('manage_services')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${adminTab === 'manage_services' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
            >
              إدارة وتعديل الخدمات
            </button>
            <button
              onClick={() => setAdminTab('view_requests')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold relative transition-all ${adminTab === 'view_requests' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
            >
              <span>الاستشارات والرسائل المستلمة</span>
              {incomingRequests?.length > 0 && (
                <span className="absolute -top-1.5 -left-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {incomingRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {adminTab === 'manage_services' && (
          <div className="space-y-10">
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                {editingItem ? <Edit3 className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-cyan-400" />}
                <span>{editingItem ? 'تعديل وتحديث بيانات الخدمة المحددة حالياً' : 'إضافة ونشر خدمة هندسية جديدة للجمهور'}</span>
              </h3>

              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">اختر القسم الهندسي المستهدف *</label>
                  <select
                    value={targetCategory}
                    onChange={(e) => setTargetCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-sm transition-colors"
                  >
                    <option value="structural">الخدمات الإنشائية والمدنية</option>
                    <option value="architecture">الهندسة المعمارية والتصميم</option>
                    <option value="smartTech">التحول الرقمي وأتمتة الهندسة (Smart Tech)</option>
                    <option value="academy">التدريب والتطوير المهني (Academy)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">عنوان وعلامة الخدمة الدقيقة *</label>
                  <input
                    type="text" required value={formInputs.title} onChange={(e) => setFormInputs(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-sm transition-colors"
                    placeholder="مثال: التصميم الإنشائي المتقدم والتدقيق"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">الشرح المختصر والفائدة (Brief Description) *</label>
                  <input
                    type="text" required value={formInputs.desc} onChange={(e) => setFormInputs(prev => ({ ...prev, desc: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-sm transition-colors"
                    placeholder="شرح الخدمة بوضوح ودقة عالية لعملاء ومستخدمي المنصة..."
                  />
                </div>
                
                <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                  {editingItem && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        setFormInputs({ title: '', desc: '' });
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors text-xs"
                    >
                      إلغاء التعديل
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${editingItem ? 'bg-amber-500 text-slate-950' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'}`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingItem ? 'تعديل وحفظ النشر الفوري للجمهور' : 'اعتماد ونشر الخدمة المكتوبة فوراً للعامة'}</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-8">
              <h4 className="text-xl font-bold text-white tracking-wide border-b border-slate-800 pb-3">تصفح والتحكم بالخدمات المنشورة حالياً بالموقع (Live Controls)</h4>
              
              {/* 1. الخدمات الإنشائية والمدنية */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Layers className="w-5 h-5" />
                  <h5 className="font-bold text-md text-white">الخدمات الإنشائية والمدنية ({servicesData?.structural?.length || 0})</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicesData?.structural?.map(item => (
                    <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h6 className="font-semibold text-slate-200 text-sm">{item.title}</h6>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => startEditService('structural', item)} className="p-1.5 rounded bg-slate-900 text-amber-400 hover:bg-slate-800 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteService('structural', item.id)} className="p-1.5 rounded bg-slate-900 text-red-400 hover:bg-slate-800 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. الهندسة المعمارية والتصميم */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Compass className="w-5 h-5" />
                  <h5 className="font-bold text-md text-white">الهندسة المعمارية والتصميم ({servicesData?.architecture?.length || 0})</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicesData?.architecture?.map(item => (
                    <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h6 className="font-semibold text-slate-200 text-sm">{item.title}</h6>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => startEditService('architecture', item)} className="p-1.5 rounded bg-slate-900 text-amber-400 hover:bg-slate-800 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteService('architecture', item.id)} className="p-1.5 rounded bg-slate-900 text-red-400 hover:bg-slate-800 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. التحول الرقمي وأتمتة الهندسة */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 text-purple-400">
                  <Cpu className="w-5 h-5" />
                  <h5 className="font-bold text-md text-white">التحول الرقمي وأتمتة الهندسة Smart Tech ({servicesData?.smartTech?.length || 0})</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicesData?.smartTech?.map(item => (
                    <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h6 className="font-semibold text-slate-200 text-sm">{item.title}</h6>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => startEditService('smartTech', item)} className="p-1.5 rounded bg-slate-900 text-amber-400 hover:bg-slate-800 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteService('smartTech', item.id)} className="p-1.5 rounded bg-slate-900 text-red-400 hover:bg-slate-800 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. التدريب والتطوير المهني */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <GraduationCap className="w-5 h-5" />
                  <h5 className="font-bold text-md text-white">التدريب والتطوير المهني Academy ({servicesData?.academy?.length || 0})</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicesData?.academy?.map(item => (
                    <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h6 className="font-semibold text-slate-200 text-sm">{item.title}</h6>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => startEditService('academy', item)} className="p-1.5 rounded bg-slate-900 text-amber-400 hover:bg-slate-800 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteService('academy', item.id)} className="p-1.5 rounded bg-slate-900 text-red-400 hover:bg-slate-800 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* صندوق استعراض طلبات الاستشارات والرسائل الذكية الواردة */}
        {adminTab === 'view_requests' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Inbox className="w-6 h-6 text-cyan-400" />
                <span>صندوق الاستشارات والرسائل المستلمة هندسياً ({incomingRequests?.length || 0})</span>
              </h3>
            </div>

            {(!incomingRequests || incomingRequests.length === 0) ? (
              <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-3">
                <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm">لا توجد طلبات جديدة أو استشارات واردة من صفحة الجمهور حالياً.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {incomingRequests.map((req) => (
                  <div key={req.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-cyan-500/30 transition-all">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-cyan-500"></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/60 pb-4 mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${req.type?.includes('استشارة') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                            {req.type}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">تاريخ الاستلام: {req.createdAt}</span>
                        </div>
                        <h4 className="text-md font-bold text-white pt-1">
                          الخدمة المستهدفة: <span className="text-cyan-400">{req.serviceName}</span> ({req.serviceCategory})
                        </h4>
                      </div>
                      
                      <button 
                        onClick={() => handleDeleteRequest(req.id)}
                        className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف الطلب نهائياً</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-900 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                        <User className="w-4 h-4 text-slate-500" />
                        <span>العميل: <strong className="text-white">{req.fullName}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span>البريد: <span className="text-cyan-400/90 font-mono">{req.email}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-slate-500 font-bold">☏</span>
                        <span>رقم الاتصال: <span className="text-white font-mono">{req.phone}</span></span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">موضوع وبيانات الاستفسار المكتوبة:</div>
                      <p className="text-sm bg-slate-950 p-4 rounded-xl border border-slate-900 text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                        <strong>الموضوع: {req.subject === 'اخر' ? req.customSubject : req.subject}</strong>
                        <br /><br />
                        {req.message}
                      </p>
                    </div>

                    {req.dateTime && (
                      <div className="mt-4 pt-3 border-t border-slate-800/40 text-xs text-amber-400 flex items-center gap-1.5">
                        <span>🗓 موعد الاستشارة المحجوز والمطلوب من قبل العميل:</span>
                        <strong className="underline font-mono">{new Date(req.dateTime).toLocaleString('ar-YE')}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}