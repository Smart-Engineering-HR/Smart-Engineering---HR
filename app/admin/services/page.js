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
  User,
  LogOut,
  Calendar,
  Loader2
} from 'lucide-react';

const defaultServicesData = {
  structural: [
    { id: 's1', title: 'التصميم والتحليل الإنشائي', desc: 'إعداد المخططات الإنشائية الكاملة وفق الأكواد الدولية والمحلية.' }
  ],
  architecture: [],
  smartTech: [],
  academy: []
};

const isDefaultServices = (data) => {
  if (!data) return true;
  return JSON.stringify(data) === JSON.stringify(defaultServicesData);
};

export default function AdminServicesDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [servicesData, setServicesData] = useState({
    structural: [],
    architecture: [],
    smartTech: [],
    academy: []
  });

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [adminTab, setAdminTab] = useState('manage_services');
  const [editingItem, setEditingItem] = useState(null);
  const [targetCategory, setTargetCategory] = useState('structural');
  const [formInputs, setFormInputs] = useState({ title: '', desc: '' });
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // دالة التحميل المحصنة ضد المسح التلقائي
  const loadAllData = async () => {
    try {
      const res = await fetch('/api/services', { cache: 'no-store' });
      const result = await res.json();
      
      // 1. معالجة الخدمات
      const localServices = localStorage.getItem('smart_engineering_services_cache');
      let parsedLocalServices = null;
      if (localServices) {
        try { parsedLocalServices = JSON.parse(localServices); } catch(e){}
      }

      if (result.data && !isDefaultServices(result.data)) {
        setServicesData(result.data);
        localStorage.setItem('smart_engineering_services_cache', JSON.stringify(result.data));
      } else if (parsedLocalServices && !isDefaultServices(parsedLocalServices)) {
        setServicesData(parsedLocalServices);
        fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'SYNC_BACKUP_SERVICES', backupServices: parsedLocalServices })
        }).catch(() => {});
      } else if (result.data) {
        setServicesData(result.data);
      }

      // 2. معالجة الطلبات بدون مسح الـ LocalStorage عند تفريغ السيرفر
      const localRequests = localStorage.getItem('admin_requests_backup');
      let parsedLocalRequests = [];
      if (localRequests) {
        try { parsedLocalRequests = JSON.parse(localRequests); } catch(e){}
      }

      const serverRequests = Array.isArray(result.requests) ? result.requests : [];
      
      // دمج الطلبات من السيرفر والمتصفح لعدم ضياع أي طلب
      const requestsMap = new Map();
      [...serverRequests, ...parsedLocalRequests].forEach(req => {
        if (req && req.id) requestsMap.set(req.id, req);
      });
      
      const mergedRequests = Array.from(requestsMap.values());
      setIncomingRequests(mergedRequests);
      localStorage.setItem('admin_requests_backup', JSON.stringify(mergedRequests));

      if (mergedRequests.length > serverRequests.length) {
        fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'SYNC_BACKUP_REQUESTS', backupRequests: mergedRequests })
        }).catch(() => {});
      }

    } catch (e) {
      console.error("Error loading data:", e);
    }
  };

  useEffect(() => {
    const authStatus = localStorage.getItem("services_admin_logged_in");
    if (authStatus === "true") {
      setIsLoggedIn(true);
    }
    loadAllData();
  }, []);

  const saveToAPIAndStorage = async (updatedData) => {
    setIsSaving(true);
    try {
      localStorage.setItem('smart_engineering_services_cache', JSON.stringify(updatedData));
      setServicesData(updatedData);

      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_SERVICES', servicesData: updatedData })
      });
      showToast('تم حفظ ونشر الخدمات بنجاح!');
    } catch (err) {
      showToast('تم التعديل وحفظ النسخة المحتفظ بها.');
    } fontFinally: {
      setIsSaving(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formInputs.title || !formInputs.desc) return;

    const currentCategoryList = servicesData[targetCategory] || [];
    let updatedCategoryList;

    if (editingItem) {
      updatedCategoryList = currentCategoryList.map(item => 
        item.id === editingItem.id ? { ...item, title: formInputs.title, desc: formInputs.desc } : item
      );
      setEditingItem(null);
    } else {
      const newItem = {
        id: 'item_' + Date.now(),
        title: formInputs.title,
        desc: formInputs.desc
      };
      updatedCategoryList = [...currentCategoryList, newItem];
    }

    const updatedData = {
      ...servicesData,
      [targetCategory]: updatedCategoryList
    };

    await saveToAPIAndStorage(updatedData);
    setFormInputs({ title: '', desc: '' });
  };

  const handleDeleteService = async (category, itemId) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      const updatedData = {
        ...servicesData,
        [category]: (servicesData[category] || []).filter(item => item.id !== itemId)
      };
      await saveToAPIAndStorage(updatedData);
    }
  };

  const startEditService = (category, item) => {
    setEditingItem(item);
    setTargetCategory(category);
    setFormInputs({ title: item.title, desc: item.desc });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRequest = async (reqId) => {
    if (confirm('هل ترغب بحذف سجل هذا الطلب؟')) {
      const filteredRequests = incomingRequests.filter(req => req.id !== reqId);
      setIncomingRequests(filteredRequests);
      localStorage.setItem('admin_requests_backup', JSON.stringify(filteredRequests));
      
      try {
        await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'DELETE_REQUEST', requestId: reqId })
        });
      } catch (e) {}

      showToast('تم حذف الطلب.');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail === "admin@smartengineering.com" && loginPassword === "AdminPassword2026") {
      localStorage.setItem("services_admin_logged_in", "true");
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("❌ بيانات الدخول غير صحيحة!");
    }
  };

  const handleLogout = () => {
    if (confirm("هل تريد تسجيل الخروج؟")) {
      localStorage.removeItem("services_admin_logged_in");
      setIsLoggedIn(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-right font-sans dir-rtl">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-cyan-400">🔐 دخول إدارة الخدمات</h2>
            <p className="text-xs text-slate-400">منصة الهندسة الذكية والموارد البشرية</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-semibold">البريد الإلكتروني:</label>
              <input 
                type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-cyan-400"
                placeholder="admin@smartengineering.com"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-semibold">كلمة السر:</label>
              <input 
                type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-cyan-400"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-cyan-500 text-slate-950 font-extrabold rounded-xl text-sm hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              تسجيل الدخول 🚀
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased dir-rtl">
      
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-cyan-400 text-slate-950 font-extrabold shadow-[0_0_30px_rgba(34,211,238,0.4)] flex items-center gap-3 border border-cyan-200">
          <CheckCircle className="w-5 h-5" />
          <span className="text-xs sm:text-sm">{toastMessage}</span>
        </div>
      )}

      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              AD
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                لوحة التحكم بالخدمات والاستشارات
              </h1>
              <p className="text-xs text-slate-400">إدارة الخدمات المستمرة واستقبال طلبات الزوار</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAdminTab('manage_services')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'manage_services' ? 'bg-cyan-400 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              إدارة الخدمات
            </button>
            <button
              onClick={() => setAdminTab('view_requests')}
              className={`px-4 py-2 rounded-xl text-xs font-bold relative transition-all ${adminTab === 'view_requests' ? 'bg-cyan-400 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              <span>الطلبات المستلمة</span>
              {incomingRequests?.length > 0 && (
                <span className="absolute -top-1.5 -left-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {incomingRequests.length}
                </span>
              )}
            </button>
            <button onClick={handleLogout} className="p-2 rounded-xl bg-slate-900 text-red-400 hover:bg-red-500/10 transition-colors" title="تسجيل الخروج">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {adminTab === 'manage_services' && (
          <div className="space-y-10">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"></div>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                {editingItem ? <Edit3 className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-cyan-400" />}
                <span>{editingItem ? 'تعديل الخدمة' : 'إضافة ونشر خدمة جديدة'}</span>
              </h3>

              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">اختر القسم الهندسي *</label>
                  <select
                    value={targetCategory} onChange={(e) => setTargetCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs transition-colors"
                  >
                    <option value="structural">1. الخدمات الإنشائية والمدنية</option>
                    <option value="architecture">2. الهندسة المعمارية والتصميم</option>
                    <option value="smartTech">3. التحول الرقمي وأتمتة الهندسة (Smart Tech)</option>
                    <option value="academy">4. التدريب والتطوير المهني (Academy)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">عنوان الخدمة *</label>
                  <input
                    type="text" required value={formInputs.title} onChange={(e) => setFormInputs(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs transition-colors"
                    placeholder="اسم الخدمة..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">الوصف والشرح *</label>
                  <input
                    type="text" required value={formInputs.desc} onChange={(e) => setFormInputs(prev => ({ ...prev, desc: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs transition-colors"
                    placeholder="وصف فائدة الخدمة..."
                  />
                </div>
                
                <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                  {editingItem && (
                    <button
                      type="button" onClick={() => { setEditingItem(null); setFormInputs({ title: '', desc: '' }); }}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors text-xs font-semibold"
                    >
                      إلغاء التعديل
                    </button>
                  )}
                  <button
                    type="submit" disabled={isSaving}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-md ${editingItem ? 'bg-amber-400 text-slate-950' : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'}`}
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{editingItem ? 'حفظ التعديلات' : 'نشر الخدمة للجمهور'}</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-8">
              <h4 className="text-lg font-bold text-white border-b border-slate-800 pb-3">الخدمات النشطة حالياً</h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Layers className="w-5 h-5" />
                  <h5 className="font-bold text-sm text-white">1. الخدمات الإنشائية والمدنية ({servicesData?.structural?.length || 0})</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicesData?.structural?.map(item => (
                    <div key={item.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h6 className="font-bold text-slate-200 text-xs sm:text-sm">{item.title}</h6>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => startEditService('structural', item)} className="p-2 rounded-xl bg-slate-900 text-amber-400 hover:bg-slate-800"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteService('structural', item.id)} className="p-2 rounded-xl bg-slate-900 text-red-400 hover:bg-slate-800"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Compass className="w-5 h-5" />
                  <h5 className="font-bold text-sm text-white">2. الهندسة المعمارية والتصميم ({servicesData?.architecture?.length || 0})</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicesData?.architecture?.map(item => (
                    <div key={item.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h6 className="font-bold text-slate-200 text-xs sm:text-sm">{item.title}</h6>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => startEditService('architecture', item)} className="p-2 rounded-xl bg-slate-900 text-amber-400 hover:bg-slate-800"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteService('architecture', item.id)} className="p-2 rounded-xl bg-slate-900 text-red-400 hover:bg-slate-800"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 text-purple-400">
                  <Cpu className="w-5 h-5" />
                  <h5 className="font-bold text-sm text-white">3. التحول الرقمي وأتمتة الهندسة ({servicesData?.smartTech?.length || 0})</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicesData?.smartTech?.map(item => (
                    <div key={item.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h6 className="font-bold text-slate-200 text-xs sm:text-sm">{item.title}</h6>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => startEditService('smartTech', item)} className="p-2 rounded-xl bg-slate-900 text-amber-400 hover:bg-slate-800"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteService('smartTech', item.id)} className="p-2 rounded-xl bg-slate-900 text-red-400 hover:bg-slate-800"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <GraduationCap className="w-5 h-5" />
                  <h5 className="font-bold text-sm text-white">4. التدريب والتطوير المهني ({servicesData?.academy?.length || 0})</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicesData?.academy?.map(item => (
                    <div key={item.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h6 className="font-bold text-slate-200 text-xs sm:text-sm">{item.title}</h6>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => startEditService('academy', item)} className="p-2 rounded-xl bg-slate-900 text-amber-400 hover:bg-slate-800"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteService('academy', item.id)} className="p-2 rounded-xl bg-slate-900 text-red-400 hover:bg-slate-800"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {adminTab === 'view_requests' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Inbox className="w-5 h-5 text-cyan-400" />
                <span>طلبات الخدمات والاستشارات المستلمة ({incomingRequests?.length || 0})</span>
              </h3>
            </div>

            {(!incomingRequests || incomingRequests.length === 0) ? (
              <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-3">
                <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs sm:text-sm">لا توجد طلبات خدمات أو استشارات واردة حتى الآن.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {incomingRequests.map((req) => (
                  <div key={req.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-cyan-400"></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4 mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${req.type?.includes('استشارة') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                            {req.type}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">التاريخ: {req.createdAt}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white pt-1">
                          الخدمة المطلوب تنفيذها: <span className="text-cyan-400">{req.serviceName}</span> ({req.serviceCategory})
                        </h4>
                      </div>
                      
                      <button 
                        onClick={() => handleDeleteRequest(req.id)}
                        className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف الطلب</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 mb-4 text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <User className="w-4 h-4 text-slate-500" />
                        <span>العميل: <strong className="text-white">{req.fullName}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span>البريد: <span className="text-cyan-400 font-mono select-all">{req.email}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-slate-500 font-bold">☏</span>
                        <span>الهاتف/الواتساب: <span className="text-white font-mono select-all">{req.phone}</span></span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">تفاصيل رسالة الطلب:</div>
                      <div className="text-xs bg-slate-950 p-4 rounded-2xl border border-slate-900 text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                        <strong>الموضوع: {req.subject === 'اخر' ? req.customSubject : req.subject}</strong>
                        <br /><br />
                        {req.message}
                      </div>
                    </div>

                    {req.dateTime && (
                      <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-amber-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>الموعد المطلوب للاستشارة:</span>
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