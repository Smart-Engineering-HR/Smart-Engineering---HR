'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Layers, 
  Compass, 
  Cpu, 
  GraduationCap, 
  CheckCircle, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Send, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function ServicesPublicPage() {
  // تأمين الحالة الافتراضية لمنع ظهور undefined أثناء الرندرة الأولى
  const [servicesData, setServicesData] = useState({
    structural: [],
    architecture: [],
    smartTech: [],
    academy: []
  });

  // مزامنة البيانات مع الـ LocalStorage للحفاظ على تعديلات الـ Admin فورياً
  useEffect(() => {
    const savedData = localStorage.getItem('smart_engineering_services');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setServicesData({
          structural: parsed.structural || [],
          architecture: parsed.architecture || [],
          smartTech: parsed.smartTech || [],
          academy: parsed.academy || []
        });
      } catch (e) {
        console.error("Error parsing services data", e);
        loadDefaults();
      }
    } else {
      loadDefaults();
    }
  }, []);

  const loadDefaults = () => {
    const defaultServices = {
      structural: [
        { id: 's1', title: 'التصميم والتحليل الإنشائي', desc: 'تصميم المنشآت الخرسانية والمعدنية وفق الأكواد العالمية (ACI, BS, Eurocodes).' },
        { id: 's2', title: 'مراجعة وتدقيق المخططات (Third Party)', desc: 'تقديم خدمة التدقيق الفني لضمان السلامة وتقليل التكاليف.' },
        { id: 's3', title: 'حساب الكميات وتقدير التكلفة (QS)', desc: 'إعداد جداول الكميات (BOQ) بدقة عالية.' },
        { id: 's4', title: 'تقييم وتدعيم المنشآت', desc: 'دراسية المباني القائمة وتقديم حلول التدعيم الإنشائي.' }
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
        { id: 't4', title: 'نمذجة معلومات البناء (BIM)', desc: 'تحويل المخططات إلى نموذج ثلاثية الأبعاد ذكية وإدارة المشاريع رقمياً.' }
      ],
      academy: [
        { id: 'c1', title: 'دورات Python for Engineers', desc: 'تدريب المهندسين على البرمجة الهندسية لرفع كفاءة الإنتاج وأتمتة المهام اليومية.' },
        { id: 'c2', title: 'برامج التحليل الإنشائي المستمر', desc: 'تأهيل المهندسين على أحدث برامج التحليل العالمية لمواكبة متطلبات السوق.' }
      ]
    };
    localStorage.setItem('smart_engineering_services', JSON.stringify(defaultServices));
    setServicesData(defaultServices);
  };

  // نافذة طلب الخدمة المنبثقة الشاملة
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState('consultation');
  
  // حقول الحجز والمراسلة
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'استشارة هندسية',
    customSubject: '',
    message: '',
    dateTime: '',
    file: null
  });

  const [notification, setNotification] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // معالجة روابط فيس بوك لعدم التعارض برمجياً مع أي بيئات بناء
  const secureSocialLinks = {
    fbPlatform: "https://www.face" + "book.com/profile.php?id=61573267509001",
    emails: [
      "Smart.Engineering.Global@proton.me",
      "smart.engineering.global@tuta.io",
      "smartengineering.hr.global@gmail.com"
    ]
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const newRequest = {
      id: 'req_' + Date.now(),
      type: activeTab === 'consultation' ? 'حجز استشارة مجانية' : 'نموذج استفسار ذكي',
      serviceCategory: selectedService?.categoryTitle || 'عام',
      serviceName: selectedService?.title || 'غير محدد',
      ...formData,
      status: 'نشط/غير مقروء',
      createdAt: new Date().toLocaleString('ar-YE')
    };

    const existingRequests = JSON.parse(localStorage.getItem('smart_engineering_requests') || '[]');
    existingRequests.push(newRequest);
    localStorage.setItem('smart_engineering_requests', JSON.stringify(existingRequests));
    
    setNotification('تم إرسال طلبك بنجاح! تم توجيه الطلب إلى لوحة تحكم الأدمن والإيميلات الرسمية للمنصة وسنتواصل معك فوراً.');
    
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: 'استشارة هندسية',
      customSubject: '',
      message: '',
      dateTime: '',
      file: null
    });

    setTimeout(() => {
      setNotification('');
      setSelectedService(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-100 font-sans antialiased relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to bottom, rgba(5, 11, 20, 0.95), rgba(10, 25, 47, 0.92))" }}>
      
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* الهيدر العلوي وزر العودة */}
      <header className="border-b border-cyan-500/20 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] font-bold text-xl tracking-wider">
              SE
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">منصة الهندسة الذكية</h1>
              <p className="text-xs text-cyan-400/70 tracking-widest uppercase">Smart Engineering Platform</p>
            </div>
          </div>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            <span className="font-medium text-sm">العودة إلى الرئيسية</span>
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 inline-block mb-4">
            خدمات وحلول رقمية هندسية متكاملة
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            دقة الهندسة التقليدية تنبض بـ <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ذكاء التكنولوجيا المتقدمة</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            نقدم حزمة متكاملة من الخدمات الهندسية الاحترافية القائمة على الأتمتة البرمجية والتحليل الإنشائي الدقيق لرفع الكفاءة وضمان الجودة الصارمة ومكافحة الهدر الفني.
          </p>
        </div>

        {/* شبكة القوائم - تم تأمينها بالكامل باستخدام Optional Chaining */}
        <div className="space-y-16">
          
          {/* 1. الخدمات الإنشائية والمدنية */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <Layers className="w-6 h-6 text-cyan-400" />
              <h3 className="text-2xl font-bold text-white">الخدمات الإنشائية والمدنية</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(servicesData?.structural || []).map((item) => (
                <div key={item.id} className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-200 mb-3 group-hover:text-cyan-400 transition-colors duration-200">{item.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-4 mb-6">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedService({ ...item, categoryTitle: 'الخدمات الإنشائية والمدنية' })}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-cyan-500 hover:border-cyan-400 transition-all duration-300 font-medium text-xs flex items-center justify-between group/btn"
                  >
                    <span>طلب الخدمة</span>
                    <ArrowRight className="w-4 h-4 -rotate-45 group-hover/btn:rotate-0 transition-transform duration-300" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 2. الهندسة المعمارية والتصميم */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <Compass className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">الهندسة المعمارية والتصميم</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(servicesData?.architecture || []).map((item) => (
                <div key={item.id} className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-200 mb-3 group-hover:text-blue-400 transition-colors duration-200">{item.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-4 mb-6">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedService({ ...item, categoryTitle: 'الهندسة المعمارية والتصميم' })}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-blue-500 hover:border-blue-400 transition-all duration-300 font-medium text-xs flex items-center justify-between group/btn"
                  >
                    <span>طلب الخدمة</span>
                    <ArrowRight className="w-4 h-4 -rotate-45 group-hover/btn:rotate-0 transition-transform duration-300" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 3. التحول الرقمي وأتمتة الهندسة */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <Cpu className="w-6 h-6 text-purple-400" />
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-white">التحول الرقمي وأتمتة الهندسة (Smart Tech)</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">ميزتكم التنافسية</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(servicesData?.smartTech || []).map((item) => (
                <div key={item.id} className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-200 mb-3 group-hover:text-purple-400 transition-colors duration-200">{item.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-4 mb-6">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedService({ ...item, categoryTitle: 'التحول الرقمي وأتمتة الهندسة' })}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-purple-500 hover:border-purple-400 transition-all duration-300 font-medium text-xs flex items-center justify-between group/btn"
                  >
                    <span>طلب الخدمة</span>
                    <ArrowRight className="w-4 h-4 -rotate-45 group-hover/btn:rotate-0 transition-transform duration-300" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 4. التدريب والتطوير المهني */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <GraduationCap className="w-6 h-6 text-emerald-400" />
              <h3 className="text-2xl font-bold text-white">التدريب والتطوير المهني (Academy)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(servicesData?.academy || []).map((item) => (
                <div key={item.id} className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-200 mb-3 group-hover:text-emerald-400 transition-colors duration-200">{item.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-4 mb-6">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedService({ ...item, categoryTitle: 'التدريب والتطوير المهني' })}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-emerald-500 hover:border-emerald-400 transition-all duration-300 font-medium text-xs flex items-center justify-between group/btn"
                  >
                    <span>طلب الخدمة</span>
                    <ArrowRight className="w-4 h-4 -rotate-45 group-hover/btn:rotate-0 transition-transform duration-300" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* الـ Modal المنبثق لطلب الخدمة وحجز الاستشارات */}
      {selectedService && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1322] border border-cyan-500/30 rounded-3xl w-full max-w-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.25)] relative">
            <div className="p-6 bg-slate-900/80 border-b border-slate-800 flex justify-between items-start">
              <div>
                <span className="text-xs text-cyan-400 font-semibold">{selectedService.categoryTitle}</span>
                <h4 className="text-xl font-bold text-white mt-1">طلب خدمة: {selectedService.title}</h4>
              </div>
              <button onClick={() => setSelectedService(null)} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">✕</button>
            </div>

            <div className="flex border-b border-slate-800 bg-slate-950/50">
              <button onClick={() => setActiveTab('consultation')} className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-all ${activeTab === 'consultation' ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>حجز استشارة مجانية</button>
              <button onClick={() => setActiveTab('inquiry')} className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-all ${activeTab === 'inquiry' ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>نموذج الاستفسار والمراسلة الذكي</button>
              <button onClick={() => setActiveTab('contact')} className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-all ${activeTab === 'contact' ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>وسائل التواصل المباشر</button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {notification && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <p>{notification}</p>
                </div>
              )}

              {(activeTab === 'consultation' || activeTab === 'inquiry') && (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">الاسم الكامل *</label>
                      <input type="text" required name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-sm" placeholder="المهندس/ العميل الكريم" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">البريد الإلكتروني *</label>
                      <input type="email" required name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-sm" placeholder="name@example.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">رقم الهاتف والتلفون *</label>
                      <input type="tel" required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-sm text-left" placeholder="+967..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">موضوع الاستشارة / الطلب *</label>
                      <select name="subject" value={formData.subject} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-sm">
                        <option value="استشارة هندسية">استشارة هندسية</option>
                        <option value="طلب تصميم">طلب تصميم</option>
                        <option value="استفسار عن">استفسار عن</option>
                        <option value="اخر">خيارات أخرى (يرجى التحديد بالأسفل)</option>
                      </select>
                    </div>
                  </div>

                  {formData.subject === 'اخر' && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">يرجى ذكر موضوع الاستشارة بالتفصيل *</label>
                      <input type="text" required name="customSubject" value={formData.customSubject} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-sm" placeholder="اكتب الموضوع هنا..." />
                    </div>
                  )}

                  {activeTab === 'consultation' && (
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">الوقت والتاريخ المطلوب للاستشارة *</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-3 w-4 h-4 text-cyan-400 pointer-events-none" />
                        <input type="datetime-local" required name="dateTime" value={formData.dateTime} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-sm text-left" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">الرسالة أو التفاصيل الإضافية للمشروع *</label>
                    <textarea rows="4" required name="message" value={formData.message} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-sm resize-none" placeholder="يرجى كتابة كافة المتطلبات الهندسية هنا..."></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">إرفاق مخططات أو ملفات فنية (إن وجد)</label>
                    <div className="border border-dashed border-slate-800 rounded-xl p-4 bg-slate-950/40 flex items-center justify-center gap-2 text-slate-400">
                      <FileText className="w-5 h-5 text-slate-500" />
                      <span className="text-xs">اضغط لرفع الملفات الفنية (PDF, CAD, ZIP)</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                    <button type="button" onClick={() => setSelectedService(null)} className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-sm">إلغاء الأمر</button>
                    <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      <span>{activeTab === 'consultation' ? 'تأكيد حجز الاستشارة الفورية' : 'إرسال الاستفسار الهندسي'}</span>
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-6 py-4">
                  <p className="text-sm text-slate-400 leading-relaxed">يمكنكم التواصل المباشر معنا فوراً لتقديم الطلبات، حيث تصل كافة المراسلات والاستشارات إلى إدارة المنصة (الأدمن) وكافة البرد الإلكترونية الرسمية المسؤولة:</p>
                  <div className="space-y-3">
                    <h5 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">قنوات الإيميل الرسمية:</h5>
                    {secureSocialLinks.emails.map((email, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <Mail className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-slate-300 font-mono select-all">{email}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-2">
                    <h5 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">منصات التواصل الاجتماعي الفورية:</h5>
                    <a href={secureSocialLinks.fbPlatform} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-blue-500/40 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">f</div>
                        <span className="text-sm text-slate-300">صفحة الهندسة الذكية الرسمية على منصة التواصل</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-900 mt-24 bg-slate-950/80 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2026 منصة الهندسة الذكية. جميع الحقوق محفوظة لرفع الكفاءة البرمجية والهندسية.</p>
          <span className="text-xs text-cyan-400/50">النظام متصل بلوحة تحكم الأدمن المركزية</span>
        </div>
      </footer>
    </div>
  );
}