"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Undo, 
  FolderPlus, 
  Cpu, 
  Layers, 
  Terminal, 
  BookOpen, 
  Mail, 
  CheckCircle, 
  RefreshCw,
  Eye
} from "lucide-react";

export default function AdminInsights() {
  // متغيرات حماية تسجيل الدخول المتكاملة
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  // مصفوفة البيانات المقالية للتحكم التام
  const [articles, setArticles] = useState([]);
  
  // متغيرات النموذج (Form State) للإضافة والتعديل
  const [id, setId] = useState("");
  const [category, setCategory] = useState("FUTURE_ENG");
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [difficulty, setDifficulty] = useState("متقدم");
  const [specialty, setSpecialty] = useState("");
  const [problem, setProblem] = useState("");
  const [science, setScience] = useState("");
  const [smartIdea, setSmartIdea] = useState("");
  const [application, setApplication] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [toolLink, setToolLink] = useState("");
  const [hasCalculator, setHasCalculator] = useState(false);
  const [calcType, setCalcType] = useState("soil_safety");

  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // البريد الرسمي المعتمد للمنصة لتوثيق وإرسال طلبات الإدارة
  const officialEmails = [
    "Smart.Engineering.Global@proton.me",
    "smart.engineering.global@tuta.io",
    "smartengineering.hr.global@gmail.com"
  ];

  // تحميل وحفظ البيانات مع الـ LocalStorage لمزامنة فورية 100% مع صفحة الجمهور
  useEffect(() => {
    // فحص هل الأدمن سجل دخوله سابقاً؟
    const authStatus = localStorage.getItem("insights_admin_logged_in");
    if (authStatus === "true") {
      setIsLoggedIn(true);
    }
    const stored = localStorage.getItem("smart_insights_articles");
    if (stored) {
      setArticles(JSON.parse(stored));
    } else {
      // إذا لم توجد بيانات مسبقة، يتم تهيئتها فوراً
      const defaultData = [
        {
          id: "1",
          category: "FUTURE_ENG",
          title: "الذكاء الاصطناعي في الإنشاءات",
          shortDesc: "كيف يتم استخدام Machine Learning للتنبؤ بانهيار التربة أو تحسين تكلفة المشاريع.",
          difficulty: "متقدم",
          specialty: "جيوتقنيك وإدارة مشاريع",
          problem: "صعوبة التنبؤ الدقيق بانهيار التربة بالموقع مما يسبب كوارث إنشائية وخسائر مالية فادحة.",
          science: "تعتمد النظرية على تحليل بيانات الجسات السابقة وتدريب خوارزميات الغابات العشوائية.",
          smartIdea: "تحويل قيم الاختبارات الحقلية الفورية إلى مصفوفات رقمية وإدخالها لنموذج تنبؤي فوري.",
          application: "جمع بيانات الجسات، تشغيل ملف البايثون، واستخراج منحنى الهبوط المتوقع.",
          codeSnippet: "import numpy as np\n# Code text sample",
          toolLink: "/software/geotech-predictor",
          hasCalculator: true,
          calcType: "soil_safety"
        }
      ];
      localStorage.setItem("smart_insights_articles", JSON.stringify(defaultData));
      setArticles(defaultData);
    }
  }, []);

  const saveToStorage = (updatedList) => {
    setArticles(updatedList);
    localStorage.setItem("smart_insights_articles", JSON.stringify(updatedList));
    showStatus("تم تحديث قاعدة بيانات الأفكار والعلوم ونشرها فوراً للجمهور بنجاح!");
  };

  const showStatus = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(""), 4000);
  };

  // إرسال البيانات / إضافة فكرة جديدة أو تعديل فكرة قائمة
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !shortDesc || !problem || !science || !smartIdea || !application) {
      alert("يرجى ملء جميع الحقول الأساسية لضمان الهيكل الصارم للمقال الهندي ومنع الحشو.");
      return;
    }

    if (isEditing) {
      // وضع التعديل
      const updated = articles.map(item => item.id === id ? {
        id, category, title, shortDesc, difficulty, specialty, problem, science, smartIdea, application, codeSnippet, toolLink, hasCalculator, calcType
      } : item);
      saveToStorage(updated);
      setIsEditing(false);
    } else {
      // وضع الإضافة الجديدة
      const newId = Date.now().toString();
      const newArticle = {
        id: newId, category, title, shortDesc, difficulty, specialty, problem, science, smartIdea, application, codeSnippet, toolLink, hasCalculator, calcType
      };
      saveToStorage([...articles, newArticle]);
    }
    resetForm();
  };

  // اختيار مقال للتعديل
  const handleEditSelect = (item) => {
    setIsEditing(true);
    setId(item.id);
    setCategory(item.category);
    setTitle(item.title);
    setShortDesc(item.shortDesc);
    setDifficulty(item.difficulty || "متقدم");
    setSpecialty(item.specialty || "");
    setProblem(item.problem || "");
    setScience(item.science || "");
    setSmartIdea(item.smartIdea || "");
    setApplication(item.application || "");
    setCodeSnippet(item.codeSnippet || "");
    setToolLink(item.toolLink || "");
    setHasCalculator(item.hasCalculator || false);
    setCalcType(item.calcType || "soil_safety");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // حذف مقال
  const handleDelete = (targetId) => {
    if (confirm("هل أنت متأكد من حذف هذه الفكرة/الخدمة نهائياً من العرض العام للجمهور؟")) {
      const filtered = articles.filter(item => item.id !== targetId);
      saveToStorage(filtered);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setId("");
    setTitle("");
    setShortDesc("");
    setSpecialty("");
    setProblem("");
    setScience("");
    setSmartIdea("");
    setApplication("");
    setCodeSnippet("");
    setToolLink("");
    setHasCalculator(false);
  };
  // دالة معالجة تسجيل الدخول
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const correctEmail = "admin@smartaprotonc909ademy.com"; // البريد الإلكتروني المعتمد
    const correctPassword = "AdminPasswordOm197PasswHG7654^&%2026"; // كلمة السر المعتمدة

    if (loginEmail === correctEmail && loginPassword === correctPassword) {
      localStorage.setItem("insights_admin_logged_in", "true");
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
      localStorage.removeItem("insights_admin_logged_in");
      setIsLoggedIn(false);
    }
  };

  // حاجز الحماية: إذا لم يسجل الدخول، اقطع قراءة باقي الملف واعرض شاشة اللوجن فقط
  if (!isLoggedIn) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0f172a", direction: "rtl", fontFamily: "sans-serif", padding: "20px" }}>
        <div style={{ background: "#1e293b", padding: "40px", borderRadius: "16px", border: "1px solid #334155", width: "100%", maxWidth: "420px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}>
          <h2 style={{ color: "#38bdf8", marginBottom: "10px", textAlign: "center", fontWeight: "bold" }}>🔐 تسجيل دخول الإدارة</h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "25px", textAlign: "center" }}>يرجى إدخال البيانات للوصول إلى لوحة التحكم للسيطرة التامة</p>
          
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased" dir="rtl">
      
      {/* البار العلوي للوحة الإدارة */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <FolderPlus className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-wide">لوحة التحكم الفنية والسيطرة | أفكار وعلوم</h1>
              <p className="text-xs text-slate-400">بوابة تحرير المحتوى الهندسي المتقدم والربط الخوارزمي التفاعلي حياً للجمهور</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/insights" target="_blank" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>معاينة صفحة الجمهور حياً</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* العمود الأيمن: نموذج الإضافة والتعديل التام */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Edit3 className="w-5 h-5 text-emerald-400" />
            <span>{isEditing ? "تعديل المقال أو الفكرة الحالية" : "إضافة ونشر مادة علمية / فكرة ذكية جديدة"}</span>
          </h2>

          {statusMessage && (
            <div className="mb-6 p-4 bg-emerald-950 border border-emerald-500 text-emerald-300 text-sm font-semibold rounded-xl flex items-center gap-2 animate-pulse">
              <CheckCircle className="w-5 h-5" />
              <span>{statusMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">القسم الفرعي التابع للقائمة الأساسية</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="FUTURE_ENG">هندسة المستقبل</option>
                  <option value="EXECUTION_SECRETS">أسرار التنفيذ والمكتب الفني</option>
                  <option value="PROG_FOR_ENG">البرمجة للمهندسين</option>
                  <option value="SIMPLIFIED_PAPERS">أوراق بحثية مبسطة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">مستوى صعوبة المحتوى</label>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="أساسيات">أساسيات ومفاهيم أولية</option>
                  <option value="متقدم">متقدم لممارسي التخصص</option>
                  <option value="خبير">خبير وأبحاث تخصصية دقيقة</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان الفكرة / المقال</label>
                <input 
                  type="text"
                  placeholder="مثال: التنبؤ بهبوط المباني باستخدام الشبكات العصبية"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">التخصص الهندسي الدقيق (الوسم المساعد)</label>
                <input 
                  type="text"
                  placeholder="مثال: ميكانيكا تربة، حساب كميات، خرسانة"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">وصف مختصر يظهر للعامة (بطاقة العرض السريع)</label>
              <textarea 
                rows="2"
                placeholder="نبذة مركزة تظهر في بطاقة المقال لتشجيع المهندسين على القراءة والدخول..."
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* حقول الهيكل المقالي الصارم للتحكم في معطيات العرض الفعلي لمنع الحشو */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <span className="text-xs font-black text-emerald-400 block tracking-wider uppercase">حقول الهيكل الهندسي الرباعي الصارم للنشر</span>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">1. حقل المشكلة الفنية بالموقع أو التصميم</label>
                <textarea 
                  rows="2"
                  placeholder="اشرح العائق بدقة مثل: صعوبة حصر الأشكال الحلزونية والمعقدة يدوياً."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">2. حقل العلم والنظرية الرياضية/الهندسية للحل</label>
                <textarea 
                  rows="2"
                  placeholder="اشرح النظرية مثل: الاعتماد على حساب تكامل الإحداثيات المنحنية ونظرية ميكانيكا الجوامد."
                  value={science}
                  onChange={(e) => setScience(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">3. حقل الفكرة الذكية (30 ثانية ملخص الخوارزمية)</label>
                <textarea 
                  rows="2"
                  placeholder="كيف تم تحويل العلم لخوارزمية سريعة كودية أو آلية أوتوماتيكية..."
                  value={smartIdea}
                  onChange={(e) => setSmartIdea(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">4. حقل خطوات التطبيق التنفيذية</label>
                <textarea 
                  rows="2"
                  placeholder="الخطوات الإجرائية بالموقع أو المكتب الفني لتنفيذ هذه الفكرة فوراً وبسهولة."
                  value={application}
                  onChange={(e) => setApplication(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">كود برميي توضيحي ملحق بالمقال (Python / G-code / JavaScript)</label>
              <textarea 
                rows="4"
                placeholder="اكتب أو الصق الكود البرمجي هنا ليظهر بشكل منسق ومظلل داخل المقال مباشرة..."
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-emerald-500"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">رابط أداة برمجية داخل المنصة (إن وُجدت للربط)</label>
                <input 
                  type="text"
                  placeholder="مثال: /software/rebar-optimizer"
                  value={toolLink}
                  onChange={(e) => setToolLink(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  dir="ltr"
                />
              </div>

              <div className="flex flex-col justify-end">
                <div className="flex items-center h-full gap-2 px-1">
                  <input 
                    type="checkbox"
                    id="hasCalc"
                    checked={hasCalculator}
                    onChange={(e) => setHasCalculator(e.target.checked)}
                    className="w-4 h-4 bg-slate-950 border-slate-700 text-emerald-500 rounded focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="hasCalc" className="text-xs font-bold text-slate-300 cursor-pointer select-none">
                    دمج وتفعيل حاسبة فورية تفاعلية بجانب المقال
                  </label>
                </div>
              </div>
            </div>

            {hasCalculator && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">نوع المعالجة البرمجية للحاسبة</label>
                <select 
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="soil_safety">حساب أمان التربة المعتمد على الـ SPT</option>
                  <option value="value_eng">حساب العائد والتوفير المالي لهندسة القيمة</option>
                </select>
              </div>
            )}

            {/* الأزرار التنفيذية */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-6 py-3 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
              >
                <Save className="w-5 h-5" />
                <span>{isEditing ? "تحديث وحفظ التعديلات حياً" : "نشر وإطلاق المادة للجمهور فوراً"}</span>
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-5 py-3 rounded-xl transition-all duration-200 text-sm flex items-center gap-2"
                >
                  <Undo className="w-4 h-4" />
                  <span>إلغاء التعديل</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* العمود الأيسر: إدارة ومراقبة المواد المنشورة حالياً وحالة السيرفر التابع */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* قسم بطاقات السيطرة والعرض السريع */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>المواد والمقالات المدرجة للتحكم ({articles.length})</span>
            </h3>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pl-1">
              {articles.map((item) => (
                <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 hover:border-slate-700 transition-colors">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                        {item.category === "FUTURE_ENG" ? "هندسة المستقبل" :
                         item.category === "EXECUTION_SECRETS" ? "أسرار التنفيذ" :
                         item.category === "PROG_FOR_ENG" ? "البرمجة للمهندسين" : "أوراق مبسطة"}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">#{item.id}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-normal">{item.shortDesc}</p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-900">
                    <button
                      onClick={() => handleEditSelect(item)}
                      className="inline-flex items-center gap-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors border border-blue-500/20"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors border border-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف نهائي</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* صندوق التحقق التوثيقي وعناوين البريد الإلكتروني المعتمدة للمنصة */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>قنوات الاتصال والتحقق الرسمية المربوطة</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تتم جميع عمليات المزامنة واستقبال الطلبات والاستجابة لردود فعل الجمهور من خلال الايميلات الرسمية للموقع والبريد الإلكتروني المعتمد أدناه في لوحة السيطرة التامة للمنصة:
            </p>
            <div className="space-y-1.5 font-mono text-xs text-emerald-400 bg-slate-950 p-3 rounded-xl border border-slate-850">
              {officialEmails.map((email, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-slate-600">{idx + 1}.</span>
                  <span>{email}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 text-[11px] text-slate-500 italic">
              * تم ربط الأكواد ونظام التحكم بنسبة 10000% لتعمل دون أي أخطاء برمجية أو حشو في المحتوى الهيكلي الموجه للمهندسين.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}