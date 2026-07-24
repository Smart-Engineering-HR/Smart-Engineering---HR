"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, FileStack, MessageSquare, 
  TrendingUp, Bell, ArrowUpRight, ShieldCheck,
  LayoutDashboard, FileText, Megaphone, Trash2, Edit3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  // حالة التحكم بالقسم النشط في اللوحة الجانبية
  // الأقسام المتاحة: overview (نظرة عامة)، manage_jobs (وظائف)، manage_tenders (مناقصات)، users (المستخدمين)، ad_requests (الإعلانات)
  const [adminSection, setAdminSection] = useState("overview");

  // الإحصائيات السريعة من الكود الأول
  const [stats, setStats] = useState({
    jobsCount: 0,
    submissionsCount: 0,
    messagesCount: 0,
    activeUsers: 0
  });

  // الحالات المخصصة لإضافة أو تعديل الوظائف والمناقصات من الكود الثاني
  const [editingJob, setEditingJob] = useState(null);
  const [editingTender, setEditingTender] = useState(null);

  // مستودع البيانات المركزي للتحكم الكامل الفوري بالأدمن (الكود الثاني)
  const [allUsers, setAllUsers] = useState([
    { id: 1, name: "م. هاشم سلطان سيف", email: "hashem@example.com", role: "مقاول / مورد هندسي", status: "نشط", docs: "سجل تجاري + شهادة تصنيف نقابة المهندسين اليمنيين.pdf" },
    { id: 2, name: "أحمد علي المقرمي", email: "ahmed@example.com", role: "باحث عن عمل", status: "قيد المراجعة الفنية", docs: "شهادة بكالوريوس هندسة مدنية + سيرة ذاتية.pdf" }
  ]);

  const [adRequests, setAdRequests] = useState([
    { id: 1, company: "مجموعة العايد المقاولاتية", contact: "م. محمد العايد", phone: "777123456", email: "mohammed@ayaid.com", type: "وظيفة ومناقصة معاً", status: "معلق بالأدمن" }
  ]);

  const [adminJobs, setAdminJobs] = useState([
    { id: 1, title: "مهندس إنشائي أقدم", company: "الدار للاستشارات الهندسية", location: "صنعاء، اليمن", category: "الهندسة المدنية والاستشارات", postedDate: "2026-05-20", endDate: "2026-06-20", reportsTo: "المدير التنفيذي للشركة", aboutCompany: "مؤسسة رائدة في تقديم الحلول التصميمية.", aboutJob: "تدقيق المخططات الإنشائية", responsibilities: "إعداد النماذج التحليلية ومراقبة ضبط الجودة للمواد.", requirements: "بكالوريوس هندسة مدنية، إتقان برامج التحليل.", skills: "القيادة واتخاذ القرار.", notes: "يفضل من لديه إلمام بلغة بايثون لتصميم واجهات Flutter الهندسية.", applyMethod: "email", applyEmail: "Smart.Engineering.Global@proton.me", applyLink: "" }
  ]);

  const [adminTenders, setAdminTenders] = useState([
    { id: 1, title: "مناقصة توريد وفحص حديد التسليح لمشروع الأبراج السكنية", company: "مؤسسة الهندسة الذكية للمقاولات", location: "عدن، اليمن", postedDate: "2026-05-22", endDate: "2026-06-30", tenderNumber: "SE-TEND-2026-004", projectName: "مشروع الأبراج السكنية المستدامة", components: "توريد 1500 طن حديد تسليح عالي المقاومة", fundingBody: "تمويل ذاتي", currency: "دولار أمريكي", validity: "90 يوماً", guaranteeValidity: "120 يوماً", executionPeriod: "6 أشهر", guaranteeValue: "2.5%", openingSession: "2026-07-01 / الساعة 10:00 صباحاً", conditions: "أن يكون المقاول مسجلاً ومصنفاً الفئة الأولى.", docsLink: "https://smart-engineering.platform/docs/tender-004", applyMethod: "تحميل العطاء عبر الرابط المخصص للشركة إلكترونياً.", attachments: "جداول الكميات المسعرة، المواصفات الفنية المعتمدة.", getTenderLink: "https://smart-engineering.platform/tenders/buy-004", contactInfo: "smart.engineering.global@tuta.io", notes: "خطاب الضمان البنكي الأصلي إلزامي." }
  ]);

  // نماذج الإدخال لإنشاء وظيفة أو مناقصة جديدة كلياً عبر الأدمن
  const [newJob, setNewJob] = useState({ title: "", company: "", location: "", category: "", postedDate: "", endDate: "", reportsTo: "", aboutCompany: "", aboutJob: "", responsibilities: "", requirements: "", skills: "", notes: "", applyMethod: "email", applyEmail: "Smart.Engineering.Global@proton.me", applyLink: "" });
  const [newTender, setNewTender] = useState({ title: "", company: "", location: "", postedDate: "", endDate: "", tenderNumber: "", projectName: "", components: "", fundingBody: "", currency: "دولار أمريكي", validity: "", guaranteeValidity: "", executionPeriod: "", guaranteeValue: "", openingSession: "", conditions: "", docsLink: "", applyMethod: "", attachments: "", getTenderLink: "", contactInfo: "", notes: "" });

  // بيانات الرسم البياني لإحصائيات المنصة (مدمجة للعرض الفني)
  const chartData = [
    { name: 'السبت', الوظائف: 4, المناقصات: 2, المستخدمين: 40 },
    { name: 'الأحد', الوظائف: 6, المناقصات: 3, المستخدمين: 55 },
    { name: 'الإثنين', الوظائف: 8, المناقصات: 5, المستخدمين: 70 },
    { name: 'الثلاثاء', الوظائف: 9, المناقصات: 4, المستخدمين: 85 },
    { name: 'الأربعاء', الوظائف: 11, المناقصات: 6, المستخدمين: 100 },
    { name: 'الخميس', الوظائف: adminJobs.length, المناقصات: adminTenders.length, المستخدمين: 120 },
  ];

  useEffect(() => {
    // محاكاة جلب البيانات الموحدة ودمج الأرقام مع أطوال المصفوفات الديناميكية
    setStats({
      jobsCount: adminJobs.length,
      submissionsCount: 45,
      messagesCount: 8,
      activeUsers: 120 + allUsers.length
    });
  }, [adminJobs, adminTenders, allUsers]);

  // دوال المعالجة والتحكم بالأدمن
  const handleCreateJob = (e) => {
    e.preventDefault();
    setAdminJobs([...adminJobs, { ...newJob, id: adminJobs.length + 1 }]);
    alert("✅ تم تجهيز ونشر الوظيفة الجديدة للجمهور بنجاح وتحديث قاعدة البيانات الموحدة للمنصة.");
    setNewJob({ title: "", company: "", location: "", category: "", postedDate: "", endDate: "", reportsTo: "", aboutCompany: "", aboutJob: "", responsibilities: "", requirements: "", skills: "", notes: "", applyMethod: "email", applyEmail: "Smart.Engineering.Global@proton.me", applyLink: "" });
  };

  const handleCreateTender = (e) => {
    e.preventDefault();
    setAdminTenders([...adminTenders, { ...newTender, id: adminTenders.length + 1 }]);
    alert("✅ تم حفظ وتجهيز إعلان المناقصة الجديد وعرضه للجمهور عبر لوحة التحكم بنجاح.");
    setNewTender({ title: "", company: "", location: "", postedDate: "", endDate: "", tenderNumber: "", projectName: "", components: "", fundingBody: "", currency: "دولار أمريكي", validity: "", guaranteeValidity: "", executionPeriod: "", guaranteeValue: "", openingSession: "", conditions: "", docsLink: "", applyMethod: "", attachments: "", getTenderLink: "", contactInfo: "", notes: "" });
  };

  const toggleUserStatus = (id) => {
    setAllUsers(allUsers.map(u => u.id === id ? { ...u, status: u.status === "نشط" ? "محظور مؤقتاً" : "نشط" } : u));
  };

  const cards = [
    { title: 'إجمالي الوظائف النشطة', value: adminJobs.length, icon: Briefcase, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { title: 'الطلبات المستلمة', value: stats.submissionsCount, icon: FileStack, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'المناقصات الحالية', value: adminTenders.length, icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'المستخدمين النشطين', value: stats.activeUsers, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#020813] text-white flex flex-col md:flex-row" dir="rtl">
      
      {/* اللوحة الجانبية المركبة والذكية الشاملة */}
      <aside className="w-full md:w-72 bg-[#030d1a] border-l border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div className="border-b border-slate-800 pb-5">
            <h2 className="text-xl font-black text-cyan-400 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-cyan-500" />
              Smart Engineering
            </h2>
            <p className="text-xs text-slate-400 mt-1">لوحة الإدارة الشاملة والمركزية</p>
          </div>
          
          <nav className="space-y-1.5">
            <button 
              onClick={() => setAdminSection("overview")} 
              className={`w-full flex items-center gap-3 text-right px-4 py-3 rounded-2xl font-bold transition-all text-sm ${adminSection === "overview" ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-slate-300 hover:bg-slate-900/80 border border-transparent hover:border-slate-800"}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>📊 نظرة عامة على النظام</span>
            </button>

            <button 
              onClick={() => setAdminSection("manage_jobs")} 
              className={`w-full flex items-center gap-3 text-right px-4 py-3 rounded-2xl font-bold transition-all text-sm ${adminSection === "manage_jobs" ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-slate-300 hover:bg-slate-900/80 border border-transparent hover:border-slate-800"}`}
            >
              <Briefcase className="h-4 w-4" />
              <span>💼 إدارة وتعديل الوظائف</span>
            </button>

            <button 
              onClick={() => setAdminSection("manage_tenders")} 
              className={`w-full flex items-center gap-3 text-right px-4 py-3 rounded-2xl font-bold transition-all text-sm ${adminSection === "manage_tenders" ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-slate-300 hover:bg-slate-900/80 border border-transparent hover:border-slate-800"}`}
            >
              <FileText className="h-4 w-4" />
              <span>🏗️ إدارة وتعديل المناقصات</span>
            </button>

            <button 
              onClick={() => setAdminSection("users")} 
              className={`w-full flex items-center gap-3 text-right px-4 py-3 rounded-2xl font-bold transition-all text-sm ${adminSection === "users" ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-slate-300 hover:bg-slate-900/80 border border-transparent hover:border-slate-800"}`}
            >
              <Users className="h-4 w-4" />
              <span>👥 الباحثين والمقاولين</span>
            </button>

            <button 
              onClick={() => setAdminSection("ad_requests")} 
              className={`w-full flex items-center gap-3 text-right px-4 py-3 rounded-2xl font-bold transition-all text-sm ${adminSection === "ad_requests" ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-slate-300 hover:bg-slate-900/80 border border-transparent hover:border-slate-800"}`}
            >
              <Megaphone className="h-4 w-4" />
              <span>📨 طلبات الإعلانات المباشرة</span>
            </button>
          </nav>
        </div>

        <div className="text-[11px] text-center text-slate-600 border-t border-slate-800 pt-4 mt-8">
          Smart Engineering 2026 ©
        </div>
      </aside>

      {/* مساحة عرض المحتوى الرئيسي المتفاعل */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full space-y-10">
        
        {/* الترويسة الموحدة */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-900 pb-6">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              مرحباً، م. هاشم
            </h1>
            <p className="text-slate-400 mt-2 flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-cyan-500" /> بوابة الإدارة المركزية - التحكم الفوري والبيانات الموحدة
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl relative cursor-pointer">
              <Bell className="h-5 w-5 text-slate-400" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-600 rounded-full border-2 border-[#020813]"></span>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs text-slate-500">مستوى الصلاحية</p>
              <p className="text-sm font-bold text-cyan-400">مدير النظام المطور</p>
            </div>
          </div>
        </div>

        {/* كروت الإحصائيات السريعة المحدثة ديناميكياً */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div key={index} className="bg-[#030d1a] border border-slate-800/80 p-6 rounded-[2rem] hover:border-cyan-500/20 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className={`${card.bg} p-3.5 rounded-xl`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-white transition" />
              </div>
              <div className="mt-5">
                <p className="text-slate-400 text-xs font-medium">{card.title}</p>
                <h3 className="text-3xl font-black mt-1 text-slate-100">{card.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* التبديل الشرطي الذكي بين الأقسام */}
        
        {/* 1. قسم النظرة العامة والرسوم البيانية */}
        {adminSection === "overview" && (
          <div className="space-y-10">
            {/* الشق المالي والإحصائي التفاعلي */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* الرسم البياني للأداء */}
              <div className="lg:col-span-2 bg-[#030d1a] border border-slate-800 p-6 rounded-[2.5rem]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold px-2">مخطط نمو البيانات الأسبوعي</h3>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20">تحديث تلقائي</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#030d1a', borderColor: '#1e293b', color: '#fff' }} />
                      <Line type="monotone" dataKey="الوظائف" stroke="#06b6d4" strokeWidth={3} />
                      <Line type="monotone" dataKey="المناقصات" stroke="#10b981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* حالة الربط الفوري بالخادم */}
              <div className="lg:col-span-1 bg-[#030d1a] border border-slate-800 p-6 rounded-[2.5rem] flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-4">اتصال الخادم والبريد</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    تتصل لوحة التحكم المركزية بالنظام البريدي السحابي المشفر لإرسال التقارير، تحديثات طلبات التسجيل، والمناقصات تلقائياً إلى الإيميل المعتمد:
                  </p>
                  <div className="mt-4 p-3 bg-slate-900/80 border border-slate-800 rounded-xl font-mono text-xs text-cyan-400 select-all text-center">
                    Smart.Engineering.Global@proton.me
                  </div>
                </div>
                <div className="mt-6 border-t border-slate-800/60 pt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>حالة السيرفر الفوري:</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> متصل نشط
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* الأقسام والاختصارات مع أحدث النشاطات */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-xl font-bold px-2">الوصول السريع للأقسام</h2>
                <div className="space-y-3">
                  {[
                    { name: 'إدارة الوظائف والمناقصات', section: 'manage_jobs', icon: Briefcase },
                    { name: 'التحكم بالمناقصات الإنشائية', section: 'manage_tenders', icon: FileText },
                    { name: 'مراجعة الموردين والمقاولين', section: 'users', icon: Users },
                    { name: 'طلبات الإعلانات المعلقة', section: 'ad_requests', icon: Megaphone },
                  ].map((link, i) => (
                    <button 
                      key={i} 
                      onClick={() => setAdminSection(link.section)} 
                      className="w-full flex items-center gap-4 p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:bg-cyan-500 hover:text-black transition-all group text-right"
                    >
                      <link.icon className="h-5 w-5 opacity-70 group-hover:opacity-100 shrink-0" />
                      <span className="font-semibold text-sm">{link.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* أحدث النشاطات من الكود الأول */}
              <div className="lg:col-span-2 bg-[#030d1a] border border-slate-800 rounded-[2.5rem] p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                   أحدث النشاطات الفورية للمنصة
                   <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-cyan-500/30">Live</span>
                </h2>
                <div className="space-y-4">
                  {[
                    { user: 'أحمد علي', action: 'تقدم لوظيفة مهندس إنشائي أقدم', time: 'منذ دقيقتين' },
                    { user: 'مجموعة العايد', action: 'أضافت طلب إعلان مناقصة جديدة', time: 'منذ ساعة' },
                    { user: 'سارة محمد', action: 'أرسلت رسالة استفسار للدعم الهندي', time: 'منذ 3 ساعات' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-slate-800/60 pb-3.5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-xs font-bold text-cyan-400 border border-slate-700">
                          {activity.user[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-200">{activity.user}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{activity.action}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-600">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. قسم نشر وإدارة الوظائف */}
        {adminSection === "manage_jobs" && (
          <section className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-cyan-400 flex items-center gap-2">💼 نشر، تجهيز، وتعديل الوظائف الهندسية والإدارية</h2>
              <span className="text-xs bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-400">العدد الحالي: {adminJobs.length}</span>
            </div>
            
            {/* نموذج إضافة وظيفة جديدة */}
            <form onSubmit={handleCreateJob} className="bg-[#030d1a] p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-cyan-400 border-b border-slate-800 pb-3">➕ إضافة وتجهيز وظيفة جديدة لعرضها للجمهور</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400 font-semibold px-1">المسمى الوظيفي</label>
                  <input type="text" placeholder="مثال: مهندس إنشائي أقدم" required value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none transition text-white" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400 font-semibold px-1">اسم الجهة المعلنة</label>
                  <input type="text" placeholder="اسم الشركة أو المؤسسة" required value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none transition text-white" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400 font-semibold px-1">الموقع الجغرافي للعمل</label>
                  <input type="text" placeholder="مثال: صنعاء، اليمن" required value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none transition text-white" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400 font-semibold px-1">فئة التخصص الهندسي</label>
                  <input type="text" placeholder="مثال: الهندسة المدنية والاستشارات" required value={newJob.category} onChange={(e) => setNewJob({ ...newJob, category: e.target.value })} className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none transition text-white" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400 font-semibold px-1">تاريخ النشر والتعميم</label>
                  <input type="date" required value={newJob.postedDate} onChange={(e) => setNewJob({ ...newJob, postedDate: e.target.value })} className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none transition text-white text-right" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400 font-semibold px-1">تاريخ انتهاء فترة التقديم</label>
                  <input type="date" required value={newJob.endDate} onChange={(e) => setNewJob({ ...newJob, endDate: e.target.value })} className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none transition text-white text-right" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold px-1">التبعية الإدارية والمشرف المباشر</label>
                  <input type="text" placeholder="الجهة أو الشخص المسؤول المباشر الذي ترفع له التقارير" value={newJob.reportsTo} onChange={(e) => setNewJob({ ...newJob, reportsTo: e.target.value })} className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none transition text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <textarea placeholder="نبذة تعريفية شاملة عن جهة التوظيف والشركة المعلنة..." rows={2} value={newJob.aboutCompany} onChange={(e) => setNewJob({ ...newJob, aboutCompany: e.target.value })} className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-sm focus:border-cyan-500 outline-none transition text-white" />
                <textarea placeholder="نبذة عامة عن الوظيفة المطروحة والهدف الإستراتيجي الفني منها..." rows={2} value={newJob.aboutJob} onChange={(e) => setNewJob({ ...newJob, aboutJob: e.target.value })} className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-sm focus:border-cyan-500 outline-none transition text-white" />
                <textarea placeholder="الواجبات والمسؤوليات التفصيلية الهندسية المتوقعة (حقل منفصل لكل سطر)..." rows={3} value={newJob.responsibilities} onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value })} className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-sm focus:border-cyan-500 outline-none transition text-white" />
                <textarea placeholder="المؤهلات والمتطلبات الوظيفية الأساسية والخبرات الأكاديمية المطلوبة..." rows={3} value={newJob.requirements} onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })} className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-sm focus:border-cyan-500 outline-none transition text-white" />
                <textarea placeholder="المهارات الفنية والكفاءات البرمجية أو التقنية المطلوب إتقانها..." rows={2} value={newJob.skills} onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })} className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-sm focus:border-cyan-500 outline-none transition text-white" />
                <textarea placeholder="ملاحظات فنية أو شروط تفضيلية إضافية للأدمن..." rows={2} value={newJob.notes} onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })} className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-sm focus:border-cyan-500 outline-none transition text-white" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800/80 pt-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-500 px-1">طريقة استقبال طلبات التوظيف</label>
                  <select value={newJob.applyMethod} onChange={(e) => setNewJob({ ...newJob, applyMethod: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none">
                    <option value="email">التقديم بواسطة البريد الإلكتروني</option>
                    <option value="link">التقديم عبر رابط مخصص خارجي</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-500 px-1">البريد الإلكتروني المخصص للتقديم</label>
                  <input type="email" placeholder="Smart.Engineering.Global@proton.me" value={newJob.applyEmail} onChange={(e) => setNewJob({ ...newJob, applyEmail: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-left font-mono text-white outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-500 px-1">رابط نموذج التقديم الإلكتروني</label>
                  <input type="url" placeholder="https://example.com/apply" value={newJob.applyLink} onChange={(e) => setNewJob({ ...newJob, applyLink: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-left font-mono text-white outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full bg-cyan-500 text-black font-black py-4 rounded-2xl hover:bg-cyan-400 transition-all text-sm shadow-lg shadow-cyan-500/10">
                نشر وتعميم الوظيفة الهندسية فوراً للجمهور
              </button>
            </form>

            {/* قائمة التحكم الفوري بالوظائف المنشورة */}
            <div className="bg-[#030d1a] p-6 rounded-[2.5rem] border border-slate-800">
              <h3 className="text-lg font-bold text-slate-100 mb-4">🔧 التحكم والتعديل الفوري على الوظائف المنشورة حالياً</h3>
              <div className="space-y-3">
                {adminJobs.map(job => (
                  <div key={job.id} className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-cyan-500/20 transition">
                    <div>
                      <h4 className="font-bold text-cyan-400 text-base">{job.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{job.company} — 📍 {job.location} — 📅 تاريخ الانتهاء: {job.endDate}</p>
                    </div>
                    <div className="flex gap-2 shrink-0 w-full sm:w-auto justify-end">
                      <button onClick={() => { setEditingJob(job); alert(`تم فتح تعديل وظيفة: ${job.title} عبر محرر الأدمن.`); }} className="bg-amber-600/20 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-amber-600 hover:text-white transition flex items-center gap-1.5">
                        <Edit3 className="h-3.5 w-3.5" /> تعديل الحقول
                      </button>
                      <button onClick={() => setAdminJobs(adminJobs.filter(j => j.id !== job.id))} className="bg-rose-600/20 text-rose-400 border border-rose-500/30 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition flex items-center gap-1.5">
                        <Trash2 className="h-3.5 w-3.5" /> حذف نهائي
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 3. قسم إدارة المناقصات بالتفصيل */}
        {adminSection === "manage_tenders" && (
          <section className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-emerald-400 flex items-center gap-2">🏗️ إدارة وتجهيز المناقصات الإنشائية والتوريدات العامة</h2>
              <span className="text-xs bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-slate-400">المنشور حالياً: {adminTenders.length}</span>
            </div>

            {/* نموذج إضافة مناقصة جديدة */}
            <form onSubmit={handleCreateTender} className="bg-[#030d1a] p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-emerald-400 border-b border-slate-800 pb-3">➕ تجهيز مناقصة رسمية جديدة وعرضها للجمهور عبر السيرفر</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input type="text" placeholder="عنوان المناقصة الرئيسي العريض" required value={newTender.title} onChange={(e) => setNewTender({ ...newTender, title: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500 transition" />
                <input type="text" placeholder="اسم الشركة أو الجهة صاحبة العمل" required value={newTender.company} onChange={(e) => setNewTender({ ...newTender, company: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500 transition" />
                <input type="text" placeholder="النطاق الجغرافي بالتفصيل (مثال: عدن، اليمن)" required value={newTender.location} onChange={(e) => setNewTender({ ...newTender, location: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500 transition" />
                <input type="text" placeholder="رقم السجل المرجعي (مثال: SE-TEND-2026)" required value={newTender.tenderNumber} onChange={(e) => setNewTender({ ...newTender, tenderNumber: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-left font-mono text-white outline-none focus:border-emerald-500 transition" />
                <input type="text" placeholder="اسم المشروع المستهدف الأساسي" required value={newTender.projectName} onChange={(e) => setNewTender({ ...newTender, projectName: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500 transition" />
                <input type="text" placeholder="جهة التمويل الحاكمة للمشروع" value={newTender.fundingBody} onChange={(e) => setNewTender({ ...newTender, fundingBody: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500 transition" />
                <input type="date" placeholder="تاريخ نشر المناقصة" required value={newTender.postedDate} onChange={(e) => setNewTender({ ...newTender, postedDate: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white text-right outline-none" />
                <input type="date" placeholder="تاريخ الإغلاق النهائي" required value={newTender.endDate} onChange={(e) => setNewTender({ ...newTender, endDate: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white text-right outline-none" />
                <input type="text" placeholder="عملة تقديم العطاء والضمان" value={newTender.currency} onChange={(e) => setNewTender({ ...newTender, currency: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none" />
                <input type="text" placeholder="مدة صلاحية العطاء المقدم أياماً" value={newTender.validity} onChange={(e) => setNewTender({ ...newTender, validity: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none" />
                <input type="text" placeholder="فترة صلاحية الضمان البنكي أياماً" value={newTender.guaranteeValidity} onChange={(e) => setNewTender({ ...newTender, guaranteeValidity: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none" />
                <input type="text" placeholder="فترة التنفيذ التعاقدية للمشروع" value={newTender.executionPeriod} onChange={(e) => setNewTender({ ...newTender, executionPeriod: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none" />
                <input type="text" placeholder="قيمة الضمان الابتدائي المطلوبة بالتحديد" value={newTender.guaranteeValue} onChange={(e) => setNewTender({ ...newTender, guaranteeValue: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none md:col-span-2 lg:col-span-1" />
                <input type="text" placeholder="موعد ومكان جلسة فتح المظاريف العلنية" value={newTender.openingSession} onChange={(e) => setNewTender({ ...newTender, openingSession: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none md:col-span-2" />
              </div>

              <div className="space-y-4">
                <textarea placeholder="المكونات الفنية وعناصر التوريد التفصيلية المطلوبة..." rows={2} value={newTender.components} onChange={(e) => setNewTender({ ...newTender, components: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500 transition" />
                <textarea placeholder="شروط التقديم، الأهلية الفنية، التصنيف المالي الفئات المعتمدة للشركات..." rows={3} value={newTender.conditions} onChange={(e) => setNewTender({ ...newTender, conditions: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500 transition" />
                <textarea placeholder="آلية وطريقة تقديم العروض الفنية والمالية بالتفصيل..." rows={2} value={newTender.applyMethod} onChange={(e) => setNewTender({ ...newTender, applyMethod: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500 transition" />
                <textarea placeholder="المستندات، الملفات الإلزامية، جداول الكميات المرفقة بالملف..." rows={2} value={newTender.attachments} onChange={(e) => setNewTender({ ...newTender, attachments: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500 transition" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800/60 pt-4">
                <input type="url" placeholder="رابط شراء كراسة الشروط الرسمية" value={newTender.getTenderLink} onChange={(e) => setNewTender({ ...newTender, getTenderLink: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none" />
                <input type="url" placeholder="رابط تحميل الوثائق المساعدة وجداول الكميات" value={newTender.docsLink} onChange={(e) => setNewTender({ ...newTender, docsLink: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none" />
                <input type="text" placeholder="قنوات الاستفسار والدعم الفني المباشر" value={newTender.contactInfo} onChange={(e) => setNewTender({ ...newTender, contactInfo: e.target.value })} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />
              </div>

              <textarea placeholder="أي ملاحظات فنية استثنائية أو تنبيهات ملزمة حول خطاب الضمان البنكي..." rows={2} value={newTender.notes} onChange={(e) => setNewTender({ ...newTender, notes: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none" />

              <button type="submit" className="w-full bg-emerald-600 text-white font-black py-3.5 rounded-2xl hover:bg-emerald-500 transition-all text-sm shadow-lg shadow-emerald-600/10">
                تجهيز ونشر إعلان المناقصة فوراً للمقاولين والشركات
              </button>
            </form>

            {/* قائمة التحكم والمراجعة للمناقصات الحالية */}
            <div className="bg-[#030d1a] p-6 rounded-[2.5rem] border border-slate-800">
              <h3 className="text-lg font-bold text-slate-100 mb-4">🔧 التحكم الفوري والتعديل في المناقصات المنشورة</h3>
              <div className="space-y-3">
                {adminTenders.map(tender => (
                  <div key={tender.id} className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-500/20 transition">
                    <div>
                      <h4 className="font-bold text-emerald-400 text-base">{tender.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{tender.company} — 🔢 كود المناقصة: <span className="font-mono text-slate-200">{tender.tenderNumber}</span> — 🌍 النطاق: {tender.location}</p>
                    </div>
                    <div className="flex gap-2 shrink-0 w-full sm:w-auto justify-end">
                      <button onClick={() => alert(`تم فتح محرر التعديل الشامل للمناقصة رقم: ${tender.tenderNumber}`)} className="bg-amber-600/20 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-amber-600 hover:text-white transition">
                        تعديل البيانات
                      </button>
                      <button onClick={() => setAdminTenders(adminTenders.filter(t => t.id !== tender.id))} className="bg-rose-600/20 text-rose-400 border border-rose-500/30 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition">
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. التحكم بالمستخدمين والمقاولين والموردين */}
        {adminSection === "users" && (
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-indigo-400 flex items-center gap-2">👥 التحكم المطلق بالمقاولين، الموردين وطالبي التوظيف وحفظ مستنداتهم</h2>
            
            <div className="bg-[#030d1a] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse min-w-[800px]">
                  <thead className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800">
                    <tr>
                      <th className="p-4 font-bold">الاسم الكامل للمستخدم / المقاول</th>
                      <th className="p-4 font-bold">البريد الإلكتروني الموثق</th>
                      <th className="p-4 font-bold">الفئة المسجلة بالمنصة</th>
                      <th className="p-4 font-bold">المستندات والملفات المرفوعة</th>
                      <th className="p-4 font-bold">حالة الحساب والسيرفر</th>
                      <th className="p-4 font-bold text-center">التحكم بالأدمن ككل</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-800/60">
                    {allUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-900/40 transition">
                        <td className="p-4 font-bold text-slate-200">{user.name}</td>
                        <td className="p-4 font-mono text-slate-400 text-left">{user.email}</td>
                        <td className="p-4">
                          <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[11px] font-bold border border-indigo-500/20">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-cyan-400 hover:underline cursor-pointer font-medium max-w-[200px] truncate">
                          📄 {user.docs}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide ${user.status === "نشط" ? "bg-emerald-950 text-emerald-400 border border-emerald-500/20" : "bg-amber-950 text-amber-400 border border-amber-500/20"}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => toggleUserStatus(user.id)} 
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${user.status === "نشط" ? "bg-amber-600/20 text-amber-400 border border-amber-500/20 hover:bg-amber-600 hover:text-white" : "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white"}`}
                          >
                            {user.status === "نشط" ? "تعطيل صلاحية الدخول" : "تنشيط الحساب والمستند"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* 5. مراجعة واعتماد طلبات الإعلانات "أعلن معنا" */}
        {adminSection === "ad_requests" && (
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-amber-400 flex items-center gap-2">📨 طلبات الإعلانات المباشرة من الشركات والمؤسسات المعلنة</h2>
            <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20 text-xs text-amber-400/90 leading-relaxed">
              💡 بمجرد الموافقة على الطلب في هذه القائمة، يقوم النظام البرمجي بنقل الإعلان فوراً وبشكل تلقائي للعرض على البوابة الأمامية المفتوحة للجمهور، مع تصدير إشعار فوري بحالة القبول والمزامنة المالية إلى الإيميل المشترك المعتمد: <span className="font-mono text-white underline select-all">Smart.Engineering.Global@proton.me</span>
            </div>
            
            <div className="space-y-4">
              {adRequests.length === 0 ? (
                <div className="text-center p-12 bg-[#030d1a] border border-slate-800 rounded-[2.5rem] text-slate-500 text-sm">
                  لا توجد طلبات إعلانية معلقة حالياً في السيرفر الرئيسي.
                </div>
              ) : (
                adRequests.map(req => (
                  <div key={req.id} className="p-6 bg-[#030d1a] rounded-[2.5rem] border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:border-amber-500/20 transition">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-slate-100 text-base">{req.company}</h3>
                        <span className="text-[10px] bg-slate-900 text-amber-400 px-2.5 py-0.5 rounded-md border border-amber-500/20 font-bold">{req.type}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        الشخص المسؤول: <span className="text-slate-200 font-medium">{req.contact}</span> | هاتف التواصل المباشر: <span className="font-mono text-cyan-400">{req.phone}</span>
                      </p>
                      <p className="text-xs text-slate-500 font-mono text-right md:text-left">{req.email}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto justify-end shrink-0">
                      <button 
                        onClick={() => { alert("✅ تم اعتماد الطلب البرمجي بنجاح وعرضه فوراً للجمهور في الصفحة الأمامية."); setAdRequests(adRequests.filter(r => r.id !== req.id)); }} 
                        className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-black hover:bg-emerald-500 shadow-lg shadow-emerald-600/10 transition-all"
                      >
                        اعتماد ونشر الإعلان فوراً
                      </button>
                      <button 
                        onClick={() => { alert("❌ تم إلغاء ورفض الطلب وحذفه من قاعدة البيانات المؤقتة."); setAdRequests(adRequests.filter(r => r.id !== req.id)); }} 
                        className="bg-slate-900 text-slate-400 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 hover:text-white transition-all"
                      >
                        رفض الطلب وحذفه
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}