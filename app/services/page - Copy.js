"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Layers, 
  Compass, 
  Cpu, 
  GraduationCap, 
  Send, 
  Calendar, 
  Mail, 
  Phone, 
  User, 
  FileText, 
  ChevronLeft,
  ExternalLink,
  CheckCircle2
} from "lucide-react";

export default function PublicServicesPage() {
  const [servicesData, setServicesData] = useState({
    structural: [
      { id: "s1", title: "التصميم والتحليل الإنشائي", desc: "تصميم المنشآت الخرسانية والمعدنية وفق الأكواد العالمية (ACI, BS, Eurocodes)." },
      { id: "s2", title: "مراجعة وتدقيق المخططات (Third Party)", desc: "تقديم خدمة التدقيق الفني لضمان السلامة وتقليل التكاليف الفائضة." },
      { id: "s3", title: "حساب الكميات وتقدير التكلفة (QS)", desc: "إعداد جداول الكميات (BOQ) الاحترافية بدقة هندسية عالية." },
      { id: "s4", title: "تقييم وتدعيم المنشآت", desc: "دراسة وتشخيص المباني القائمة وتقديم حلول التدعيم الإنشائي المبتكرة." }
    ],
    architectural: [
      { id: "a1", title: "التصميم المعماري الحديث", desc: "ابتكار تصاميم معمارية فريدة للفلل والمباني التجارية تركز على استغلال المساحات والإضاءة الطبيعية." },
      { id: "a2", title: "التصميم الداخلي والديكور", desc: "تجسيد الأفكار برؤية بصرية مجسمة فائقة الدقة عبر تقنية (3D Rendering)." },
      { id: "a3", title: "تنسيق المواقع (Landscape Design)", desc: "تصميم المساحات الخارجية والحدائق بشكل جمالي هندسي وعملي متكامل." }
    ],
    smartTech: [
      { id: "t1", title: "تطوير برمجيات الهندسة المخصصة", desc: "تصميم أدوات برمجية متطورة بلغات (Python و Flutter) لحل المشاكل الهندسة المعقدة." },
      { id: "t2", title: "أتمتة التصميم الإنشائي", desc: "تحويل الحسابات اليدوية المتكررة إلى سكربتات برمجية ذكية وسريعة للغاية." },
      { id: "t3", title: "تقليل الهالك (Waste Management)", desc: "تقديم حلول وخوارزميات رقمية متكاملة لتقليل فاقد حديد التسليح (Rebar Zero-Waste)." },
      { id: "t4", title: "نمذجة معلومات البناء (BIM)", desc: "تحويل المخططات التقليدية إلى نماذج ثلاثية الأبعاد ذكية وإدارة المشاريع رقمياً." }
    ],
    academy: [
      { id: "e1", title: "دورات Python for Engineers", desc: "تدريب المهندسين على البرمجة التطبيقية لرفع كفاءة الإنتاج وأتمتة المهام اليومية." },
      { id: "e2", title: "برامج التحليل الإنشائي المتقدمة", desc: "تأهيل وتدريب الكوادر الهندسية على أحدث برامج التحليل العالمية لمواكبة سوق العمل." }
    ]
  });

  // مزامنة البيانات مع لوحة تحكم الأدمن عبر localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("smart_engineering_services");
    if (savedData) {
      try {
        setServicesData(JSON.parse(savedData));
      } catch (e) {
        console.error("Error parsing local storage services data", e);
      }
    }
  }, []);

  // حالات التنقل والطلبات
  const [selectedService, setSelectedService] = useState(null);
  const [activeFormTab, setActiveFormTab] = useState("consultation"); // consultation أو inquiry
  const [successMessage, setSuccessMessage] = useState("");

  // حقول النماذج
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "استشارة هندسية",
    customSubject: "",
    message: "",
    date: "",
    file: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files[0].name }));
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    // إنشاء كائن الطلب لإرساله للأدمن وحفظه
    const newRequest = {
      id: "req_" + Date.now(),
      serviceType: selectedService?.title || "طلب عام",
      formType: activeFormTab === "consultation" ? "حجز استشارة مجانية" : "نموذج استفسار ذكي",
      ...formData,
      timestamp: new Date().toLocaleString("ar-YE"),
      status: "pending"
    };

    // حفظ الطلب في localStorage ليراه الأدمن
    const existingRequests = JSON.parse(localStorage.getItem("smart_engineering_requests") || "[]");
    existingRequests.push(newRequest);
    localStorage.setItem("smart_engineering_requests", JSON.stringify(existingRequests));

    // إرسال تنبيه محاكاة الإيميلات المحددة بالتعليمات
    console.log("تم إرسال الطلب بنجاح إلى الإيميلات المحددة للشركة:");
    console.log("- Smart.Engineering.Global@proton.me\n- smart.engineering.global@tuta.io\n- smartengineering.hr.global@gmail.com");

    setSuccessMessage(activeFormTab === "consultation" ? "تم إرسال طلب حجز الاستشارة المجانية بنجاح! تم إشعار المسؤولين وعبر البريد الإلكتروني." : "تم إرسال استفسارك الذكي بنجاح! سيتم التواصل معك قريباً.");
    
    // إعادة تعيين النموذج
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "استشارة هندسية",
      customSubject: "",
      message: "",
      date: "",
      file: null
    });

    setTimeout(() => {
      setSuccessMessage("");
      setSelectedService(null);
    }, 4000);
  };

  // مصفوفة تبسيط عرض الأقسام الأربعة للجمهور
  const categories = [
    { key: "structural", title: "الخدمات الإنشائية والمدنية", icon: <Layers className="w-6 h-6 text-cyan-400" /> },
    { key: "architectural", title: "الهندسة المعمارية والتصميم", icon: <Compass className="w-6 h-6 text-blue-400" /> },
    { key: "smartTech", title: "التحول الرقمي وأتمتة الهندسة (Smart Tech)", icon: <Cpu className="w-6 h-6 text-emerald-400" /> },
    { key: "academy", title: "التدريب والتطوير المهني (Academy)", icon: <GraduationCap className="w-6 h-6 text-purple-400" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-900 overflow-x-hidden relative">
      
      {/* خلفية تقنية مستقبلية مبهرة */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950/10 to-slate-950 -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 -z-10" />

      {/* شريط الملاحة العلوي المتناسق */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-row-reverse justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Cpu className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-l from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
              منصة الهندسة الذكية
            </span>
          </div>
          
          {/* زر العودة إلى الرئيسية المطلوبة في التعليمات */}
          <button 
            onClick={() => window.location.href = "/"}
            className="group flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-slate-300 hover:text-cyan-400 transition-all duration-300 shadow-sm"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span>العودة إلى الرئيسية</span>
          </button>
        </div>
      </header>

      {!selectedService ? (
        <main className="max-w-7xl mx-auto px-6 py-16">
          
          {/* عنوان الواجهة الرئيسي المعبر والفاخر */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4 tracking-wider uppercase">
              قائمة الخدمات الرسمية والمطورة
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              خدماتنا وأدواتنا الذكية تفتح لك <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
                آفاقاً هندسية رقمية غير مسبوقة
              </span>
            </h1>
            <p className="text-base text-slate-400 leading-relaxed">
              نطوع التقنيات المعاصرة والذكاء الاصطناعي لتقديم حلول إنشائية، معمارية، وبرمجية متكاملة تضمن تقليل التكاليف ومضاعفة كفاءة التصميم والأتمتة بنسبة قصوى.
            </p>
          </div>

          {/* استعراض الأقسام الأربعة على شكل كروت ذكية متناسقة */}
          <div className="space-y-20">
            {categories.map((cat) => (
              <div key={cat.key} className="space-y-8">
                <div className="flex flex-row-reverse items-center gap-3 border-r-4 border-cyan-500 pr-4">
                  {cat.icon}
                  <h2 className="text-2xl font-bold text-white">{cat.title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {servicesData[cat.key]?.map((service) => (
                    <div 
                      key={service.id}
                      className="group relative bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 transition-all duration-300 hover:bg-slate-900/90 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors duration-200 pl-4">
                            {service.title}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                          {service.desc}
                        </p>
                      </div>

                      <div className="flex justify-end pt-2 border-t border-slate-800/50">
                        <button
                          onClick={() => setSelectedService(service)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-l from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-900/20 transition-all duration-300 hover:scale-[1.02]"
                        >
                          <span>طلب الخدمة</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        /* صفحة تفاصيل طلب الخدمة الجديدة عند الضغط على الزر */
        <main className="max-w-4xl mx-auto px-6 py-12">
          
          <button 
            onClick={() => setSelectedService(null)}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium mb-8 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة الخدمات الرئيسية</span>
          </button>

          {/* لوحة تفاصيل طلب الخدمة المفتوحة */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400 tracking-wider block mb-2 uppercase">أنت تطلب الآن خدمة:</span>
              <h2 className="text-2xl font-black text-white">{selectedService.title}</h2>
              <p className="text-sm text-slate-400 mt-2">{selectedService.desc}</p>
            </div>

            {/* الألسنة العلوية للتبديل بين حجز الاستشارة أو المراسلة الذكية كما بالطلب */}
            <div className="grid grid-cols-2 bg-slate-950 border-b border-slate-800 p-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveFormTab("consultation")}
                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all text-center ${
                  activeFormTab === "consultation" 
                    ? "bg-slate-900 text-cyan-400 border border-slate-800 shadow-md" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                زر حجز استشارة مجانية
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab("inquiry")}
                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all text-center ${
                  activeFormTab === "inquiry" 
                    ? "bg-slate-900 text-cyan-400 border border-slate-800 shadow-md" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                نموذج الاستفسار والمراسلة الذكي
              </button>
            </div>

            <div className="p-8">
              {successMessage ? (
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">تم إرسال طلبك بنجاح!</h4>
                  <p className="text-sm text-slate-400">{successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  
                  {/* الحقول الأساسية المشتركة */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 block text-right">الاسم الكامل *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute top-3.5 right-4" />
                        <input 
                          type="text" 
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          placeholder="المهندس / العميل"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-11 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-right"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 block text-right">البريد الإلكتروني *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute top-3.5 right-4" />
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="name@domain.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-11 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-right"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 block text-right">رقم التلفون *</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute top-3.5 right-4" />
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="+967xxxxxxxxx"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-11 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-right"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 block text-right">موضوع الاستشارة / الاستفسار *</label>
                      <select 
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors text-right appearance-none"
                      >
                        <option value="استشارة هندسية">استشارة هندسية</option>
                        <option value="طلب تصميم">طلب تصميم</option>
                        <option value="استفسار عن">استفسار عن</option>
                        <option value="اخر">آخر (يرجى التحديد أدناه)</option>
                      </select>
                    </div>
                  </div>

                  {formData.subject === "اخر" && (
                    <div className="space-y-2 animate-fadeIn">
                      <label className="text-xs font-bold text-slate-300 block text-right">اذكر الموضوع البديل هنا *</label>
                      <input 
                        type="text" 
                        name="customSubject"
                        value={formData.customSubject}
                        onChange={handleInputChange}
                        required
                        placeholder="يرجى كتابة عنوان الموضوع بالتفصيل"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors text-right"
                      />
                    </div>
                  )}

                  {/* حقل وقت وتاريخ الاستشارة المطلوبة فقط في تبويب حجز الاستشارة المجانية */}
                  {activeFormTab === "consultation" && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 block text-right">الوقت والتاريخ المطلوب للاستشارة *</label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-500 absolute top-3.5 right-4" />
                        <input 
                          type="datetime-local" 
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-11 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors text-right"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block text-right">الرسالة أو تفاصيل الطلب الهندسي العميقة *</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="يرجى كتابة كافة التفاصيل الفنية، متطلبات الكود الإنشائي، أو طبيعة الاستفسار..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-right resize-none"
                    />
                  </div>

                  {/* حقل إرفاق الملف الإنشائي أو الفني المتاح كخيار */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block text-right">ارفاق ملف ان وجد (مخططات، حسابات، كراسة شروط)</label>
                    <div className="border border-dashed border-slate-800 rounded-xl p-4 bg-slate-950/50 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cyan-500/40 transition-colors relative">
                      <input 
                        type="file" 
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <FileText className="w-6 h-6 text-slate-500 mb-2" />
                      <span className="text-xs text-slate-400">
                        {formData.file ? `الملف المختار: ${formData.file}` : "اسحب وأفلت الملفات هنا أو اضغط للتصفح العشوائي"}
                      </span>
                    </div>
                  </div>

                  {/* أزرار الإرسال الفخمة التفاعلية حسب التبويب */}
                  {activeFormTab === "consultation" ? (
                    <button
                      type="submit"
                      className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-xl shadow-cyan-950/20 flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>زر تأكيد حجز الاستشارة المجانية الآن</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>زر ارسال الاستفسار الذكي</span>
                    </button>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* قوائم وسائل التواصل المطلوبة بشكل مستقل ومحصن برمجياً ضد أخطاء التعرف */}
          <div className="mt-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-200 text-right border-b border-slate-800 pb-2">قوائم وسائل التواصل وقنوات الاتصال الرسمية</h4>
            
            <div className="flex flex-col space-y-3">
              <a 
                href="https://www.facebook.com/profile.php?id=61573267509001" 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-row-reverse justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-850 hover:border-blue-500/40 transition-colors group"
              >
                <div className="flex flex-row-reverse items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                    FB
                  </div>
                  <span className="text-xs text-slate-300">صفحة منصة الهندسة الذكية الرسمية على شبكة التواصل الاجتماعي</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </a>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                <span className="text-xs font-semibold text-slate-400 block text-right">البريد الإلكتروني المعتمد للتحكم والاستقبال الفوري:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs font-mono text-cyan-400 text-center">
                  <span className="bg-slate-900 p-2 rounded-lg border border-slate-800 selection:bg-cyan-500">Smart.Engineering.Global@proton.me</span>
                  <span className="bg-slate-900 p-2 rounded-lg border border-slate-800 selection:bg-cyan-500">smart.engineering.global@tuta.io</span>
                  <span className="bg-slate-900 p-2 rounded-lg border border-slate-800 selection:bg-cyan-500">smartengineering.hr.global@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}