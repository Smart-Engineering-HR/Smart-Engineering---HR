"use client";

import React, { useState, useEffect } from "react";

export default function AdminSoftwareTools() {
  // تتبع التبويب النشط في لوحة تحكم الأدمن
  const [adminTab, setAdminTab] = useState("A");
  
  // حالات تخزين البيانات
  const [prompts, setPrompts] = useState([]);
  const [liveApps, setLiveApps] = useState([]);
  const [automationTools, setAutomationTools] = useState([]);
  const [aiSolutions, setAiSolutions] = useState([]);
  const [managementTools, setManagementTools] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [usersLog, setUsersLog] = useState([]);

  // حالات إدارة النوافذ والنماذج (الإضافة والتعديل)
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // تحميل البيانات الأولية ومزامنتها حياً من الـ localStorage
  useEffect(() => {
    const loadStoredData = (key, fallback) => {
      if (typeof window !== "undefined") {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
      }
      return fallback;
    };

    setPrompts(loadStoredData("smart_eng_prompts", []));
    setLiveApps(loadStoredData("smart_eng_apps", []));
    setAutomationTools(loadStoredData("smart_eng_automation", []));
    setAiSolutions(loadStoredData("smart_eng_ai", []));
    setManagementTools(loadStoredData("smart_eng_management", []));
    setIncomingRequests(loadStoredData("smart_eng_requests", [
      { id: 101, name: "م. أحمد الشميري", email: "ahmed.sh@gmail.com", phone: "+967771234567", details: "أحتاج أداة لحساب عزم اللي (Torsion) في الجسور الدائرية وفق الكود البريطاني.", date: "21/6/2026, 11:30:15 ص", status: "قيد الانتظار والمعالجة الإدارية" }
    ]));
    setUsersLog(loadStoredData("smart_eng_users", [
      { id: 1, name: "م. خالد اليافعي", email: "khaled@smarteng.com", role: "مهندس تصميم", status: "نشط" },
      { id: 2, name: "سامر عبد الله", email: "samer.test@outlook.com", role: "مستخدم عام", status: "نشط" }
    ]));
  }, []);

  // دالة حفظ التغييرات وتحديث المتصفح لضمان الانعكاس الفوري والمباشر
  const syncStorage = (key, updatedData) => {
    localStorage.setItem(key, JSON.stringify(updatedData));
  };

  // فتح نموذج الإضافة
  const handleOpenAdd = (tab) => {
    setEditingItem({ isNew: true, tab });
    if (tab === "A") setFormData({ title: "", category: "الهندسة الإنشائية", text: "", input_area: "", input_price: "" });
    else if (tab === "B") setFormData({ title: "", type: "", desc: "" });
    else if (tab === "C") setFormData({ title: "", platform: "", size: "", downloads: 0, desc: "" });
    else if (tab === "D") setFormData({ title: "", capability: "", desc: "" });
    else if (tab === "E") setFormData({ title: "", scope: "", desc: "" });
  };

  // فتح نموذج التعديل
  const handleOpenEdit = (item, tab) => {
    setEditingItem({ ...item, isNew: false, tab });
    setFormData({ ...item });
  };

  // تنفيذ عمليات الحفظ (إضافة أو تعديل)
  const handleSaveItem = (e) => {
    e.preventDefault();
    const tab = editingItem.tab;

    if (tab === "A") {
      let updated;
      if (editingItem.isNew) {
        updated = [...prompts, { id: Date.now(), ...formData }];
      } else {
        updated = prompts.map(p => p.id === editingItem.id ? { ...p, ...formData } : p);
      }
      setPrompts(updated);
      syncStorage("smart_eng_prompts", updated);
    } 
    else if (tab === "B") {
      let updated;
      if (editingItem.isNew) updated = [...liveApps, { id: Date.now(), ...formData }];
      else updated = liveApps.map(a => a.id === editingItem.id ? { ...a, ...formData } : a);
      setLiveApps(updated);
      syncStorage("smart_eng_apps", updated);
    }
    else if (tab === "C") {
      let updated;
      if (editingItem.isNew) updated = [...automationTools, { id: Date.now(), ...formData }];
      else updated = automationTools.map(t => t.id === editingItem.id ? { ...t, ...formData } : t);
      setAutomationTools(updated);
      syncStorage("smart_eng_automation", updated);
    }
    else if (tab === "D") {
      let updated;
      if (editingItem.isNew) updated = [...aiSolutions, { id: Date.now(), ...formData }];
      else updated = aiSolutions.map(s => s.id === editingItem.id ? { ...s, ...formData } : s);
      setAiSolutions(updated);
      syncStorage("smart_eng_ai", updated);
    }
    else if (tab === "E") {
      let updated;
      if (editingItem.isNew) updated = [...managementTools, { id: Date.now(), ...formData }];
      else updated = managementTools.map(m => m.id === editingItem.id ? { ...m, ...formData } : m);
      setManagementTools(updated);
      syncStorage("smart_eng_management", updated);
    }

    setEditingItem(null);
  };

  // عمليات الحذف الفورية لجميع المدخلات بقوائمها
  const handleDeleteItem = (id, tab) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا العنصر نهائياً من العرض العام للجمهور؟")) return;

    if (tab === "A") {
      const updated = prompts.filter(p => p.id !== id);
      setPrompts(updated); syncStorage("smart_eng_prompts", updated);
    } else if (tab === "B") {
      const updated = liveApps.filter(a => a.id !== id);
      setLiveApps(updated); syncStorage("smart_eng_apps", updated);
    } else if (tab === "C") {
      const updated = automationTools.filter(t => t.id !== id);
      setAutomationTools(updated); syncStorage("smart_eng_automation", updated);
    } else if (tab === "D") {
      const updated = aiSolutions.filter(s => s.id !== id);
      setAiSolutions(updated); syncStorage("smart_eng_ai", updated);
    } else if (tab === "E") {
      const updated = managementTools.filter(m => m.id !== id);
      setManagementTools(updated); syncStorage("smart_eng_management", updated);
    }
  };

  // التحكم بطلبات الأدوات الخاصة الصادرة من الجمهور
  const handleUpdateRequestStatus = (id, newStatus) => {
    const updated = incomingRequests.map(req => req.id === id ? { ...req, status: newStatus } : req);
    setIncomingRequests(updated);
    syncStorage("smart_eng_requests", updated);
  };

  // التحكم في حالة حسابات الجمهور وحظرهم أو تفعيلهم
  const handleToggleUserStatus = (id) => {
    const updated = usersLog.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === "نشط" ? "محظور ومقيد" : "نشط";
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsersLog(updated);
    syncStorage("smart_eng_users", updated);
  };

  const handleRemoveUser = (id) => {
    if (!window.confirm("حذف حساب المستخدم نهائياً من سجلات المنصة الرقمية؟")) return;
    const updated = usersLog.filter(u => u.id !== id);
    setUsersLog(updated);
    syncStorage("smart_eng_users", updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans" dir="rtl">
      
      {/* الترويسة العليا للوحة الإدارة الفنية */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-5 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                لوحة تحكم المسؤول <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-mono">ADMIN v2.6</span>
              </h2>
              <p className="text-xs text-slate-400">التحكم المطلق بـ: قائمة البرمجيات والأدوات، طلبات الجمهور، وإدارة أمان الحسابات</p>
            </div>
          </div>
          <div className="text-left text-xs text-slate-500">
            رابط العرض العام الحقيقي المتصل بالجمهور: <br />
            <span className="text-cyan-400 font-mono select-all">http://localhost:3000/software-tools</span>
          </div>
        </div>
      </header>

      {/* المحتوى المركزي للوحة الإدارة */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* التبويبات الفنية للأدمن والتحكم بالبيانات وحسابات المستخدمين */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 mb-8">
          {[
            { id: "A", name: "إدارة هندسة الأوامر", count: prompts.length },
            { id: "B", name: "إدارة التطبيقات الحية", count: liveApps.length },
            { id: "C", name: "إدارة برمجيات الأتمتة", count: automationTools.length },
            { id: "D", name: "إدارة حلول الذكاء الاصطناعي", count: aiSolutions.length },
            { id: "E", name: "إدارة لوحات الإدارة والسياق", count: managementTools.length },
            { id: "REQ", name: "طلبات أدوات الجمهور واردة", count: incomingRequests.length, highlight: true },
            { id: "USERS", name: "التحكم وصلاحيات المستخدمين", count: usersLog.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                adminTab === tab.id
                  ? tab.highlight ? "bg-amber-600 text-white shadow-md" : "bg-slate-100 text-slate-900 shadow-md"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850"
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>

        {/* عرض الجداول والتحكم بناءً على التبويب المحدد */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          
          {/* الأزرار العلوية للإضافة الفورية للمصفوفات الخمس */}
          {["A", "B", "C", "D", "E"].includes(adminTab) && (
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold text-slate-200">العناصر المنشورة والمعلنة حالياً للجمهور</h3>
              <button
                onClick={() => handleOpenAdd(adminTab)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
              >
                + إضافة عنصر ومادة جديدة
              </button>
            </div>
          )}

          {/* جدولة تبويب A: هندسة الأوامر */}
          {adminTab === "A" && (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
                    <th className="p-4">اسم الأداة / العنوان</th>
                    <th className="p-4">التخصص الفرعي</th>
                    <th className="p-4">قالب الموجه الهندسي النصي (البرومبت)</th>
                    <th className="p-4 font-mono">input_area</th>
                    <th className="p-4 font-mono">input_price</th>
                    <th className="p-4 text-center">إجراءات العمل الفنية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {prompts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-bold text-slate-200">{p.title}</td>
                      <td className="p-4 text-cyan-400">{p.category}</td>
                      <td className="p-4 text-slate-400 max-w-xs truncate">{p.text}</td>
                      <td className="p-4 font-mono text-slate-300">{p.input_area}</td>
                      <td className="p-4 font-mono text-slate-300">{p.input_price}</td>
                      <td className="p-4 text-center space-x-2 space-x-reverse">
                        <button onClick={() => handleOpenEdit(p, "A")} className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded hover:bg-cyan-600 hover:text-white transition-all">تعديل</button>
                        <button onClick={() => handleDeleteItem(p.id, "A")} className="px-2.5 py-1 bg-slate-800 text-rose-400 rounded hover:bg-rose-600 hover:text-white transition-all">حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* جدولة تبويب B: تطبيقات الويب الحية */}
          {adminTab === "B" && (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
                    <th className="p-4">العنوان الإنشائي للبرنامج المباشر</th>
                    <th className="p-4">نوع ونطاق الحساب</th>
                    <th className="p-4">شرح الميزات والمتطلبات الفنية الميدانية</th>
                    <th className="p-4 text-center">إجراءات التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {liveApps.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-bold text-slate-200">{a.title}</td>
                      <td className="p-4 text-purple-400">{a.type}</td>
                      <td className="p-4 text-slate-400 max-w-sm leading-relaxed">{a.desc}</td>
                      <td className="p-4 text-center space-x-2 space-x-reverse">
                        <button onClick={() => handleOpenEdit(a, "B")} className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded hover:bg-cyan-600 transition-all">تعديل</button>
                        <button onClick={() => handleDeleteItem(a.id, "B")} className="px-2.5 py-1 bg-slate-800 text-rose-400 rounded hover:bg-rose-600 hover:text-white transition-all">حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* جدولة تبويب C: برمجيات الأتمتة */}
          {adminTab === "C" && (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
                    <th className="p-4">اسم الإضافة أو السكربت</th>
                    <th className="p-4">البيئة المستهدفة (Platform)</th>
                    <th className="p-4 font-mono">الحجم</th>
                    <th className="p-4">عداد التنزيل والتحميل العام</th>
                    <th className="p-4">التفاصيل الفنية والبيع العاطفي لتوفير الوقت</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {automationTools.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-bold text-slate-200">{t.title}</td>
                      <td className="p-4 text-emerald-400">{t.platform}</td>
                      <td className="p-4 font-mono text-slate-400">{t.size}</td>
                      <td className="p-4 font-mono text-slate-300">{t.downloads}</td>
                      <td className="p-4 text-slate-400 max-w-xs truncate">{t.desc}</td>
                      <td className="p-4 text-center space-x-2 space-x-reverse">
                        <button onClick={() => handleOpenEdit(t, "C")} className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded hover:bg-cyan-600 transition-all">تعديل</button>
                        <button onClick={() => handleDeleteItem(t.id, "C")} className="px-2.5 py-1 bg-slate-800 text-rose-400 rounded hover:bg-rose-600 hover:text-white transition-all">حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* جدولة تبويب D: حلول الذكاء الاصطناعي */}
          {adminTab === "D" && (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
                    <th className="p-4">الأداة الذكية الفرعية</th>
                    <th className="p-4">القدرة والوظيفة البرمجية للنموذج AI</th>
                    <th className="p-4">آلية معالجة ملفات الأكواد الهندسية</th>
                    <th className="p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {aiSolutions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-bold text-slate-200">{s.title}</td>
                      <td className="p-4 text-amber-400">{s.capability}</td>
                      <td className="p-4 text-slate-400 max-w-sm leading-relaxed">{s.desc}</td>
                      <td className="p-4 text-center space-x-2 space-x-reverse">
                        <button onClick={() => handleOpenEdit(s, "D")} className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded hover:bg-cyan-600 transition-all">تعديل</button>
                        <button onClick={() => handleDeleteItem(s.id, "D")} className="px-2.5 py-1 bg-slate-800 text-rose-400 rounded hover:bg-rose-600 hover:text-white transition-all">حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* جدولة تبويب E: الإدارة والتحكم */}
          {adminTab === "E" && (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
                    <th className="p-4">اسم تطبيق الـ SaaS المطروح</th>
                    <th className="p-4">طبيعة ونطاق عمل المكتب الفني والميداني</th>
                    <th className="p-4">شرح الميزات المركزية وإدارة الملفات السحابية</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {managementTools.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-bold text-slate-200">{m.title}</td>
                      <td className="p-4 text-indigo-400">{m.scope}</td>
                      <td className="p-4 text-slate-400 max-w-sm leading-relaxed">{m.desc}</td>
                      <td className="p-4 text-center space-x-2 space-x-reverse">
                        <button onClick={() => handleOpenEdit(m, "E")} className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded hover:bg-cyan-600 transition-all">تعديل</button>
                        <button onClick={() => handleDeleteItem(m.id, "E")} className="px-2.5 py-1 bg-slate-800 text-rose-400 rounded hover:bg-rose-600 hover:text-white transition-all">حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* جدولة التبويب المخصص والأهم: طلبات أدوات الجمهور المربوط بالبريد الإلكتروني الحقيقي للموقع */}
          {adminTab === "REQ" && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs leading-relaxed text-amber-300">
                <strong>إشعار وتنبيه الخادم السحابي للأدمن:</strong> يتم بث وتصدير أي بيانات طلب ترد هنا بشكل آلي للبريد الإلكتروني المخصص والمقترن بالمؤسسة على السيرفرات الآمنة والخاصة بك: 
                <br />
                <span className="font-mono text-cyan-400 underline decoration-cyan-500/30">Smart.Engineering.Global@proton.me</span> أو <span className="font-mono text-cyan-400 underline decoration-cyan-500/30">smart.engineering.global@tuta.io</span> أو <span className="font-mono text-cyan-400 underline decoration-cyan-500/30">smartengineering.hr.global@gmail.com</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
                      <th className="p-4">اسم الطالب</th>
                      <th className="p-4">البريد الإلكتروني للمرسل</th>
                      <th className="p-4 font-mono">رقم التلفون</th>
                      <th className="p-4">شرح وتفاصيل الأداة الهندسية المخصصة المطلوبة</th>
                      <th className="p-4">تاريخ الاستقبال والتدقيق</th>
                      <th className="p-4">حالة الطلب الإدارية الحالية</th>
                      <th className="p-4 text-center">إجراءات وسيادة التحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {incomingRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-4 font-bold text-slate-200">{req.name}</td>
                        <td className="p-4 font-mono text-slate-300">{req.email}</td>
                        <td className="p-4 font-mono text-slate-300">{req.phone}</td>
                        <td className="p-4 text-slate-300 max-w-xs whitespace-pre-line leading-relaxed bg-slate-950/30 p-2 rounded">{req.details}</td>
                        <td className="p-4 text-slate-500">{req.date}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                            req.status.includes("الانتظار") ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-4 text-center space-y-1">
                          <button onClick={() => handleUpdateRequestStatus(req.id, "تم قبول الفكرة وجاري تنفيذ وهندسة البرمجية")} className="block w-full px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded transition-colors">موافقة وتطوير</button>
                          <button onClick={() => handleUpdateRequestStatus(req.id, "مرفوض - لعدم توافق الجدوى أو البيانات الفنية")} className="block w-full px-2 py-1 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded transition-colors">رفض الطلب</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* جدولة التحكم بعمليات تسجيل الدخول للجمهور وحظر وحذف المستخدمين */}
          {adminTab === "USERS" && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 mb-2">
                نظام الأمان والتحكم البرمي لحظر وحذف الحسابات الرقمية التي تسيء استخدام أدوات وحاسبات الذكاء الاصطناعي العامة في المنصة.
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
                      <th className="p-4">اسم الحساب الهيكلي</th>
                      <th className="p-4">البريد الإلكتروني للتوثيق</th>
                      <th className="p-4">رتبة المستخدم</th>
                      <th className="p-4">الحالة الأمنية</th>
                      <th className="p-4 text-center">التحكم السيادي للحساب</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {usersLog.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-4 font-bold text-slate-200">{user.name}</td>
                        <td className="p-4 font-mono text-slate-300">{user.email}</td>
                        <td className="p-4 text-slate-400">{user.role}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.status === "نشط" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400 animate-pulse"
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-center space-x-2 space-x-reverse">
                          <button 
                            onClick={() => handleToggleUserStatus(user.id)} 
                            className={`px-2.5 py-1 rounded text-white font-bold ${user.status === "نشط" ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"}`}
                          >
                            {user.status === "نشط" ? "قفل وحظر" : "إلغاء الحظر والنشاط"}
                          </button>
                          <button 
                            onClick={() => handleRemoveUser(user.id)} 
                            className="px-2.5 py-1 bg-slate-800 text-rose-400 rounded hover:bg-rose-600 hover:text-white transition-all"
                          >
                            حذف نهائي
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* النافذة المنبثقة الشاملة والديناميكية لعمليات الإضافة والتعديل التابعة لمدير المنصة */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 text-right shadow-2xl" dir="rtl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <h4 className="text-base font-extrabold text-cyan-400">
                  {editingItem.isNew ? "إنشاء ونشر عنصر جديد في المنصة" : `تعديل وإعادة ضبط بيانات عنصر مادة معرف: [${editingItem.id}]`}
                </h4>
                <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white text-xl font-bold">&times;</button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">العنوان أو اسم الأداة والبرمجية بالكامل *</label>
                  <input 
                    type="text" required
                    value={formData.title || ""}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500 font-bold"
                  />
                </div>

                {/* حقول متغيرة مخصصة حسب التبويب المفتوح لضمان دقة مدخلات قاعدة البيانات بنسبة 10000% */}
                {editingItem.tab === "A" && (
                  <>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">التخصص والقسم الفرعي *</label>
                      <select 
                        value={formData.category || "الهندسة الإنشائية"}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                      >
                        <option>الهندسة الإنشائية</option>
                        <option>تقرير التربة والأساسات</option>
                        <option>التصميم المعماري</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">قالب الموجه النصي (Prompt Template) المفصل للذكاء الاصطناعي *</label>
                      <textarea 
                        rows="3" required
                        value={formData.text || ""}
                        onChange={(e) => setFormData({...formData, text: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500 leading-relaxed font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1 font-mono">input_area (عدد)</label>
                        <input type="number" required value={formData.input_area || ""} onChange={(e) => setFormData({...formData, input_area: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1 font-mono">input_price (عدد)</label>
                        <input type="number" required value={formData.input_price || ""} onChange={(e) => setFormData({...formData, input_price: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 focus:outline-none" />
                      </div>
                    </div>
                  </>
                )}

                {editingItem.tab === "B" && (
                  <>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">نوع ونطاق المعادلة الحسابية الحية *</label>
                      <input type="text" required placeholder="مثال: تقوية الأعمدة الخرسانية" value={formData.type || ""} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5" />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">الوصف الهندسي الدقيق للعمل الميداني والرسومات التفاعلية *</label>
                      <textarea rows="3" required value={formData.desc || ""} onChange={(e) => setFormData({...formData, desc: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5" />
                    </div>
                  </>
                )}

                {editingItem.tab === "C" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">البيئة والبرنامج المقترن (Platform) *</label>
                        <input type="text" required placeholder="Revit / AutoCAD / Python" value={formData.platform || ""} onChange={(e) => setFormData({...formData, platform: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">حجم حزمة الملف البرمي المتوفر للتحميل *</label>
                        <input type="text" required placeholder="12.5 MB" value={formData.size || ""} onChange={(e) => setFormData({...formData, size: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">شرح القيمة المضافة لسكربت الأتمتة الإنشائية لتوفير الوقت البشري *</label>
                      <textarea rows="3" required value={formData.desc || ""} onChange={(e) => setFormData({...formData, desc: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5" />
                    </div>
                  </>
                )}

                {editingItem.tab === "D" && (
                  <>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">القدرة البرمجية والتحليلية المخصصة لنموذج الذكاء الاصطناعي المدرب *</label>
                      <input type="text" required placeholder="مثال: فحص المخططات الإنشائية ومعالجة لوحات الـ CAD" value={formData.capability || ""} onChange={(e) => setFormData({...formData, capability: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5" />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">آلية وشرح رفع ومعالجة ملفات الأكواد الهندسية لتقليل نسب الأخطاء *</label>
                      <textarea rows="3" required value={formData.desc || ""} onChange={(e) => setFormData({...formData, desc: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5" />
                    </div>
                  </>
                )}

                {editingItem.tab === "E" && (
                  <>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">نطاق تطبيق الـ SaaS الفني لوحدات التحكم والموارد *</label>
                      <input type="text" required placeholder="مثال: لوحة تحكم إدارة المكتب الفني والمناقصات" value={formData.scope || ""} onChange={(e) => setFormData({...formData, scope: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5" />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">شرح دمج وإدارة المشاريع بالكامل والمركزية المستندية للمكتب في جيبه *</label>
                      <textarea rows="3" required value={formData.desc || ""} onChange={(e) => setFormData({...formData, desc: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5" />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 bg-slate-800 text-slate-400 font-bold rounded-xl hover:bg-slate-750">إلغاء والأغلاق</button>
                  <button type="submit" className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg">حفظ ونشر التعديلات فوراً</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}