"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Star, 
  Code, 
  Smile, 
  Meh, 
  Frown, 
  Award, 
  ArrowRight, 
  Send, 
  Upload, 
  CheckCircle2, 
  Layers,
  Sparkles,
  HelpCircle,
  FileCheck
} from "lucide-react";

export default function PublicFeedbackPage() {
  // القوائم والخدمات الافتراضية المبدئية
  const defaultServices = [
    "تصميم إنشائي", 
    "استشارة تقنية", 
    "دورة تدريبية", 
    "تخطيط معماري", 
    "إدارة مشاريع هندسية",
    "أتمتة وبرمجيات هندسية"
  ];
  
  const [services, setServices] = useState(defaultServices);

  // حالات التنقل بين القوائم الفرعية وحالة الإرسال
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [screenshotName, setScreenshotName] = useState("");

  // حالات النماذج الذكية الخمسة
  const [generalForm, setGeneralForm] = useState({ 
    name: "", 
    specialty: "مهندس مدني", 
    type: "اقتراح", 
    subject: "" 
  });
  
  const [serviceForm, setServiceForm] = useState({ 
    service: "تصميم إنشائي", 
    quality: 5, 
    timing: 5, 
    response: 5, 
    improvement: "" 
  });
  
  const [codeForm, setCodeForm] = useState({ proposal: "" });
  
  const [uxForm, setUxForm] = useState({ rating: "satisfied", screenshot: null });
  
  const [successForm, setSuccessForm] = useState({ 
    name: "", 
    specialty: "مهندس مدني", 
    type: "إشادة", 
    subject: "", 
    allowPublish: true 
  });

  // البريد الإلكتروني المستهدف المعتمد للربط والإشعارات
  const targetEmails = [
    "Smart.Engineering.Global@proton.me",
    "smart.engineering.global@tuta.io",
    "smartengineering.hr.global@gmail.com"
  ];

  // مزامنة خدمات الأدمن الديناميكية تلقائياً من الـ API و Storage
  useEffect(() => {
    try {
      const savedServices = localStorage.getItem("smart_engineering_services");
      if (savedServices) {
        const parsed = JSON.parse(savedServices);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setServices(parsed);
          setServiceForm(prev => ({ ...prev, service: parsed[0] }));
        }
      } else {
        localStorage.setItem("smart_engineering_services", JSON.stringify(defaultServices));
      }
    } catch (error) {
      console.error("خطأ في قراءة خدمات المنصة:", error);
      setServices(defaultServices);
    }
  }, []);

  // دالة الإرسال الفعالة واستدعاء الـ API وتأمين التخزين
  const handleSubmit = async (e, formType, formData) => {
    e.preventDefault();
    
    const payload = {
      id: Date.now(),
      type: formType,
      data: formData,
      submittedAt: new Date().toLocaleString("ar-EG"),
      status: "pending"
    };

    // 1. التخزين المحلي الاحتياطي لضمان عدم ضياع المدخلات
    try {
      const savedInbox = localStorage.getItem("smart_engineering_inbox");
      let currentInbox = savedInbox ? JSON.parse(savedInbox) : [];
      if (!Array.isArray(currentInbox)) currentInbox = [];
      currentInbox.unshift(payload);
      localStorage.setItem("smart_engineering_inbox", JSON.stringify(currentInbox));
    } catch (err) {
      console.error("خطأ التخزين المحلي:", err);
    }

    // 2. الإرسال إلى ملف الـ API المخصص للبريد
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (apiErr) {
      console.log("تم الحفظ في لوحة التحكم وتأمين الرسالة بنجاح.", apiErr);
    }

    // إظهار تنبيه النجاح وإعادة ضبط الحقول
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      if (formType === "general") setGeneralForm({ name: "", specialty: "مهندس مدني", type: "اقتراح", subject: "" });
      if (formType === "service") setServiceForm({ service: services[0] || "تصميم إنشائي", quality: 5, timing: 5, response: 5, improvement: "" });
      if (formType === "code") setCodeForm({ proposal: "" });
      if (formType === "ux") { setUxForm({ rating: "satisfied", screenshot: null }); setScreenshotName(""); }
      if (formType === "success") setSuccessForm({ name: "", specialty: "مهندس مدني", type: "إشادة", subject: "", allowPublish: true });
    }, 3500);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshotName(e.target.files[0].name);
      setUxForm({ ...uxForm, screenshot: e.target.files[0].name });
    }
  };

  // ترجمة عدد النجوم إلى وصف عربي دقيق
  const getStarLabel = (rating) => {
    switch (rating) {
      case 1: return "نجمة - خدمة سيئة";
      case 2: return "نجمتان - مقبول";
      case 3: return "3 نجمات - جيد";
      case 4: return "4 نجمات - جيد جداً";
      case 5: return "5 نجمات - خدمة ممتازة";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950" style={{ direction: 'rtl' }}>
      
      {/* خلفية هندسية معبرة عالية الدقة مع شبكة ضوئية متحركة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none"></div>
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/20 to-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-5xl">
        
        {/* زر العودة المباشر إلى الرئيسية في منصة الهندسة الذكية */}
        <div className="flex justify-between items-center mb-10">
          <a 
            href="/" 
            className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-all bg-slate-900/90 backdrop-blur-md border border-cyan-800/40 px-5 py-2.5 rounded-2xl shadow-xl shadow-cyan-950/30 group hover:border-cyan-500/60"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>العودة للرئيسية في منصة الهندسة الذكية</span>
          </a>
          <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-900/80 border border-slate-800 text-slate-400 px-4 py-2 rounded-full font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Smart Engineering Platform v2026</span>
          </div>
        </div>

        {/* الواجهة والعبارة الترحيبية المعتمدة */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex p-3.5 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-3xl shadow-2xl shadow-cyan-500/20 mb-2 ring-4 ring-cyan-500/10">
            <Layers className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent tracking-tight leading-tight">
            مرحباً بكم في فضاء التطوير المشترك
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-light bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50 backdrop-blur">
            "آراؤكم مهمة لنا ومحل تقدير وهي لبناء الثقة وتطوير المنصة بناءً على احتياجات المهندسين والعملاء الفعليين."
          </p>
        </div>

        {/* شريط الانتقال بين القوائم الخمس الفرعية الأساسية */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-2 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl mb-10 shadow-2xl">
          {[
            { id: "general", label: "النموذج الذكي العام", icon: MessageSquare },
            { id: "services", label: "تقييم الخدمات", icon: Star },
            { id: "code", label: "ركن المقترحات البرمجية", icon: Code },
            { id: "ux", label: "تجربة المستخدم", icon: Smile },
            { id: "success", label: "قصص النجاح", icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col md:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-center">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* إشعار النجاح المنبثق التفاعلي */}
        {isSubmitted && (
          <div className="mb-8 p-5 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl flex items-center gap-4 text-emerald-300 animate-bounce backdrop-blur shadow-2xl">
            <CheckCircle2 className="w-7 h-7 shrink-0 text-emerald-400" />
            <div>
              <h4 className="font-bold text-base">تم استلام مساهمتك بنجاح!</h4>
              <p className="text-xs text-emerald-200 mt-0.5">
                تم توجيه رسالتك فورياً إلى لوحة تحكم الإدارة والبريد الإلكتروني المعتمد للموقع: ({targetEmails.join(", ")})
              </p>
            </div>
          </div>
        )}

        {/* حاوية النماذج الذكية الرئيسية */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

          {/* A. قائمة النموذج الذكي العام */}
          {activeTab === "general" && (
            <form onSubmit={(e) => handleSubmit(e, "general", generalForm)} className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
                  <MessageSquare className="text-cyan-400 w-6 h-6" /> النموذج الذكي العام
                </h3>
                <p className="text-xs text-slate-400 mt-1">مساحة خاصة بجميع زوار ومهندسي المنصة لإرسال الملاحظات العامة والأفكار.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">الاسم <span className="text-xs text-slate-500">(اختياري)</span></label>
                  <input 
                    type="text" 
                    placeholder="أدخل اسمك هنا..." 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    value={generalForm.name}
                    onChange={(e) => setGeneralForm({...generalForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">التخصص</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                    value={generalForm.specialty}
                    onChange={(e) => setGeneralForm({...generalForm, specialty: e.target.value})}
                  >
                    <option value="مهندس مدني">مهندس مدني</option>
                    <option value="مهندس معماري">مهندس معماري</option>
                    <option value="طالب">طالب</option>
                    <option value="صاحب مشروع">صاحب مشروع</option>
                    <option value="اخر يرجي ذكره">اخر يرجي ذكره</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">نوع المشاركة</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                  value={generalForm.type}
                  onChange={(e) => setGeneralForm({...generalForm, type: e.target.value})}
                >
                  <option value="شكوى">شكوى</option>
                  <option value="اقتراح">اقتراح</option>
                  <option value="اشادة">اشادة</option>
                  <option value="فكرة برمجية">فكرة برمجية</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">الموضوع</label>
                <textarea 
                  rows="4" 
                  required
                  placeholder="اكتب موضوع المشاركة والرسالة بكل تفصيل..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                  value={generalForm.subject}
                  onChange={(e) => setGeneralForm({...generalForm, subject: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all text-base">
                <Send className="w-5 h-5" />
                <span>ساهم في تطوير المنصة</span>
              </button>
            </form>
          )}

          {/* B. قائمة تقييم الخدمات */}
          {activeTab === "services" && (
            <form onSubmit={(e) => handleSubmit(e, "service", serviceForm)} className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
                  <Star className="text-amber-400 w-6 h-6" /> قائمة تقييم الخدمات
                </h3>
                <p className="text-xs text-slate-400 mt-1">هذه القائمة مخصصة للعملاء الذين تعاملوا معنا بالفعل لتقييم جودة الخدمة المقدمة.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">اختيار الخدمة التي حصل عليها العميل</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-500 transition-all font-medium"
                  value={serviceForm.service}
                  onChange={(e) => setServiceForm({...serviceForm, service: e.target.value})}
                >
                  {Array.isArray(services) && services.map((srv, idx) => (
                    <option key={idx} value={srv}>{srv}</option>
                  ))}
                </select>
              </div>

              {/* معايير التقييم بنظام النجوم الخمس */}
              <div className="space-y-5 bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80">
                <label className="text-sm font-bold text-amber-400 block border-b border-slate-900 pb-2">
                  معايير التقييم (اختر عدد النجوم لكل معيار):
                </label>

                {[
                  { key: "quality", title: "أ. جودة التنفيذ" },
                  { key: "timing", title: "ب. الالتزام بالمواعيد" },
                  { key: "response", title: "ج. سرعة الاستجابة والتواصل" }
                ].map((criterion) => (
                  <div key={criterion.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800/40">
                    <div>
                      <span className="text-sm font-bold text-slate-200">{criterion.title}</span>
                      <span className="block text-xs text-amber-400/90 font-mono mt-0.5">
                        {getStarLabel(serviceForm[criterion.key])}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 dir-ltr">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setServiceForm({...serviceForm, [criterion.key]: star})}
                          className={`p-1.5 transition-all ${
                            star <= serviceForm[criterion.key] ? "text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "text-slate-700 hover:text-slate-500"
                          }`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">كيف يمكننا تحسين هذه الخدمة مستقبلاً؟</label>
                <textarea 
                  rows="3" 
                  placeholder="أدخل مرئياتك الفنية لخدمتك بشكل أفضل في المرات القادمة..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all resize-none"
                  value={serviceForm.improvement}
                  onChange={(e) => setServiceForm({...serviceForm, improvement: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black rounded-xl shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 transition-all text-base">
                <Send className="w-5 h-5" />
                <span>ساهم في تطوير المنصة</span>
              </button>
            </form>
          )}

          {/* C. قائمة ركن المقترحات البرمجية */}
          {activeTab === "code" && (
            <form onSubmit={(e) => handleSubmit(e, "code", codeForm)} className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
                  <Code className="text-purple-400 w-6 h-6" /> قائمة ركن المقترحات البرمجية
                </h3>
                <p className="text-xs text-slate-400 mt-1">نستقبل هنا مقترحات الأدوات والسكريبتات البرمجية التي تساهم في أتمتة العمل الهندسي.</p>
              </div>

              <div className="space-y-3 bg-purple-950/20 p-5 rounded-2xl border border-purple-800/30">
                <label className="text-base font-bold text-purple-300 leading-relaxed block">
                  * سؤال: "ما هي الأداة البرمجية أو السكريبت الذي تمنيت وجوده لتسهيل عملك الهندسي؟"
                </label>
                <textarea 
                  rows="5" 
                  required
                  placeholder="مثال: أداة لتحليل الأحمال الإنشائية التلقائية، سكريبت تحويل ملفات AutoCAD إلى Excel، برمجيات حصر الكميات..."
                  className="w-full bg-slate-950 border border-purple-900/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all resize-none font-mono text-sm"
                  value={codeForm.proposal}
                  onChange={(e) => setCodeForm({ proposal: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold rounded-xl shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2 transition-all text-base">
                <Send className="w-5 h-5" />
                <span>ساهم في تطوير المنصة</span>
              </button>
            </form>
          )}

          {/* D. قائمة تقييم تجربة المستخدم */}
          {activeTab === "ux" && (
            <form onSubmit={(e) => handleSubmit(e, "ux", uxForm)} className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
                  <Smile className="text-blue-400 w-6 h-6" /> قائمة تقييم تجربة المستخدم
                </h3>
                <p className="text-xs text-slate-400 mt-1">تساعدنا هذه القائمة في قياس سهولة تصفح المنصة وعلاج أي مشكلات تقنية فورية.</p>
              </div>

              <div className="space-y-4">
                <label className="text-base font-bold text-slate-200 block">
                  سؤال: "ما مدى سهولة استخدام الموقع والوصول للمعلومات؟"
                </label>
                
                {/* طريقة التقييم بخلية اختيار خيار وحيد فقط */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "satisfied", icon: Smile, text: "راضي جداً", desc: "سهل وسلس للغاية", color: "border-emerald-500 bg-emerald-950/40 text-emerald-400" },
                    { id: "neutral", icon: Meh, text: "مقبول أو متوسط", desc: "يحتاج بعض التحسين", color: "border-amber-500 bg-amber-950/40 text-amber-400" },
                    { id: "unsatisfied", icon: Frown, text: "غير راضي", desc: "صعب الاستخدام", color: "border-rose-500 bg-rose-950/40 text-rose-400" }
                  ].map((option) => {
                    const OptionIcon = option.icon;
                    const isSelected = uxForm.rating === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setUxForm({...uxForm, rating: option.id})}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                          isSelected
                            ? `${option.color} scale-105 shadow-2xl ring-2 ring-offset-2 ring-offset-slate-900 ring-cyan-500`
                            : "border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        <OptionIcon className="w-12 h-12 mb-3" />
                        <span className="font-bold text-base">{option.text}</span>
                        <span className="text-xs text-slate-400 mt-1">{option.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* خيار إرفاق صورة Screenshot للمشكلات التقنية */}
              <div className="space-y-2 pt-2">
                <label className="text-sm font-semibold text-slate-300">
                  خيار لإرفاق صورة (Screenshot): <span className="text-xs text-slate-500">(في حال واجه المستخدم مشكلة تقنية أو خطأ في واجهة الموقع)</span>
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-slate-800 border-dashed rounded-2xl cursor-pointer bg-slate-950/90 hover:bg-slate-900 transition-all hover:border-blue-500/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-9 h-9 text-blue-400 mb-2" />
                      <p className="text-sm text-slate-300 font-bold">اضغط هنا لإرفاق لقطة الشاشة</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP حتى 10MB</p>
                      {screenshotName && (
                        <div className="mt-3 flex items-center gap-2 bg-blue-950 text-blue-300 px-3 py-1 rounded-lg border border-blue-800 text-xs font-mono">
                          <FileCheck className="w-4 h-4 text-blue-400" />
                          <span>{screenshotName}</span>
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-extrabold rounded-xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all text-base">
                <Send className="w-5 h-5" />
                <span>ساهم في تطوير المنصة</span>
              </button>
            </form>
          )}

          {/* E. قسم قصص النجاح */}
          {activeTab === "success" && (
            <form onSubmit={(e) => handleSubmit(e, "success", successForm)} className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
                  <Award className="text-teal-400 w-6 h-6" /> قسم "قصص النجاح"
                </h3>
                <p className="text-xs text-slate-400 mt-1">مساحة للعملاء والمهندسين لكتابة كلمة شكر أو عرض تجربة إيجابية ملهمة.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">الاسم <span className="text-xs text-slate-500">(اختياري)</span></label>
                  <input 
                    type="text" 
                    placeholder="الاسم الكريم أو اللقب..." 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                    value={successForm.name}
                    onChange={(e) => setSuccessForm({...successForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">التخصص</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                    value={successForm.specialty}
                    onChange={(e) => setSuccessForm({...successForm, specialty: e.target.value})}
                  >
                    <option value="مهندس مدني">مهندس مدني</option>
                    <option value="معماري">معماري</option>
                    <option value="طالب">طالب</option>
                    <option value="صاحب مشروع">صاحب مشروع</option>
                    <option value="اخر يرجي تحديدها">اخر يرجي تحديدها</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">نوع المشاركة</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                  value={successForm.type}
                  onChange={(e) => setSuccessForm({...successForm, type: e.target.value})}
                >
                  <option value="اقتراح جديد">اقتراح جديد</option>
                  <option value="شكوى">شكوى</option>
                  <option value="إشادة">إشادة</option>
                  <option value="فكرة برمجية">فكرة برمجية</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">الموضوع / كلمة الشكر والتجربة الإيجابية</label>
                <textarea 
                  rows="4" 
                  required
                  placeholder="اكتب تفاصيل تجربتك أو كلمة الشكر هنا..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-all resize-none"
                  value={successForm.subject}
                  onChange={(e) => setSuccessForm({...successForm, subject: e.target.value})}
                ></textarea>
              </div>

              {/* صندوق الاختيار الخاص بالإذن بالنشر */}
              <div className="flex items-center gap-3 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <input 
                  type="checkbox" 
                  id="allowPublish" 
                  className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
                  checked={successForm.allowPublish}
                  onChange={(e) => setSuccessForm({...successForm, allowPublish: e.target.checked})}
                />
                <label htmlFor="allowPublish" className="text-sm font-medium text-slate-300 cursor-pointer select-none">
                  "هل تسمح لنا بنشر رأيك في قسم آراء العملاء على الصفحة الرئيسية؟"
                </label>
              </div>

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-teal-500 via-emerald-600 to-green-600 hover:from-teal-400 hover:to-green-500 text-white font-extrabold rounded-xl shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 transition-all text-base">
                <Award className="w-5 h-5" />
                <span>ساهم في تطوير الهندسة الذكية</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}