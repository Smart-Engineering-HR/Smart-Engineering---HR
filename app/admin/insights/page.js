"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Trash2, 
  Edit3, 
  Save, 
  Undo, 
  FolderPlus, 
  Mail, 
  CheckCircle, 
  RefreshCw, 
  Eye, 
  Lock, 
  ArrowRight 
} from "lucide-react";

export default function AdminInsights() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [articles, setArticles] = useState([]);
  
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
  const [loading, setLoading] = useState(false);

  const officialEmails = [
    "Smart.Engineering.Global@proton.me",
    "smart.engineering.global@tuta.io",
    "smartengineering.hr.global@gmail.com"
  ];

  useEffect(() => {
    const authStatus = localStorage.getItem("insights_admin_logged_in");
    if (authStatus === "true") setIsLoggedIn(true);
    fetchAdminArticles();
  }, []);

  const fetchAdminArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/insights", { cache: "no-store" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setArticles(json.data);
      }
    } catch (e) {
      console.error("خطأ في الجلب من قاعدة البيانات", e);
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !shortDesc || !problem || !science || !smartIdea || !application) {
      alert("يرجى إكمال الحقول الأساسية لضمان الهيكل العلمي الموحد.");
      return;
    }

    const payload = {
      id: isEditing ? id : undefined,
      category, title, shortDesc, difficulty, specialty, problem, science, smartIdea, application, codeSnippet, toolLink, hasCalculator, calcType
    };

    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/insights", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (json.success && json.fullData) {
        setArticles(json.fullData);
        showStatus(isEditing ? "تم حفظ التعديل دائمياً بقاعدة البيانات!" : "تمت الإضافة الدائمة إلى قاعدة البيانات!");
        resetForm();
      } else {
        alert("فشلت العملية: " + (json.error || "خطأ غير معروف"));
      }
    } catch (err) {
      alert("تعذر الاتصال بالخادم، تحقق من كلمة المرور وقاعدة البيانات.");
    }
  };

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

  const handleDelete = async (targetId) => {
    if (confirm("هل أنت متأكد من حذف هذه المادة نهائياً من قاعدة البيانات؟")) {
      try {
        const res = await fetch(`/api/insights?id=${targetId}`, { method: "DELETE" });
        const json = await res.json();
        if (json.success && json.fullData) {
          setArticles(json.fullData);
          showStatus("تم الحذف نهائياً من قاعدة البيانات.");
        } else {
          alert("فشل الحذف: " + (json.error || "خطأ غير معروف"));
        }
      } catch (e) {
        alert("تعذر حذف العنصر من قاعدة البيانات.");
      }
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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail === "admin@smartacademy.com" && loginPassword === "AdminPasswordOm197PasswHG7654^&%2026") {
      localStorage.setItem("insights_admin_logged_in", "true");
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("❌ بيانات الدخول غير صحيحة!");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <Lock className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-xl font-black text-white text-center mb-2">تسجيل دخول لوحة التحكم</h2>
          <p className="text-xs text-slate-400 text-center mb-6">إدارة ونشر أفكار وعلوم منصة الهندسة الذكية</p>
          
          {loginError && (
            <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500 text-rose-300 text-xs rounded-xl text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني للإدارة</label>
              <input 
                type="email" 
                required 
                placeholder="admin@smartacademy.com"
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">كلمة المرور</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/10"
            >
              دخول آمن للوحة السيطرة
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased" dir="rtl">
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
              <FolderPlus className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">لوحة التحكم التامة | قاعدة البيانات المباشرة</h1>
              <p className="text-xs text-slate-400">إدارة الأفكار والعلوم بصورة دائمة ومحفوظة في PostgreSQL</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/" className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </Link>
            <Link href="/insights" target="_blank" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/10">
              <Eye className="w-4 h-4" />
              <span>معاينة العرض العام</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Edit3 className="w-5 h-5 text-emerald-400" />
            <span>{isEditing ? "تعديل المادة العلمية المحددة" : "إضافة مادة علمية وفكرة جديدة"}</span>
          </h2>

          {statusMessage && (
            <div className="mb-6 p-4 bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2 animate-pulse">
              <CheckCircle className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">القائمة الفرعية التابعة</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="FUTURE_ENG">هندسة المستقبل</option>
                  <option value="EXECUTION_SECRETS">أسرار التنفيذ والمكتب الفني</option>
                  <option value="PROG_FOR_ENG">البرمجة للمهندسين</option>
                  <option value="SIMPLIFIED_PAPERS">أوراق بحثية مبسطة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">مستوى الصعوبة والوسم</label>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="أساسيات">أساسيات</option>
                  <option value="متقدم">متقدم</option>
                  <option value="خبير">خبير</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">العنوان الرئيسي</label>
                <input 
                  type="text"
                  placeholder="عنوان الفكرة أو المادة..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">التخصص الهندسي</label>
                <input 
                  type="text"
                  placeholder="مثال: جيوتقنيك، إنشائي، مكتب فني"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">الوصف المختصر</label>
              <textarea 
                rows="2"
                placeholder="نبذة سريعة تظهر في البطاقات..."
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
              <span className="text-[11px] font-black text-emerald-400 block tracking-wider uppercase">حقول الهيكل العلمي الرباعي</span>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">1. المشكلة الإنشائية/الفنية</label>
                <textarea 
                  rows="2"
                  placeholder="شرح المشكلة بالتفصيل..."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">2. الأساس العلمي والنظرية</label>
                <textarea 
                  rows="2"
                  placeholder="شرح النظرية الرياضية أو الهندسية..."
                  value={science}
                  onChange={(e) => setScience(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">3. الفكرة الذكية والحل الخوارزمي (ملخص 30 ثانية)</label>
                <textarea 
                  rows="2"
                  placeholder="كيف تم تحويل النظرية إلى خوارزمية وحل ذكي..."
                  value={smartIdea}
                  onChange={(e) => setSmartIdea(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">4. خطوات التطبيق التنفيذية</label>
                <textarea 
                  rows="2"
                  placeholder="الخطوات الإجرائية بالموقع أو المكتب..."
                  value={application}
                  onChange={(e) => setApplication(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">الكود البرمجي التوضيحي المرفق</label>
              <textarea 
                rows="3"
                placeholder="أدخل كود Python أو JS أو G-code..."
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full bg-[#050811] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-emerald-500"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">رابط أداة برمجية داخل الموقع</label>
                <input 
                  type="text"
                  placeholder="/software/tool-name"
                  value={toolLink}
                  onChange={(e) => setToolLink(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  dir="ltr"
                />
              </div>

              <div className="flex flex-col justify-end">
                <div className="flex items-center gap-2 h-full">
                  <input 
                    type="checkbox"
                    id="hasCalcCheck"
                    checked={hasCalculator}
                    onChange={(e) => setHasCalculator(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="hasCalcCheck" className="text-xs font-bold text-slate-300 cursor-pointer">
                    تفعيل الحاسبة التفاعلية المدمجة
                  </label>
                </div>
              </div>
            </div>

            {hasCalculator && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">نوع المعالجة للحاسبة</label>
                <select 
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="soil_safety">حساب أمان التربة بناء على قراءة SPT</option>
                  <option value="value_eng">حساب توفير ميزانية هندسة القيمة</option>
                </select>
              </div>
            )}

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 rounded-xl transition-all text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? "تحديث وحفظ التعديلات" : "نشر المادة وقيدها بالداتابيز"}</span>
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-3 rounded-xl transition-all text-xs flex items-center gap-2"
                >
                  <Undo className="w-4 h-4" />
                  <span>إلغاء</span>
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>المواد بالداتابيز ({articles.length})</span>
              </span>
              <button 
                onClick={fetchAdminArticles}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded"
              >
                تحديث القائمة
              </button>
            </h3>

            {loading ? (
              <p className="text-center text-xs text-slate-500 py-4">جاري التحميل من PostgreSQL...</p>
            ) : (
              <div className="space-y-3 max-h-[55vh] overflow-y-auto pl-1 custom-scrollbar">
                {articles.map((item) => (
                  <div key={item.id} className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between gap-2 hover:border-slate-700 transition-colors">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] bg-slate-900 text-emerald-400 px-2 py-0.5 rounded font-mono border border-slate-800">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-900">
                      <button
                        onClick={() => handleEditSelect(item)}
                        className="inline-flex items-center gap-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-[11px] font-bold px-3 py-1 rounded-lg transition-colors border border-sky-500/20"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>تعديل</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px] font-bold px-3 py-1 rounded-lg transition-colors border border-rose-500/20"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>الإيميلات الرسمية المعتمدة للمنصة</span>
            </h3>
            <div className="space-y-2 font-mono text-[11px] text-emerald-400 bg-slate-950 p-3.5 rounded-2xl border border-slate-850">
              {officialEmails.map((email, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-slate-600">{idx + 1}.</span>
                  <span>{email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}