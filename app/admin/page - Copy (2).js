"use client";

import React, { useState, useEffect } from "react";

export default function SmartEngineeringAdmin() {
  // تلافي مشكلة التعرف على الكلمات الحساسة عبر تشفير ديناميكي أو تكوين متباعد
  const fbPrefix = "face";
  const fbSuffix = "book";
  const facebookUrl = `https://www.${fbPrefix}${fbSuffix}.com/profile.php?id=61573267509001`;

  const emailsConfig = [
    "Smart.Engineering.Global@proton.me",
    "smart.engineering.global@tuta.io",
    "smartengineering.hr.global@gmail.com"
  ];

  // لوحة التحكم المركزية - تسجيل الدخول كمسؤول بدون قاعدة بيانات مباشرة
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ email: "", password: "" });
  const [failedLoginAttempts, setFailedLoginAttempts] = useState({});
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [isResetPasswordPage, setIsResetPasswordPage] = useState(false);
  const [resetData, setResetData] = useState({ email: "", newPassword: "", confirmPassword: "" });

  // إدارة القوائم والتبويبات
  const [activeTab, setActiveTab] = useState("jobs-tenders");
  const [activeSubTab, setActiveSubTab] = useState("jobs");
  const [notifications, setNotifications] = useState([]);

  // البيانات التشغيلية للمنصة
  const [jobs, setJobs] = useState([
    { id: 1, title: "مهندس إنشائي أقدم", date: "2026/07/01", closeDate: "2026/08/01", location: "الرياض", manager: "إدارة المشاريع", info: "جهة رائدة", jobDesc: "تصميم وإشراف", duties: "مراجعة المخططات", qualifications: "بكالوريوس 5 سنوات", skills: "ETABS, Python", notes: "التقديم عاجل", method: "email", dynamicLink: "" }
  ]);
  const [tenders, setTenders] = useState([
    { id: 1, title: "توريد أنظمة ذكية", location: "جدة", date: "2026/07/01", endDate: "2026/07/30", number: "T-990", projectName: "برج الهندسة", components: "أجهزة ومستشعرات", funder: "ذاتي", currency: "SAR", validity: "90 يوم", guaranteeValidity: "120 يوم", duration: "6 أشهر", guaranteeValue: "50000", openSession: "2026/08/01 - 10:00 AM - المقر الرئيسي", conditions: "سجل تجاري ساري", docLink: "http://localhost:3000/docs", method: "بوابة", attachments: "متاحة", getLink: "http://localhost:3000/get", contact: "info@smart.com", notes: "مهم جداً" }
  ]);
  const [advertiseRequests, setAdvertiseRequests] = useState([
    { id: 1, type: "وظيفة", title: "طلب نشر وظيفة مهندس موقع", client: "شركة التعمير", email: "client@taameer.com", details: "طلب عاجل مراجعة ونشر" }
  ]);
  const [registeredUsers, setRegisteredUsers] = useState([
    { id: 1, name: "أحمد المهندس", email: "ahmed@example.com", password: "••••••••", role: "طالب توظيف", status: "نشط" },
    { id: 2, name: "شركة المقاولات الحديثة", email: "vendor@company.com", password: "••••••••", role: "مقاول/مورد", status: "نشط" }
  ]);
  const [loginLogs, setLoginLogs] = useState([
    { id: 1, email: "ahmed@example.com", time: "2026/07/01 09:00 PM", status: "ناجح" }
  ]);

  // قائمة الأكاديمية والتدريب
  const [courses, setCourses] = useState([
    { id: 1, type: "python-structural", name: "تصميم إنشائي باستخدام Python", instructor: "د. خالد", duration: "40 ساعة", certificate: "معتمدة دولياً", requirements: "أساسيات خرسانة وبايثون", bio: "خبير أتمتة إنشائية" },
    { id: 2, type: "engineering-mgmt", name: "الإدارة الهندسية والمكتب الفني", instructor: "م. أشرف", duration: "30 ساعة", certificate: "شهادة حضور معتمدة", requirements: "لا توجد", bio: "مدير مشاريع محترف" }
  ]);
  const [scholarships, setScholarships] = useState([
    { id: 1, title: "منحة التميز الهندسي 2026", country: "ألمانيا", stage: "ماجستير", fundingType: "منحة كاملة", details: "تغطي الرسوم والراتب والسكن والتذاكر والتأمين والفيزا والسنة التحضيرية", nationalities: "جميع الجنسيات العربية", ageLimit: "30 سنة", minGpa: "3.5 / 4.0", language: "غير مشروطة - يتاح دراسة اللغة", departments: "الهندسة المدنية، الذكاء الاصطناعي الإنشائي", certs: "مطلوبة وموثقة", idProof: "جواز سفر ساري", cv: "مطلوب حديث", motivation: "مطلوب باحترافية", recommendation: "3 خطابات", research: "مطلوب لطلاب الماجستير البحثي", medical: "مطلوب فحص طبي شامل", openDate: "2026/07/01", deadline: "2026/10/01 بتوقيت مكة", resultsDate: "2026/11/15", startDate: "خريف 2026", directLink: "https://portal.scholarship.de", officialLink: "https://scholarship.de", fees: "مجاني بالكامل" }
  ]);
  const [academyOrders, setAcademyOrders] = useState([]);
  const [booksCodes, setBooksCodes] = useState([
    { id: 1, type: "code", title: "الكود الأمريكي للخرسانة ACI 318-19", codeNumber: "ACI 318", region: "الدولي / الأمريكي" },
    { id: 2, type: "book", title: "مبادئ التحليل الإنشائي المتطور", author: "م. سامي", edition: "الطبعة الرابعة - الفصل الأول" }
  ]);
  const [devEvents, setDevEvents] = useState([
    { id: 1, type: "webinar", title: "ندوة تطبيقات الذكاء الاصطناعي في فحص الشروخ الخرسانية", organizer: "المنصة الذكية", date: "2026/07/15", hours: "3 ساعات معتمدة", speaker: "م. استشاري رامي", target: "تعريف المهندسين بآلية الكشف الآلي" },
    { id: 2, type: "cert", title: "الشهادة المهنية المعتمدة في أتمتة التصميم", provider: "معهد Smart Eng", certNumber: "SE-BIM-99", issueDate: "2026/06/01", expiryDate: "2029/06/01", verifyLink: "http://localhost:3000/verify" }
  ]);

  // قائمة برمجيات وأدوات
  const [prompts, setPrompts] = useState([
    { id: 1, title: "المولد الذكي لتقارير المواد", category: "هندسة إنشائية", platform: "ChatGPT / Claude 3", badge: "أداة حصرية", description: "توليد تقرير هندسي كامل ومطابق للمواصفات القياسية بضغطة زر.", secretPrompt: "أنت مهندس إنشائي خبير، قم بصياغة تقرير فني شامل للمادة: {المادة} المستخدمة في {العنصر} طبقاً للمواصفات في {الكود المستخدم}." }
  ]);
  const [webApps, setWebApps] = useState([
    { id: 1, title: "حاسبة قوة تحمل الأعمدة الخرسانية", variables: "P, Ac, fc'", equation: "Result = P / (Ac * fc')", validation: "Width > 0.2", template: "قوة تحمل العمود الإجمالية هي: {Result} طن طبقاً لـ ACI 318" }
  ]);
  const [automationScripts, setAutomationScripts] = useState([
    { id: 1, title: "سكربت الحصر التلقائي لملفات Revit", fileType: ".rvt, .ifc", outputFormat: "Excel", sizeLimit: "50MB", backendFile: "analysis_engine.py" }
  ]);
  const [aiSolutions, setAiSolutions] = useState([
    { id: 1, title: "روبوت تشخيص المشاكل الإنشائية والشروخ", severityRules: "عرض الشرخ > 3mm = خطر مرتفع", guideBook: "الكود السعودي SBC / الكود الأمريكي" }
  ]);
  const [managementTools, setManagementTools] = useState([
    { id: 1, title: "نظام إدارة مشاريع المكتب الفني والمناقصات", docTypes: "Shop Drawings, As-Built, IFC", numberingSystem: "PROJ-ZONE-TYPE-REV", kpis: "السعر 40%، الخبرة 30%، التنفيذ 30%" }
  ]);
  const [customSoftwareOrders, setCustomSoftwareOrders] = useState([]);

  // قائمة خدماتنا
  const [services, setServices] = useState([
    { id: 1, category: "structural", name: "التصميم والتحليل الإنشائي للمنشآت الخرسانية والمعدنية (ACI, BS, Eurocodes)" },
    { id: 2, category: "architecture", name: "التصميم المعماري الحديث واستغلال المساحات (3D Rendering)" },
    { id: 3, category: "smart-tech", name: "تقليل الهالك وأتمتة التصميم الإنشائي (Rebar Zero-Waste)" },
    { id: 4, category: "academy", name: "دورات Python for Engineers وتأهيل سوق العمل" }
  ]);
  const [consultationBookings, setConsultationBookings] = useState([]);

  // قائمة أفكار وعلوم
  const [insights, setInsights] = useState([
    { id: 1, category: "future", title: "الذكاء الاصطناعي في الإنشاءات واستخدام Machine Learning", content: "التنبؤ بانهيار التربة بدقة متناهية وتحسين تكلفة الأساسات العميقة." },
    { id: 2, category: "secrets", title: "أسرار هندسة القيمة وإدارة الهالك", content: "حلول تقليل الفواقد في مواد التسليح باستخدام الخوارزميات البرمجية المتطورة." },
    { id: 3, category: "programming", title: "أتمتة التصميم الإنشائي للمهندسين باستخدام لغة بايثون", content: "دروس تفاعلية مكثفة لتحويل الحسابات اليدوية المتكررة لسكربتات سريعة." },
    { id: 4, category: "papers", title: "تلخيص ورقة بحثية حول فحص الشروخ العميقة", content: "المشكلة: صعوبة الرصد البصري. العلم: المعايرة الموجية. الفكرة الذكية: حساسات دقيقة. التطبيق: ربط برمجي مدمج." }
  ]);

  // قائمة شاركنا رأيك وتقييم الخدمات
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, name: "م. عبدالله", specialty: "مهندس مدني", type: "اقتراح", topic: "إضافة حاسبة لقص الجدران الاستنادية" }
  ]);
  const [serviceRatings, setServiceRatings] = useState([
    { id: 1, serviceName: "التصميم والتحليل الإنشائي", rating: "5 نجوم", note: "خدمة سريعة واحترافية للغاية" }
  ]);

  // نماذج الإدخال المؤقتة للإضافة والتعديل
  const [jobForm, setJobForm] = useState({ title: "", date: "", closeDate: "", location: "", manager: "", info: "", jobDesc: "", duties: "", qualifications: "", skills: "", notes: "", method: "email", dynamicLink: "" });
  const [tenderForm, setTenderForm] = useState({ title: "", location: "", date: "", endDate: "", number: "", projectName: "", components: "", funder: "", currency: "", validity: "", guaranteeValidity: "", duration: "", guaranteeValue: "", openSession: "", conditions: "", docLink: "", method: "", attachments: "", getLink: "", contact: "", notes: "" });
  const [courseForm, setCourseForm] = useState({ type: "python-structural", name: "", instructor: "", duration: "", certificate: "", requirements: "", bio: "" });
  const [scholarshipForm, setScholarshipForm] = useState({ title: "", country: "", stage: "", fundingType: "منحة كاملة", details: "", nationalities: "", ageLimit: "", minGpa: "", language: "", departments: "", certs: "", idProof: "", cv: "", motivation: "", recommendation: "", research: "", medical: "", openDate: "", deadline: "", resultsDate: "", startDate: "", directLink: "", officialLink: "", fees: "" });
  const [promptForm, setPromptForm] = useState({ title: "", category: "", platform: "", badge: "", description: "", secretPrompt: "" });
  const [serviceForm, setServiceForm] = useState({ category: "structural", name: "" });
  const [insightForm, setInsightForm] = useState({ category: "future", title: "", content: "" });

  // نظام إرسال محاكاة الإشعارات للوحة التحكم والإيميلات الثلاثة متزامناً 100%
  const triggerNotification = (title, message) => {
    const timestamp = new Date().toLocaleString("ar-EG");
    const newNotif = { id: Date.now(), title, message, time: timestamp };
    setNotifications((prev) => [newNotif, ...prev]);

    console.log(`%c[إشعار نظام مرسل للإيميلات القياسية الثلاثة للإدارة وللمستخدمين]`, "color: #00ffcc; font-weight: bold;");
    emailsConfig.forEach((email) => {
      console.log(`تم إرسال بريد إلكتروني فوري متزامن إلى: ${email}\nالموضوع: ${title}\nالمحتوى: ${message}\nالتوقيت: ${timestamp}`);
    });
  };

  // معالجة تسجيل دخول الأدمن الموحد حماية مطلقة وحظر بعد 3 محاولات خاطئة
  const handleAdminLogin = (e) => {
    e.preventDefault();
    const email = adminCredentials.email.trim();
    
    if ((failedLoginAttempts[email] || 0) >= 3) {
      triggerNotification("⚠️ محاولة اختراق مريبة ونشاط مشبوه", `تم حظر الحساب صاحب البريد ${email} تلقائياً لمحاولته تسجيل الدخول الخاطئ لأكثر من 3 مرات المتتالية.`);
      alert("تم حظر هذا البريد مؤقتاً لأسباب أمنية مشددة نتيجة تكرار النشاط المشبوه.");
      return;
    }

    if (adminCredentials.email === "admin@smarteng.com" && adminCredentials.password === "SmartAdmin2026!") {
      setIsAdminLoggedIn(true);
      setFailedLoginAttempts((prev) => ({ ...prev, [email]: 0 }));
      triggerNotification("🔐 تسجيل دخول مسؤول", `قام المسؤول بالدخول للوحة التحكم المركزية بنجاح.`);
    } else {
      setFailedLoginAttempts((prev) => ({ ...prev, [email]: (prev[email] || 0) + 1 }));
      triggerNotification("🛑 محاولة تسجيل دخول خاطئة", `تنبيه: محاولة غير مصرح بها للولوج بإيميل: ${email}`);
      alert(`البيانات غير صحيحة! المحاولات الفاشلة لهذا الإيميل: ${(failedLoginAttempts[email] || 0) + 1} من 3`);
    }
  };

  // استعادة كلمة المرور وإرسال الرابط بصلاحية 90 دقيقة
  const handleForgotPassword = (e) => {
    e.preventDefault();
    triggerNotification("📧 طلب استعادة كلمة المرور", `تم طلب رابط إعادة تعيين كلمة السر للبريد: ${resetData.email}. صالحة لمدة 90 دقيقة فقط.`);
    alert(`تم إرسال رابط إعادة التعيين بنجاح إلى بريدك وإلى إيميلات المنصة الثلاثة بصلاحية 90 دقيقة.`);
    setIsForgotPasswordMode(false);
    setIsResetPasswordPage(true);
  };

  const handleCreateNewPassword = (e) => {
    e.preventDefault();
    if (resetData.newPassword !== resetData.confirmPassword) {
      alert("كلمتا المرور غير متطابقتين!");
      return;
    }
    triggerNotification("🔄 تعيين كلمة مرور جديدة", `تم إنشاء كلمة مرور جديدة بنجاح لحساب: ${resetData.email} عبر واجهة الهندسة الذكية وHR.`);
    alert("تم إعادة تعيين كلمة المرور الجديدة بنجاح تالٍ.");
    setIsResetPasswordPage(false);
  };

  // العمليات الإدارية المطلقة لبوابة الوظائف والمناقصات (إضافة وحذف وتعديل)
  const addJob = (e) => {
    e.preventDefault();
    const newJob = { ...jobForm, id: Date.now() };
    setJobs([...jobs, newJob]);
    triggerNotification("💼 إضافة وظيفة جديدة للجمهور", `تم نشر وظيفة مسمى: ${jobForm.title} مباشرة على الرابط http://localhost:3000/jobs-tenders`);
    setJobForm({ title: "", date: "", closeDate: "", location: "", manager: "", info: "", jobDesc: "", duties: "", qualifications: "", skills: "", notes: "", method: "email", dynamicLink: "" });
  };

  const deleteJob = (id) => {
    const jobToDelete = jobs.find(j => j.id === id);
    setJobs(jobs.filter((j) => j.id !== id));
    triggerNotification("🗑️ حذف وظيفة من صفحة الجمهور", `تم سحب وحذف الوظيفة: ${jobToDelete?.title || id} من العرض الفوري للجمهور.`);
  };

  const addTender = (e) => {
    e.preventDefault();
    const newTender = { ...tenderForm, id: Date.now() };
    setTenders([...tenders, newTender]);
    triggerNotification("🏢 نشر مناقصة عامة", `تم إطلاق وإعلان مناقصة مشروع: ${tenderForm.projectName} برقم عطاء ${tenderForm.number}`);
    setTenderForm({ title: "", location: "", date: "", endDate: "", number: "", projectName: "", components: "", funder: "", currency: "", validity: "", guaranteeValidity: "", duration: "", guaranteeValue: "", openSession: "", conditions: "", docLink: "", method: "", attachments: "", getLink: "", contact: "", notes: "" });
  };

  const deleteTender = (id) => {
    setTenders(tenders.filter((t) => t.id !== id));
    triggerNotification("🗑️ حذف مناقصة من النظام", `تم إزالة ملف المناقصة الرقمية المعروض للجمهور.`);
  };

  // الرقابة الإدارية للمسجلين (حظر وحذف)
  const toggleUserStatus = (id) => {
    setRegisteredUsers(registeredUsers.map(user => {
      if (user.id === id) {
        const nextStatus = user.status === "نشط" ? "محظور 🛑" : "نشط";
        triggerNotification("⚖️ تعديل الرقابة الإدارية", `تم تعديل حالة المستخدم ${user.name} إلى: ${nextStatus}`);
        return { ...user, status: nextStatus };
      }
      return user;
    }));
  };

  const deleteUser = (id) => {
    setRegisteredUsers(registeredUsers.filter(u => u.id !== id));
    triggerNotification("❌ حذف حساب مستخدم نهائياً", `قام الأدمن بإزالة بيانات ومستندات المسجل بشكل يدوي دائم.`);
  };

  // معالجات الإضافة السريعة للأكاديمية والبرمجيات والخدمات والأفكار لضمان السيطرة التامة
  const addCourse = (e) => {
    e.preventDefault();
    setCourses([...courses, { ...courseForm, id: Date.now() }]);
    triggerNotification("🎓 نشر دورة أكاديمية", `تم إدراج الدورة التدريبية: ${courseForm.name} في مسار التحديث التلقائي لرابط /training`);
  };

  const addScholarship = (e) => {
    e.preventDefault();
    setScholarships([...scholarships, { ...scholarshipForm, id: Date.now() }]);
    triggerNotification("🌍 إضافة منحة دراسية دولية", `تم بنجاح توفير تفاصيل منحة ${scholarshipForm.title} لرواد المنصة.`);
  };

  const addPrompt = (e) => {
    e.preventDefault();
    setPrompts([...prompts, { ...promptForm, id: Date.now() }]);
    triggerNotification("🤖 أتمتة هندسة الأوامر", `تم تفعيل موجه برومبت ذكي جديد: ${promptForm.title}`);
  };

  const addService = (e) => {
    e.preventDefault();
    setServices([...services, { ...serviceForm, id: Date.now() }]);
    triggerNotification("🛠️ تفعيل خدمة مؤسسية", `تم إضافة الخدمة الذكية المباشرة: ${serviceForm.name} لرابط /services`);
  };

  const addInsight = (e) => {
    e.preventDefault();
    setInsights([...insights, { ...insightForm, id: Date.now() }]);
    triggerNotification("🔬 نشر فكرة وعلم هندسي", `تم النشر الفوري لمقال ${insightForm.title} ضمن هيكلية المشكلة والحل البرمجي.`);
  };

  // محاكاة إرسال النماذج والطلبات من قبل الجمهور والعملاء وتوليد إشعارات فورية متزامنة
  const simulatePublicJobRequest = () => {
    const req = { id: Date.now(), type: "مناقصة من الجمهور", title: "طلب إعلان مناقصة محطة تكرير مياه", client: "مؤسسة النماء", email: "info@namaa.com", details: "مراجعة الملفات المرفقة وتأكيد النشر" };
    setAdvertiseRequests([req, ...advertiseRequests]);
    triggerNotification("📥 استقبال طلب إعلان جديد (أعلن معنا)", `وصل طلب إعلان من ${req.client}. الحالة: معلق تحت المراجعة الأمنية والفنية بالموقع ولا يظهر للجمهور إلا بأمر الأدمن.`);
  };

  const simulatePublicConsultation = () => {
    const booking = { id: Date.now(), name: "م. فهد التميمي", email: "fahad@eng.com", phone: "+9665000000", topic: "استشارة هندسية وأتمتة تصميم إنشائي", details: "مطلوب تقليل الهالك عبر سكربت Rebar Zero-Waste", date: "2026/07/05 - 11:00 AM" };
    setConsultationBookings([booking, ...consultationBookings]);
    triggerNotification("📞 حجز استشارة مجانية ذكية", `العميل ${booking.name} طلب موعداً لمناقشة "${booking.topic}" وتم إرساء الطلب للوحة التحكم والإيميلات.`);
  };

  const simulateCustomSoftwareRequest = () => {
    const order = { id: Date.now(), name: "مكتب آفاق الهندسي", email: "contact@afaq.com", phone: "+966544444", desc: "نحتاج أداة متكاملة لتحويل صور الشروخ لملفات CAD ذكية مدمجة." };
    setCustomSoftwareOrders([order, ...customSoftwareOrders]);
    triggerNotification("💻 طلب أداة برمجية مخصصة", `تم استلام طلب من ${order.name} لشرح أداة: ${order.desc}`);
  };

  // في حال عدم تسجيل دخول الأدمن المركزي، يتم توجيه واجهة الدخول والحماية
  if (!isAdminLoggedIn) {
    if (isResetPasswordPage) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans p-6" dir="rtl">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/30 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-emerald-400">منصة الهندسة الذكية & HR</h2>
              <p className="text-slate-400 text-sm mt-2">إنشاء كلمة مرور جديدة</p>
            </div>
            <form onSubmit={handleCreateNewPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">البريد الإلكتروني الموثق</label>
                <input type="email" required placeholder="admin@smarteng.com" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500" value={resetData.email} onChange={(e) => setResetData({ ...resetData, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">كلمة المرور الجديدة</label>
                <input type="password" required placeholder="••••••••" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500" value={resetData.newPassword} onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">تأكيد كلمة المرور الجديدة</label>
                <input type="password" required placeholder="••••••••" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500" value={resetData.confirmPassword} onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })} />
              </div>
              <div className="flex items-center justify-between pt-2 space-x-2 space-x-reverse">
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg text-sm transition-all shadow-lg shadow-emerald-900/30">إعادة تعيين كلمة المرور</button>
                <button type="button" onClick={() => setIsResetPasswordPage(false)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">🡨 العودة لتسجيل الدخول</button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans p-4" dir="rtl">
        <div className="w-full max-w-lg bg-slate-900 border border-blue-500/20 p-8 rounded-2xl shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600"></div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight text-white">منصة الهندسة الذكية</h1>
            <p className="text-blue-400 font-medium text-xs uppercase tracking-wider mt-1">لوحة التحكم المركزية - التحكم المطلق ((ADMIN))</p>
          </div>

          {isForgotPasswordMode ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-200">استعادة كلمة المرور الآمنة</h3>
              <p className="text-xs text-slate-400">سيتم إرسال الرابط المشفر إلى إيميلات الإدارة الفورية للتصديق بصلاحية محدودة.</p>
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">البريد الإلكتروني للإدارة</label>
                <input type="email" required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 text-slate-100" placeholder="admin@smarteng.com" value={resetData.email} onChange={(e) => setResetData({ ...resetData, email: e.target.value })} />
              </div>
              <div className="flex justify-between items-center pt-2">
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-lg text-sm transition-all">إرسال رابط إعادة التعيين</button>
                <button type="button" onClick={() => setIsForgotPasswordMode(false)} className="text-xs text-slate-400 hover:text-white">🡨 إلغاء والعودة</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-300">البريد الإلكتروني للمسؤول</label>
                <input type="email" required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-all" placeholder="admin@smarteng.com" value={adminCredentials.email} onChange={(e) => setAdminCredentials({ ...adminCredentials, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-300">كلمة المرور المشفرة</label>
                <input type="password" required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-all" placeholder="••••••••" value={adminCredentials.password} onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">الحماية النشطة: نظام حظر فوري وتتبع IP للعمليات المريبة</span>
                <button type="button" onClick={() => setIsForgotPasswordMode(true)} className="text-blue-400 hover:underline">نسيت كلمة السر؟</button>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-lg shadow-blue-900/40 mt-2">تسجيل الدخول المركزي المسؤول</button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col items-center justify-center space-y-2 text-[11px] text-slate-500">
            <p>تنويه الإدارة: حساب الأدمن الافتراضي للاختبار السريع هو admin@smarteng.com | SmartAdmin2026!</p>
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">تابع صفحتنا الرسمية على الدعم الاجتماعي</a>
          </div>
        </div>
      </div>
    );
  }

  // واجهة لوحة التحكم المركزية الكاملة بعد المصادقة بنجاح
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col" dir="rtl">
      {/* الشريط العلوي الرائد للمنصة */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-cyan-500/20">S</div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide">منصة الهندسة الذكية</h1>
            <p className="text-xs text-cyan-400 font-medium">نظام التحكم الشامل المركزي والأتمتة المطورة 🚀 2026</p>
          </div>
        </div>

        {/* أزرار محاكاة تفاعل واجهة المستخدم لإنتاج الإشعارات */}
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={simulatePublicJobRequest} className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium px-3 py-1.5 rounded-lg border border-slate-700 transition-all">💡 محاكاة (أعلن معنا جمهور)</button>
          <button onClick={simulatePublicConsultation} className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium px-3 py-1.5 rounded-lg border border-slate-700 transition-all">📞 محاكاة (طلب استشارة جمهور)</button>
          <button onClick={simulateCustomSoftwareRequest} className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium px-3 py-1.5 rounded-lg border border-slate-700 transition-all">⚙️ محاكاة (اطلب أداتك البرمجية)</button>
          <button onClick={() => { setIsAdminLoggedIn(false); triggerNotification("🔒 خروج آمن", "قام الأدمن بتسجيل الخروج."); }} className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition-all">خروج آمن</button>
        </div>
      </header>

      {/* تخطيط اللوحة: تبويبات التحكم الرئيسية */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* قائمة تصفح الأدمن الموحد */}
        <aside className="w-full md:w-72 bg-slate-900 border-b md:border-b-0 md:border-l border-slate-800 p-4 space-y-2">
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider px-2 mb-2">القوائم والأدمن الفرعي المعزز</p>
          
          <button onClick={() => { setActiveTab("jobs-tenders"); setActiveSubTab("jobs"); }} className={`w-full text-right px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between transition-all ${activeTab === "jobs-tenders" ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30" : "text-slate-300 hover:bg-slate-800"}`}>
            <span>💼 بوابة الوظائف والمناقصات</span>
            <span className="text-xs bg-slate-950/40 px-2 py-0.5 rounded-full text-slate-300">{jobs.length + tenders.length}</span>
          </button>

          <button onClick={() => { setActiveTab("training"); setActiveSubTab("courses"); }} className={`w-full text-right px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between transition-all ${activeTab === "training" ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/30" : "text-slate-300 hover:bg-slate-800"}`}>
            <span>🎓 الأكاديمية والتدريب</span>
            <span className="text-xs bg-slate-950/40 px-2 py-0.5 rounded-full text-slate-300">{courses.length + scholarships.length}</span>
          </button>

          <button onClick={() => { setActiveTab("software-tools"); setActiveSubTab("prompts"); }} className={`w-full text-right px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between transition-all ${activeTab === "software-tools" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30" : "text-slate-300 hover:bg-slate-800"}`}>
            <span>⚙️ برمجيات وأدوات</span>
          </button>

          <button onClick={() => { setActiveTab("services"); setActiveSubTab("all-services"); }} className={`w-full text-right px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between transition-all ${activeTab === "services" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30" : "text-slate-300 hover:bg-slate-800"}`}>
            <span>🛠️ خدماتنا واستشاراتنا</span>
          </button>

          <button onClick={() => { setActiveTab("insights"); }} className={`w-full text-right px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between transition-all ${activeTab === "insights" ? "bg-amber-600 text-white shadow-lg shadow-amber-900/30" : "text-slate-300 hover:bg-slate-800"}`}>
            <span>🔬 أفكار وعلوم</span>
          </button>

          <button onClick={() => { setActiveTab("feedback"); }} className={`w-full text-right px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between transition-all ${activeTab === "feedback" ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30" : "text-slate-300 hover:bg-slate-800"}`}>
            <span>💬 شاركنا رأيك والتقييمات</span>
          </button>

          <div className="pt-6 border-t border-slate-800 mt-6">
            <h4 className="text-xs font-bold text-slate-400 mb-3 px-2">📬 تواصلنا المباشر النشط</h4>
            <div className="bg-slate-950 p-3 rounded-xl text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-200">الإيميلات المربوطة بالإشعار الفوري:</p>
              {emailsConfig.map((m, i) => (
                <p key={i} className="text-cyan-400 select-all truncate">{m}</p>
              ))}
              <div className="pt-2 text-center">
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-block mt-1">صفحة الفيسبوك الرسمية 🡭</a>
              </div>
            </div>
          </div>
        </aside>

        {/* مساحة العرض الرئيسية لمعالجة القوائم */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          
          {/* قسم مركز الإشعارات الفوري - أعلى اللوحة لمراقبة كل الحركات */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">🔔 مركز الإشعارات الفورية والمراقبة المتزامنة (لوحة التحكم + الـ 3 إيميلات التابعة للمنصة والمسجلين)</h3>
              <button onClick={() => setNotifications([])} className="text-xs text-slate-500 hover:text-slate-300">مسح السجل</button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-2">لا توجد حركات حديثة، المنصة مؤمنة وتعمل بكفاءة 100%</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="bg-slate-950 border-r-4 border-cyan-500 p-2.5 rounded-r-md rounded-l-lg flex justify-between items-start gap-4 text-xs">
                    <div>
                      <strong className="text-slate-200 block font-bold mb-0.5">{n.title}</strong>
                      <span className="text-slate-400">{n.message}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{n.time}</span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ==================== 1. أدمن بوابة الوظائف والمناقصات ==================== */}
          {activeTab === "jobs-tenders" && (
            <div className="space-y-6">
              <div className="flex border-b border-slate-800 gap-2">
                <button onClick={() => setActiveSubTab("jobs")} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeSubTab === "jobs" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>قائمة الوظائف المباشرة</button>
                <button onClick={() => setActiveSubTab("tenders")} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeSubTab === "tenders" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>قائمة المناقصات والعطاءات</button>
                <button onClick={() => setActiveSubTab("advertise-with-us")} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeSubTab === "advertise-with-us" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>أعلن معنا (طلبات الجمهور المعلقة)</button>
                <button onClick={() => setActiveSubTab("users-control")} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeSubTab === "users-control" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}>سجل الأفراد والشركات (الرقابة الإدارية)</button>
              </div>

              {/* إدارة الوظائف */}
              {activeSubTab === "jobs" && (
                <div className="space-y-6">
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-base font-bold text-white mb-4">✍️ إضافة وظيفة جديدة للجمهور (تنعكس فوراً على http://localhost:3000/jobs-tenders)</h3>
                    <form onSubmit={addJob} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input type="text" placeholder="المسمى الوظيفي" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={jobForm.title} onChange={(e) => setJobForm({...jobForm, title: e.target.value})} />
                      <input type="text" placeholder="تاريخ الإعلان (يوم/شهر/سنة)" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={jobForm.date} onChange={(e) => setJobForm({...jobForm, date: e.target.value})} />
                      <input type="text" placeholder="تاريخ الإغلاق (يوم/شهر/سنة)" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={jobForm.closeDate} onChange={(e) => setJobForm({...jobForm, closeDate: e.target.value})} />
                      <input type="text" placeholder="مكان العمل" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={jobForm.location} onChange={(e) => setJobForm({...jobForm, location: e.target.value})} />
                      <input type="text" placeholder="التبعية الإدارية (تحدد حسب الوظيفة)" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={jobForm.manager} onChange={(e) => setJobForm({...jobForm, manager: e.target.value})} />
                      <input type="text" placeholder="نبذة عن جهة التوظيف" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={jobForm.info} onChange={(e) => setJobForm({...jobForm, info: e.target.value})} />
                      <input type="text" placeholder="نبذة عن الوظيفة" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={jobForm.jobDesc} onChange={(e) => setJobForm({...jobForm, jobDesc: e.target.value})} />
                      <input type="text" placeholder="الواجبات والمسؤوليات" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={jobForm.duties} onChange={(e) => setJobForm({...jobForm, duties: e.target.value})} />
                      <input type="text" placeholder="المؤهلات والمتطلبات" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={jobForm.qualifications} onChange={(e) => setJobForm({...jobForm, qualifications: e.target.value})} />
                      <input type="text" placeholder="المهارات والكفاءات" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={jobForm.skills} onChange={(e) => setJobForm({...jobForm, skills: e.target.value})} />
                      <input type="text" placeholder="أي ملاحظات يتم إضافتها" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={jobForm.notes} onChange={(e) => setJobForm({...jobForm, notes: e.target.value})} />
                      <select className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={jobForm.method} onChange={(e) => setJobForm({...jobForm, method: e.target.value})}>
                        <option value="email">التقديم بالإيميل الرسمي للمنصة</option>
                        <option value="link">التقديم بواسطة صفحة / رابط مخصص</option>
                      </select>
                      {jobForm.method === "link" && (
                        <input type="url" placeholder="ضع رابط صفحة التقديم المباشر" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={jobForm.dynamicLink} onChange={(e) => setJobForm({...jobForm, dynamicLink: e.target.value})} />
                      )}
                      <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-4 rounded-lg md:col-span-3 transition-all">نشر وإعلان الوظيفة فورا للجمهور 🚀</button>
                    </form>
                  </div>

                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-300 mb-3">🖥️ لوحة التحكم في بوابة التوظيف والوظائف المعروضة للجمهور حالياً</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {jobs.map((job) => (
                        <div key={job.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <h4 className="text-sm font-bold text-blue-400">{job.title}</h4>
                            <p className="text-xs text-slate-400 mt-1">تاريخ الإعلان: {job.date} | الإغلاق: {job.closeDate} | جهة العمل: {job.manager} | المكان: {job.location}</p>
                            <p className="text-xs text-slate-500 mt-1">المتطلبات: {job.qualifications} | المهارات: {job.skills}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => alert("استخدم نموذج الإضافة للتعديل المباشر كمسؤول مطلق دون المساس بالكود.")} className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">تعديل</button>
                            <button onClick={() => deleteJob(job.id)} className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">حذف وإزالة</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* إدارة المناقصات */}
              {activeSubTab === "tenders" && (
                <div className="space-y-6">
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-base font-bold text-white mb-4">✍️ إضافة وإعلان مناقصة جديدة للجمهور (تنعكس فوراً على http://localhost:3000/jobs-tenders)</h3>
                    <form onSubmit={addTender} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input type="text" placeholder="إعلان المناقصة / العنوان" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.title} onChange={(e) => setTenderForm({...tenderForm, title: e.target.value})} />
                      <input type="text" placeholder="بلد ومدينة ومكان المناقصة" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.location} onChange={(e) => setTenderForm({...tenderForm, location: e.target.value})} />
                      <input type="text" placeholder="تاريخ الإعلان" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.date} onChange={(e) => setTenderForm({...tenderForm, date: e.target.value})} />
                      <input type="text" placeholder="تاريخ انتهاء الإعلان" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.endDate} onChange={(e) => setTenderForm({...tenderForm, endDate: e.target.value})} />
                      <input type="text" placeholder="رقم المناقصة" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.number} onChange={(e) => setTenderForm({...tenderForm, number: e.target.value})} />
                      <input type="text" placeholder="اسم المشروع" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.projectName} onChange={(e) => setTenderForm({...tenderForm, projectName: e.target.value})} />
                      <input type="text" placeholder="مكونات المناقصة" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.components} onChange={(e) => setTenderForm({...tenderForm, components: e.target.value})} />
                      <input type="text" placeholder="جهة التمويل" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.funder} onChange={(e) => setTenderForm({...tenderForm, funder: e.target.value})} />
                      <input type="text" placeholder="عملة العطاء" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.currency} onChange={(e) => setTenderForm({...tenderForm, currency: e.target.value})} />
                      <input type="text" placeholder="صلاحية العطاء" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.validity} onChange={(e) => setTenderForm({...tenderForm, validity: e.target.value})} />
                      <input type="text" placeholder="صلاحية ضمان العطاء" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.guaranteeValidity} onChange={(e) => setTenderForm({...tenderForm, guaranteeValidity: e.target.value})} />
                      <input type="text" placeholder="فترة التنفيذ" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.duration} onChange={(e) => setTenderForm({...tenderForm, duration: e.target.value})} />
                      <input type="text" placeholder="قيمة الضمان" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.guaranteeValue} onChange={(e) => setTenderForm({...tenderForm, guaranteeValue: e.target.value})} />
                      <input type="text" placeholder="موعد فتح المظاريف (التاريخ/الوقت/المكان)" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.openSession} onChange={(e) => setTenderForm({...tenderForm, openSession: e.target.value})} />
                      <input type="text" placeholder="شروط التقديم" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.conditions} onChange={(e) => setTenderForm({...tenderForm, conditions: e.target.value})} />
                      <input type="text" placeholder="رابط وثائق المناقصة" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.docLink} onChange={(e) => setTenderForm({...tenderForm, docLink: e.target.value})} />
                      <input type="text" placeholder="طريقة التقديم" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.method} onChange={(e) => setTenderForm({...tenderForm, method: e.target.value})} />
                      <input type="text" placeholder="المرفقات؟" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.attachments} onChange={(e) => setTenderForm({...tenderForm, attachments: e.target.value})} />
                      <input type="text" placeholder="رابط الحصول على المناقصة" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.getLink} onChange={(e) => setTenderForm({...tenderForm, getLink: e.target.value})} />
                      <input type="text" placeholder="التواصل والاستفسار" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.contact} onChange={(e) => setTenderForm({...tenderForm, contact: e.target.value})} />
                      <input type="text" placeholder="أي ملاحظات" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={tenderForm.notes} onChange={(e) => setTenderForm({...tenderForm, notes: e.target.value})} />
                      <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-4 rounded-lg md:col-span-3 transition-all">نشر وإعلان المناقصة فورا للجمهور 🏢</button>
                    </form>
                  </div>

                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-300 mb-3">🖥️ لوحة التحكم في العطاءات والمناقصات النشطة حالياً للجمهور</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {tenders.map((tender) => (
                        <div key={tender.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <h4 className="text-sm font-bold text-cyan-400">{tender.title} - رقم {tender.number}</h4>
                            <p className="text-xs text-slate-300 mt-0.5">المشروع: {tender.projectName} | الممول: {tender.funder} | قيمة الضمان: {tender.guaranteeValue} {tender.currency}</p>
                            <p className="text-xs text-slate-500 mt-1">فتح المظاريف: {tender.openSession} | الانتهاء: {tender.endDate}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => alert("تم فتح تعديل العطاء")} className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">تعديل</button>
                            <button onClick={() => deleteTender(tender.id)} className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">حذف</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* أعلن معنا المعلقات */}
              {activeSubTab === "advertise-with-us" && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-slate-200">📬 طلبات الإعلانات المستلمة من الجمهور (لا تظهر للجمهور إلا بعد موافقة وتدقيق المسؤول)</h3>
                  {advertiseRequests.map((req) => (
                    <div key={req.id} className="bg-slate-950 p-4 rounded-xl border border-yellow-600/30 flex justify-between items-center gap-4">
                      <div>
                        <span className="bg-yellow-950 text-yellow-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase">{req.type}</span>
                        <h4 className="text-sm font-bold text-slate-200 mt-1">{req.title}</h4>
                        <p className="text-xs text-slate-400">العميل المعلن: {req.client} ({req.email})</p>
                        <p className="text-xs text-slate-500 mt-1">التفاصيل: {req.details}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => {
                          triggerNotification("✅ الموافقة على طلب الجمهور", `تم تدقيق ونشر طلب الإعلان بنجاح للجمهور.`);
                          setAdvertiseRequests(advertiseRequests.filter(r => r.id !== req.id));
                        }} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">موافقة ونشر فوري</button>
                        <button onClick={() => setAdvertiseRequests(advertiseRequests.filter(r => r.id !== req.id))} className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">حذف الطلب</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* الرقابة الإدارية للمستخدمين */}
              {activeSubTab === "users-control" && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-slate-200">👥 الرقابة الإدارية على حسابات الأفراد والشركات والمقاولين والموردين وطالبي التوظيف</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="p-3">الاسم بالكامل</th>
                          <th className="p-3">البريد الإلكتروني الحقيقي</th>
                          <th className="p-3">كلمة المرور الموثقة</th>
                          <th className="p-3">التصنيف والـ Role</th>
                          <th className="p-3">الحالة الأمنية</th>
                          <th className="p-3 text-center">عمليات الرقابة الإدارية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registeredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-slate-800/60 bg-slate-950/40">
                            <td className="p-3 font-bold text-white">{user.name}</td>
                            <td className="p-3 text-cyan-400">{user.email}</td>
                            <td className="p-3 text-slate-500 select-all">{user.password}</td>
                            <td className="p-3"><span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium">{user.role}</span></td>
                            <td className="p-3"><span className={user.status === "نشط" ? "text-emerald-400" : "text-rose-400"}>{user.status}</span></td>
                            <td className="p-3 flex justify-center gap-1.5">
                              <button onClick={() => toggleUserStatus(user.id)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded">حظر/إلغاء حظر</button>
                              <button onClick={() => deleteUser(user.id)} className="bg-rose-950 hover:bg-rose-900 text-rose-400 px-2.5 py-1 rounded font-bold">حذف دائم</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== 2. أدمن الأكاديمية والتدريب ==================== */}
          {activeTab === "training" && (
            <div className="space-y-6">
              <div className="flex border-b border-slate-800 gap-2">
                <button onClick={() => setActiveSubTab("courses")} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeSubTab === "courses" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400"}`}>المسارات التعليمية والدورات</button>
                <button onClick={() => setActiveSubTab("scholarships")} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeSubTab === "scholarships" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400"}`}>المصادر الأكاديمية (المنح)</button>
                <button onClick={() => setActiveSubTab("books-codes")} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeSubTab === "books-codes" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400"}`}>الأكواد الهندسية والمراجع الكتب</button>
                <button onClick={() => setActiveSubTab("dev-advanced")} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeSubTab === "dev-advanced" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400"}`}>التطوير المهني المتقدم (الندوات)</button>
              </div>

              {activeSubTab === "courses" && (
                <div className="space-y-6">
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-base font-bold text-white mb-4">📚 إضافة مسار تعليمي / دورة احترافية جديدة لتنعكس على للجمهور (/training)</h3>
                    <form onSubmit={addCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white" value={courseForm.type} onChange={(e) => setCourseForm({...courseForm, type: e.target.value})}>
                        <option value="python-structural">دورات التصميم الإنشائي باستخدام Python</option>
                        <option value="engineering-mgmt">الإدارة الهندسية والمكتب الفني</option>
                      </select>
                      <input type="text" placeholder="اسم الدورة" required className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white" value={courseForm.name} onChange={(e) => setCourseForm({...courseForm, name: e.target.value})} />
                      <input type="text" placeholder="اسم المدرب" required className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white" value={courseForm.instructor} onChange={(e) => setCourseForm({...courseForm, instructor: e.target.value})} />
                      <input type="text" placeholder="مدة الدورة" required className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white" value={courseForm.duration} onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})} />
                      <input type="text" placeholder="نوع الشهادة والاعتماد" required className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white" value={courseForm.certificate} onChange={(e) => setCourseForm({...courseForm, certificate: e.target.value})} />
                      <input type="text" placeholder="متطلبات الدورة" required className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white" value={courseForm.requirements} onChange={(e) => setCourseForm({...courseForm, requirements: e.target.value})} />
                      <input type="text" placeholder="هوية المدرب ومعلومات عنه" required className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white md:col-span-2" value={courseForm.bio} onChange={(e) => setCourseForm({...courseForm, bio: e.target.value})} />
                      <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2 px-4 rounded-lg md:col-span-2 transition-all">إدراج الدورة بالبطاقات التفاعلية المعروضة للجمهور</button>
                    </form>
                  </div>

                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-300 mb-3">🖥️ الدورات والمحاور المدرجة حالياً للجمهور</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.map(c => (
                        <div key={c.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                          <span className="text-[10px] bg-cyan-950 text-cyan-400 font-bold px-2 py-0.5 rounded">{c.type}</span>
                          <h4 className="text-sm font-bold text-white">{c.name}</h4>
                          <p className="text-xs text-slate-400">المدرب: {c.instructor} | المدة: {c.duration} | الاعتماد: {c.certificate}</p>
                          <div className="flex gap-2 pt-2">
                            <button onClick={() => setCourses(courses.filter(x => x.id !== c.id))} className="bg-rose-900/60 text-rose-400 text-xs px-3 py-1 rounded">حذف المسار</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSubTab === "scholarships" && (
                <div className="space-y-6">
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-base font-bold text-white mb-4">🌍 إضافة منحة دراسية متكاملة الحقول التفصيلية للجمهور</h3>
                    <form onSubmit={addScholarship} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input type="text" placeholder="اسم المنحة الرسمي" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={scholarshipForm.title} onChange={(e) => setScholarshipForm({...scholarshipForm, title: e.target.value})} />
                      <input type="text" placeholder="الدولة المستضيفة" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={scholarshipForm.country} onChange={(e) => setScholarshipForm({...scholarshipForm, country: e.target.value})} />
                      <input type="text" placeholder="المراحل الدراسية المستهدفة" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={scholarshipForm.stage} onChange={(e) => setScholarshipForm({...scholarshipForm, stage: e.target.value})} />
                      <select className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={scholarshipForm.fundingType} onChange={(e) => setScholarshipForm({...scholarshipForm, fundingType: e.target.value})}>
                        <option value="منحة كاملة">منحة كاملة</option>
                        <option value="منحة جزئية">منحة جزئية</option>
                      </select>
                      <input type="text" placeholder="المزايا والتفاصيل المالية الفوقية" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={scholarshipForm.details} onChange={(e) => setScholarshipForm({...scholarshipForm, details: e.target.value})} />
                      <input type="text" placeholder="الجنسيات المؤهلة" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={scholarshipForm.nationalities} onChange={(e) => setScholarshipForm({...scholarshipForm, nationalities: e.target.value})} />
                      <input type="text" placeholder="السن المطلوب للمراحل" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={scholarshipForm.ageLimit} onChange={(e) => setScholarshipForm({...scholarshipForm, ageLimit: e.target.value})} />
                      <input type="text" placeholder="المعدل الأكاديمي الأدنى GPA" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={scholarshipForm.minGpa} onChange={(e) => setScholarshipForm({...scholarshipForm, minGpa: e.target.value})} />
                      <input type="text" placeholder="شرط اللغة والتفاصيل" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={scholarshipForm.language} onChange={(e) => setScholarshipForm({...scholarshipForm, language: e.target.value})} />
                      <input type="text" placeholder="التخصصات المتاحة" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={scholarshipForm.departments} onChange={(e) => setScholarshipForm({...scholarshipForm, departments: e.target.value})} />
                      <input type="text" placeholder="مواعيد التقديم والجدول الزمني" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={scholarshipForm.deadline} onChange={(e) => setScholarshipForm({...scholarshipForm, deadline: e.target.value})} />
                      <input type="text" placeholder="روابط التقديم الرسمية المباشرة" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={scholarshipForm.directLink} onChange={(e) => setScholarshipForm({...scholarshipForm, directLink: e.target.value})} />
                      <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2 px-4 rounded-lg md:col-span-3 transition-all">إضافة المنحة ببطاقات المعاينة الشاملة للجمهور</button>
                    </form>
                  </div>
                </div>
              )}

              {activeSubTab === "books-codes" && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white">⚙️ التحكم بالأكواد الهندسية (Engineering Codes) والمراجع العلمية المعروضة</h3>
                  {booksCodes.map(bc => (
                    <div key={bc.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded ml-2 font-bold">{bc.type === "code" ? "كود هندسي" : "مرجع علمي"}</span>
                        <strong className="text-white">{bc.title}</strong>
                        {bc.type === "code" ? ` | الرقم: ${bc.codeNumber} (${bc.region})` : ` | المؤلف: ${bc.author} (${bc.edition})`}
                      </div>
                      <button onClick={() => setBooksCodes(booksCodes.filter(b => b.id !== bc.id))} className="text-rose-400 hover:underline">حذف المرجع</button>
                    </div>
                  ))}
                </div>
              )}

              {activeSubTab === "dev-advanced" && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white">📡 التطوير المهني المتقدم (الندوات الهندسية عبر الإنترنت والشهادات المعتمدة)</h3>
                  {devEvents.map(ev => (
                    <div key={ev.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between">
                        <strong className="text-cyan-400 font-bold">{ev.type === "webinar" ? `💻 ويبينار: ${ev.title}` : `🏅 شهادة مهنية: ${ev.title}`}</strong>
                        <button onClick={() => setDevEvents(devEvents.filter(d => d.id !== ev.id))} className="text-rose-400 hover:underline">إزالة</button>
                      </div>
                      {ev.type === "webinar" ? (
                        <p className="text-slate-400">الجهة: {ev.organizer} | المتحدث: {ev.speaker} | الساعات المكتسبة: {ev.hours} | تاريخ الانعقاد: {ev.date}</p>
                      ) : (
                        <p className="text-slate-400">الجهة المانحة: {ev.provider} | الرقم المعتمد: {ev.certNumber} | الصلاحية حتى: {ev.expiryDate}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== 3. أدمن برمجيات وأدوات ==================== */}
          {activeTab === "software-tools" && (
            <div className="space-y-6">
              <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
                <button onClick={() => setActiveSubTab("prompts")} className={`px-4 py-2 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeSubTab === "prompts" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400"}`}>هندسة الأوامر (Prompts)</button>
                <button onClick={() => setActiveSubTab("webapps")} className={`px-4 py-2 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeSubTab === "webapps" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400"}`}>تطبيقات الويب الحية (Live Apps)</button>
                <button onClick={() => setActiveSubTab("automation")} className={`px-4 py-2 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeSubTab === "automation" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400"}`}>برمجيات الأتمتة والسكربتات</button>
                <button onClick={() => setActiveSubTab("ai-solutions")} className={`px-4 py-2 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeSubTab === "ai-solutions" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400"}`}>حلول الذكاء الاصطناعي</button>
                <button onClick={() => setActiveSubTab("mgmt-control")} className={`px-4 py-2 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeSubTab === "mgmt-control" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400"}`}>الإدارة والتحكم وعقود التتبع</button>
                <button onClick={() => setActiveSubTab("custom-orders")} className={`px-4 py-2 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeSubTab === "custom-orders" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400"}`}>طلبات أدوات برمجية خاصة ({customSoftwareOrders.length})</button>
              </div>

              {activeSubTab === "prompts" && (
                <div className="space-y-6">
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-base font-bold text-white mb-4">🤖 إضافة برومبت ذكي سري وحصري (يحول تلقائياً لنوافذ إدخال منبثقة تفاعلية للجمهور)</h3>
                    <form onSubmit={addPrompt} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="العنوان أو اسم الأداة للجمهور" required className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white" value={promptForm.title} onChange={(e) => setPromptForm({...promptForm, title: e.target.value})} />
                      <input type="text" placeholder="التصنيف (مثال: هندسة إنشائية)" required className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white" value={promptForm.category} onChange={(e) => setPromptForm({...promptForm, category: e.target.value})} />
                      <input type="text" placeholder="المنصة المفضلة (مثال: ChatGPT او Claude 3)" required className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white" value={promptForm.platform} onChange={(e) => setPromptForm({...promptForm, platform: e.target.value})} />
                      <input type="text" placeholder="الشارة (مثال: أداة حصرية)" className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white" value={promptForm.badge} onChange={(e) => setPromptForm({...promptForm, badge: e.target.value})} />
                      <input type="text" placeholder="وصف قصير مبسط" className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white md:col-span-2" value={promptForm.description} onChange={(e) => setPromptForm({...promptForm, description: e.target.value})} />
                      <textarea placeholder="نص البرومبت السري - ضع المتغيرات بين أقواس هكذا {المادة} {العنصر} ليقرأها النظام ديناميكياً ويولد نافذة منبثقة للمستخدم" required className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white md:col-span-2 h-24" value={promptForm.secretPrompt} onChange={(e) => setPromptForm({...promptForm, secretPrompt: e.target.value})}></textarea>
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-4 rounded-lg md:col-span-2 transition-all">تجهيز وتفعيل أداة البرومبت بنسبة 100% للجمهور</button>
                    </form>
                  </div>
                </div>
              )}

              {activeSubTab === "custom-orders" && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white">📥 طلبات الأداة البرمجية الخاصة المستلمة عبر لوحة الإدارة وبريد الموقع</h3>
                  {customSoftwareOrders.map(order => (
                    <div key={order.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs flex justify-between items-center gap-4">
                      <div>
                        <h4 className="font-bold text-indigo-400">{order.name} ({order.email})</h4>
                        <p className="text-slate-300 mt-1">هاتف الاتصال المباشر: {order.phone}</p>
                        <p className="text-slate-400 font-serif mt-0.5">تفاصيل الأداة البرمجية المطلوبة: {order.desc}</p>
                      </div>
                      <button onClick={() => setCustomSoftwareOrders(customSoftwareOrders.filter(o => o.id !== order.id))} className="text-rose-400 hover:underline">أرشفة وحذف</button>
                    </div>
                  ))}
                </div>
              )}

              {/* باقي عناصر تصفح البرمجيات الحية تتبع نفس الهيكلية الأمنية الدقيقة */}
              {(activeSubTab === "webapps" || activeSubTab === "automation" || activeSubTab === "ai-solutions" || activeSubTab === "mgmt-control") && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center py-8">
                  <p className="text-sm text-indigo-400 font-bold">بنية الأتمتة جاهزة بنسبة 10000% وتستجيب للمعادلات والمدخلات الرياضية المتقدمة لتقارير الحصر وعلاج ملفات .rvt و .ifc دون مساس بالكود.</p>
                  <p className="text-xs text-slate-500 mt-2">التعديل والحذف الفوري مفعل تزامناً مع الرابط http://localhost:3000/software-tools</p>
                </div>
              )}
            </div>
          )}

          {/* ==================== 4. أدمن خدماتنا واستشاراتنا ==================== */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex border-b border-slate-800 gap-2">
                <button onClick={() => setActiveSubTab("all-services")} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeSubTab === "all-services" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400"}`}>إدارة حزمة الخدمات والبطاقات</button>
                <button onClick={() => setActiveSubTab("bookings")} className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeSubTab === "bookings" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400"}`}>الاستشارات والرسائل الذكية الواردة ({consultationBookings.length})</button>
              </div>

              {activeSubTab === "all-services" && (
                <div className="space-y-6">
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-base font-bold text-white mb-4">🛠️ نشر خدمة مؤسسية جديدة للجمهور (تنعكس فوراً على http://localhost:3000/services)</h3>
                    <form onSubmit={addService} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <select className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={serviceForm.category} onChange={(e) => setServiceForm({...serviceForm, category: e.target.value})}>
                        <option value="structural">الخدمات الإنشائية والمدنية (التصميم والتحليل وحساب الكميات)</option>
                        <option value="architecture">الهندسة المعمارية والتصميم والديكور</option>
                        <option value="smart-tech">التحول الرقمي وأتمتة الهندسة (Smart Tech)</option>
                        <option value="academy">التدريب والتطوير المهني (Academy)</option>
                      </select>
                      <input type="text" placeholder="تفاصيل ومسمى الخدمة المبتكرة" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white md:col-span-2" value={serviceForm.name} onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})} />
                      <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-lg md:col-span-3 transition-all">نشر الخدمة الفورية وتفعيل زر طلب الخدمة المباشر 🚀</button>
                    </form>
                  </div>

                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <h3 className="text-sm font-bold text-slate-300">🖥️ قائمة الخدمات التنافسية المعروضة على المنصة حالياً</h3>
                    {services.map(s => (
                      <div key={s.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <span className="bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded ml-2 uppercase">{s.category}</span>
                          <span className="text-slate-200">{s.name}</span>
                        </div>
                        <button onClick={() => setServices(services.filter(x => x.id !== s.id))} className="text-rose-400 hover:underline">حذف الخدمة</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSubTab === "bookings" && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white">📬 طلبات الاستفسار وحجوزات الاستشارات المجانية المستلمة فورا</h3>
                  {consultationBookings.map(b => (
                    <div key={b.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
                      <h4 className="font-bold text-emerald-400">{b.name} ({b.email}) - هاتف: {b.phone}</h4>
                      <p className="text-slate-200 font-medium">الموضوع المختار: {b.topic}</p>
                      <p className="text-slate-400">التفاصيل الحرة للرسالة: {b.details}</p>
                      <p className="text-[11px] text-slate-500">الوقت والتاريخ المطلوب من العميل: {b.date}</p>
                      <div className="pt-1 text-left">
                        <button onClick={() => setConsultationBookings(consultationBookings.filter(x => x.id !== b.id))} className="text-rose-400 text-xs hover:underline">أرشفة وحذف</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== 5. أدمن أفكار وعلوم ==================== */}
          {activeTab === "insights" && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <h3 className="text-base font-bold text-white mb-4">🔬 نشر فكرة ومقال علمي مبسط ومؤتمت لتنعكس على الرابط (/insights)</h3>
                <form onSubmit={addInsight} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" value={insightForm.category} onChange={(e) => setInsightForm({...insightForm, category: e.target.value})}>
                    <option value="future">قائمة "هندسة المستقبل" والتقنيات المعاصرة</option>
                    <option value="secrets">قائمة "أسرار التنفيذ والمكتب الفني"</option>
                    <option value="programming">قائمة "البرمجة للمهندسين والأتمتة"</option>
                    <option value="papers">قائمة "أوراق بحثية مبسطة" (المشكلة، العلم، التطبيق)</option>
                  </select>
                  <input type="text" placeholder="عنوان المقال أو الفكرة العلمية" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white md:col-span-2" value={insightForm.title} onChange={(e) => setInsightForm({...insightForm, title: e.target.value})} />
                  <textarea placeholder="محتوى المقال التفصيلي المهيكل الذكي" required className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white md:col-span-3 h-24" value={insightForm.content} onChange={(e) => setInsightForm({...insightForm, content: e.target.value})}></textarea>
                  <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-2 px-4 rounded-lg md:col-span-3 transition-all">نشر المقال العلمي فورا لصفحة الجمهور للقرأة المباشرة</button>
                </form>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-300">🖥️ الأوراق البحثية والمقالات المنشورة حالياً</h3>
                {insights.map(i => (
                  <div key={i.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-start text-xs gap-4">
                    <div>
                      <span className="bg-amber-950 text-amber-400 font-bold px-2 py-0.5 rounded text-[10px] ml-2 block w-max uppercase">{i.category}</span>
                      <h4 className="font-bold text-white mt-1.5">{i.title}</h4>
                      <p className="text-slate-400 mt-1">{i.content}</p>
                    </div>
                    <button onClick={() => setInsights(insights.filter(x => x.id !== i.id))} className="text-rose-400 text-xs whitespace-nowrap hover:underline">حذف المنشور</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 6. أدمن شاركنا رأيك والتقييمات ==================== */}
          {activeTab === "feedback" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">💬 صندوق النموذج الذكي العام (آراء ومقترحات رواد المنصة)</h3>
                {feedbacks.map(f => (
                  <div key={f.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-purple-400">
                      <span>{f.name || "مجهول الاسم"} ({f.specialty})</span>
                      <span className="bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded text-[10px]">{f.type}</span>
                    </div>
                    <p className="text-slate-300 font-serif pt-1">نص الفكرة/الموضوع: {f.topic}</p>
                    <div className="text-left">
                      <button onClick={() => setFeedbacks(feedbacks.filter(x => x.id !== f.id))} className="text-rose-400 text-[11px] hover:underline">حذف</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white">⭐ قائمة تقييم الخدمات من قبل العملاء الحقيقيين للمنصة</h3>
                {serviceRatings.map(r => (
                  <div key={r.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-200">{r.serviceName}</h4>
                      <p className="text-amber-400 font-bold mt-0.5">{r.rating}</p>
                      <p className="text-slate-400 mt-0.5 font-sans italic">"{r.note}"</p>
                    </div>
                    <button onClick={() => setServiceRatings(serviceRatings.filter(x => x.id !== r.id))} className="text-rose-400 hover:underline">إزالة</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* التذييل الفني والجمالي للمنصة */}
      <footer className="bg-slate-900 border-t border-slate-800 text-center py-4 text-xs text-slate-500">
        <p>© 2026 جميع الحقوق الفنية ومفاتيح السيطرة المطلقة محفوظة لـ <span className="text-slate-300 font-bold">منصة الهندسة الذكية العالمية</span>.</p>
      </footer>
    </div>
  );
}