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
  CheckCircle, 
  Layers 
} from "lucide-react";

export default function PublicFeedbackPage() {
  // القوائم والخدمات الافتراضية
  const defaultServices = ["تصميم إنشائي", "استشارة تقنية", "دورة تدريبية"];
  const [services, setServices] = useState(defaultServices);

  // حالات النماذج المختلفة
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [screenshotName, setScreenshotName] = useState("");

  // البيانات المدخلة في كل نموذج
  const [generalForm, setGeneralForm] = useState({ name: "", specialty: "مهندس مدني", type: "اقتراح", subject: "" });
  const [serviceForm, setServiceForm] = useState({ service: "تصميم إنشائي", quality: 5, timing: 5, response: 5, improvement: "" });
  const [codeForm, setCodeForm] = useState({ proposal: "" });
  const [uxForm, setUxForm] = useState({ rating: "satisfied", screenshot: null });
  const [successForm, setSuccessForm] = useState({ name: "", specialty: "مهندس مدني", type: "إشادة", subject: "", allowPublish: true });

  // البريد الإلكتروني المستهدف لإرسال الإشعارات
  const emailsToSend = [
    "Smart.Engineering.Global@proton.me",
    "smart.engineering.global@tuta.io",
    "smartengineering.hr.global@gmail.com"
  ];

  // جلب البيانات المحدثة من الأدمن بشكل آمن ومحصن بالكامل
  useEffect(() => {
    try {
      const savedServices = localStorage.getItem("smart_engineering_services");
      if (savedServices) {
        const parsed = JSON.parse(savedServices);
        if (Array.isArray(parsed)) {
          setServices(parsed);
          if (parsed.length > 0) {
            setServiceForm(prev => ({ ...prev, service: parsed[0] }));
          }
        } else {
          localStorage.setItem("smart_engineering_services", JSON.stringify(defaultServices));
        }
      } else {
        localStorage.setItem("smart_engineering_services", JSON.stringify(defaultServices));
      }
    } catch (error) {
      console.error("Error reading services from localStorage:", error);
      setServices(defaultServices);
    }
  }, []);

  // دالة معالجة الإرسال ومحاكاة الإرسال إلى الإيميلات والـ Dashboard
  const handleSubmit = (e, formType, formData) => {
    e.preventDefault();
    
    // تجهيز الكائن المرسل
    const payload = {
      id: Date.now(),
      type: formType,
      data: formData,
      submittedAt: new Date().toLocaleString("ar-EG"),
      status: "pending"
    };

    try {
      // حفظها في لوحة التحكم
      const savedInbox = localStorage.getItem("smart_engineering_inbox");
      let currentInbox = [];
      if (savedInbox) {
        const parsedInbox = JSON.parse(savedInbox);
        currentInbox = Array.isArray(parsedInbox) ? parsedInbox : [];
      }
      currentInbox.unshift(payload);
      localStorage.setItem("smart_engineering_inbox", JSON.stringify(currentInbox));
    } catch (err) {
      console.error("Error updating inbox in localStorage:", err);
    }

    // محاكاة الإرسال لـ Nodemailer والإيميلات المحددة
    console.log(`Sending email notification to: ${emailsToSend.join(", ")}`, payload);

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      // إعادة تعيين الحقول
      if (formType === "general") setGeneralForm({ name: "", specialty: "مهندس مدني", type: "اقتراح", subject: "" });
      if (formType === "service") setServiceForm({ service: services[0] || "تصميم إنشائي", quality: 5, timing: 5, response: 5, improvement: "" });
      if (formType === "code") setCodeForm({ proposal: "" });
      if (formType === "ux") { setUxForm({ rating: "satisfied", screenshot: null }); setScreenshotName(""); }
      if (formType === "success") setSuccessForm({ name: "", specialty: "مهندس مدني", type: "إشادة", subject: "", allowPublish: true });
    }, 3000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshotName(e.target.files[0].name);
      setUxForm({ ...uxForm, screenshot: e.target.files[0].name });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden" style={{ direction: 'rtl' }}>
      
      {/* خلفية هندسية إبداعية مع تأثيرات ضوئية معبرة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-5xl">
        
        {/* زر العودة للرئيسية */}
        <div className="flex justify-between items-center mb-12">
          <a 
            href="/" 
            className="flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-all bg-slate-900/80 backdrop-blur border border-slate-800 px-4 py-2 rounded-xl shadow-lg shadow-cyan-950/20 group"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            <span>العودة للرئيسية في منصة الهندسة الذكية</span>
          </a>
          <div className="text-xs bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1.5 rounded-full font-mono">
            Smart Engineering Platform v2.0
          </div>
        </div>

        {/* الواجهة الترحيبية الاحترافية */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-xl shadow-cyan-500/10 mb-2">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent tracking-tight">
            مرحباً بكم في فضاء التطوير المشترك
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            "آراؤكم مهمة لنا ومحل تقدير وهي لبناء الثقة وتطوير المنصة بناءً على احتياجات المهندسين والعملاء الفعليين."
          </p>
        </div>

        {/* شريط الانتقال بين القوائم الخمس الفرعية بشكل ذكي وأنيق */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-1.5 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl mb-10 shadow-2xl">
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
                className={`flex flex-col md:flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-center">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* رسالة النجاح المنبثقة عند الإرسال */}
        {isSubmitted && (
          <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 animate-pulse backdrop-blur">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">تم إرسال مساهمتك بنجاح وجاري إرسالها إلى لوحة التحكم والبريد الإلكتروني المعتمد للمنصة.</p>
          </div>
        )}

        {/* حاوية النماذج الذكية */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl relative">
          
          {/* A. نموذج الذكي العام */}
          {activeTab === "general" && (
            <form onSubmit={(e) => handleSubmit(e, "general", generalForm)} className="space-y-6">
              <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <MessageSquare className="text-cyan-400 w-5 h-5" /> النموذج الذكي العام للزوار والمهندسين
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">الاسم <span className="text-xs text-slate-500">(اختياري)</span></label>
                  <input 
                    type="text" 
                    placeholder="المهندس / العميل" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                    value={generalForm.name}
                    onChange={(e) => setGeneralForm({...generalForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">التخصص</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                    value={generalForm.specialty}
                    onChange={(e) => setGeneralForm({...generalForm, specialty: e.target.value})}
                  >
                    <option>مهندس مدني</option>
                    <option>مهندس معماري</option>
                    <option>طالب</option>
                    <option>صاحب مشروع</option>
                    <option>اخر يرجي ذكره</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">نوع المشاركة</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                  value={generalForm.type}
                  onChange={(e) => setGeneralForm({...generalForm, type: e.target.value})}
                >
                  <option>شكوى</option>
                  <option>اقتراح</option>
                  <option>اشادة</option>
                  <option>فكرة برمجية</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">الموضوع</label>
                <textarea 
                  rows="4" 
                  required
                  placeholder="اكتب تفاصيل مشاركتك هنا بكل دقة..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                  value={generalForm.subject}
                  onChange={(e) => setGeneralForm({...generalForm, subject: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all">
                <Send className="w-5 h-5" />
                <span>ساهم في تطوير المنصة</span>
              </button>
            </form>
          )}

          {/* B. قائمة تقييم الخدمات */}
          {activeTab === "services" && (
            <form onSubmit={(e) => handleSubmit(e, "service", serviceForm)} className="space-y-6">
              <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Star className="text-amber-400 w-5 h-5" /> تقييم الخدمات الهندسية والتقنية المتاحة
              </h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">اختر الخدمة التي حصلت عليها بالفعل</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                  value={serviceForm.service}
                  onChange={(e) => setServiceForm({...serviceForm, service: e.target.value})}
                >
                  {Array.isArray(services) && services.map((srv, idx) => (
                    <option key={idx} value={srv}>{srv}</option>
                  ))}
                </select>
              </div>

              {/* معايير النجوم المخصصة بدقة */}
              <div className="space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <label className="text-sm font-bold text-cyan-400 block mb-2">معايير التقييم الرقمية والمهنية:</label>
                {[
                  { key: "quality", label: "جودة التنفيذ الموائمة للاشتراطات الكودية والمهنية" },
                  { key: "timing", label: "الالتزام بالمواعيد المحددة والجدول الزمني للإنتاج" },
                  { key: "response", label: "سرعة الاستجابة الدورية والتواصل الفني الفعال" }
                ].map((criterion) => (
                  <div key={criterion.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 border-b border-slate-900 last:border-0">
                    <span className="text-sm text-slate-300">{criterion.label}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setServiceForm({...serviceForm, [criterion.key]: star})}
                          className={`p-1 transition-all ${star <= serviceForm[criterion.key] ? "text-amber-400 scale-110" : "text-slate-700 hover:text-slate-500"}`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">كيف يمكننا تحسين هذه الخدمة مستقبلاً؟</label>
                <textarea 
                  rows="3" 
                  placeholder="ملاحظاتك الفنية الدقيقة تدعم تحسين خوارزمياتنا وأدواتنا..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                  value={serviceForm.improvement}
                  onChange={(e) => setServiceForm({...serviceForm, improvement: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all">
                <Send className="w-5 h-5" />
                <span>ساهم في تطوير المنصة</span>
              </button>
            </form>
          )}

          {/* C. قائمة ركن المقترحات البرمجية */}
          {activeTab === "code" && (
            <form onSubmit={(e) => handleSubmit(e, "code", codeForm)} className="space-y-6">
              <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Code className="text-purple-400 w-5 h-5" /> ركن المقترحات البرمجية والأتمتة الذكية
              </h3>
              <div className="space-y-3">
                <label className="text-base font-medium text-slate-200 leading-relaxed block">
                  سؤال الفضاء الرقمي: "ما هي الأداة البرمجية أو السكريبت الذي تمنيت وجوده لتسهيل عملك الهندسي؟"
                </label>
                <textarea 
                  rows="5" 
                  required
                  placeholder="مثال: أداة لحساب تفريد الحديد التلقائي، سكريبت لربط تفاصيل الجدران الاستنادية بملفات إكسل، إلخ..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all resize-none font-mono"
                  value={codeForm.proposal}
                  onChange={(e) => setCodeForm({ proposal: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all">
                <Send className="w-5 h-5" />
                <span>ساهم في تطوير المنصة</span>
              </button>
            </form>
          )}

          {/* D. قائمة تقييم تجربة المستخدم */}
          {activeTab === "ux" && (
            <form onSubmit={(e) => handleSubmit(e, "ux", uxForm)} className="space-y-6">
              <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Smile className="text-emerald-400 w-5 h-5" /> تقييم تجربة المستخدم الرقمية (UX/UI)
              </h3>
              <div className="space-y-4">
                <label className="text-base font-medium text-slate-200">
                  سؤال الواجهة: "ما مدى سهولة استخدام الموقع والوصول للمعلومات؟"
                </label>
                
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "satisfied", icon: Smile, text: "راضي جداً", color: "text-emerald-400 bg-emerald-950/30 border-emerald-500/30" },
                    { id: "neutral", icon: Meh, text: "مقبول / متوسط", color: "text-amber-400 bg-amber-950/30 border-amber-500/30" },
                    { id: "unsatisfied", icon: Frown, text: "غير راضي / صعب", color: "text-rose-400 bg-rose-950/30 border-rose-500/30" }
                  ].map((face) => {
                    const FaceIcon = face.icon;
                    return (
                      <button
                        key={face.id}
                        type="button"
                        onClick={() => setUxForm({...uxForm, rating: face.id})}
                        className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all ${
                          uxForm.rating === face.id
                            ? `${face.color} scale-105 border-2 shadow-xl ring-2 ring-offset-2 ring-offset-slate-900 ring-slate-700`
                            : "border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <FaceIcon className="w-10 h-10 mb-2" />
                        <span className="text-sm font-medium">{face.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">إرفاق صورة للمشكلة أو الاقتراح الواجهي (Screenshot)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-xl cursor-pointer bg-slate-950 hover:bg-slate-900/60 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-slate-500 mb-2" />
                      <p className="text-sm text-slate-400 font-medium"> اضغط لرفع الملف أو الصورة الفنية</p>
                      {screenshotName && <p className="text-xs text-cyan-400 mt-2 font-mono">{screenshotName}</p>}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all">
                <Send className="w-5 h-5" />
                <span>ساهم في تطوير المنصة</span>
              </button>
            </form>
          )}

          {/* E. قسم قصص النجاح */}
          {activeTab === "success" && (
            <form onSubmit={(e) => handleSubmit(e, "success", successForm)} className="space-y-6">
              <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Award className="text-teal-400 w-5 h-5" /> لوحة ملهمي منصة الهندسة الذكية وقصص النجاح
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">الاسم <span className="text-xs text-slate-500">(اختياري)</span></label>
                  <input 
                    type="text" 
                    placeholder="المهندس / الشريك" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                    value={successForm.name}
                    onChange={(e) => setSuccessForm({...successForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">التخصص الهندسي</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                    value={successForm.specialty}
                    onChange={(e) => setSuccessForm({...successForm, specialty: e.target.value})}
                  >
                    <option>مهندس مدني</option>
                    <option>مهندس معماري</option>
                    <option>طالب</option>
                    <option>صاحب مشروع</option>
                    <option>اخر يرجي تحديدها</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">قصتك أو كلمتك المحفزة</label>
                <textarea 
                  rows="4" 
                  required
                  placeholder="اكتب كلمة شكر أو تجربتك الإيجابية المحفزة مع خدماتنا البرمجية والانشائية..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-all resize-none"
                  value={successForm.subject}
                  onChange={(e) => setSuccessForm({...successForm, subject: e.target.value})}
                ></textarea>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <input 
                  type="checkbox" 
                  id="allowPublish" 
                  className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
                  checked={successForm.allowPublish}
                  onChange={(e) => setSuccessForm({...successForm, allowPublish: e.target.checked})}
                />
                <label htmlFor="allowPublish" className="text-sm text-slate-300 cursor-pointer select-none">
                  هل تسمح لنا بنشر رأيك وقصتك الفنية في قسم آراء العملاء على الصفحة الرئيسية للمنصة؟
                </label>
              </div>

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all">
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