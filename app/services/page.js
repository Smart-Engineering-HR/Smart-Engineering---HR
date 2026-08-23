'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Layers, 
  Compass, 
  Cpu, 
  GraduationCap, 
  CheckCircle, 
  Mail, 
  Calendar, 
  Send, 
  ExternalLink,
  Sparkles,
  X,
  Loader2
} from 'lucide-react';

export default function ServicesPublicPage() {
  const [servicesData, setServicesData] = useState({
    structural: [],
    architecture: [],
    smartTech: [],
    academy: []
  });
  const [loading, setLoading] = useState(true);

  // جلب البيانات مع إزالة الشرط الخاطئ > 1
  const fetchServicesFromAPI = async () => {
    try {
      const res = await fetch('/api/services', { cache: 'no-store' });
      const result = await res.json();
      
      let fetchedData = result.data;
      const cached = localStorage.getItem('smart_engineering_services_cache');

      if (fetchedData && typeof fetchedData === 'object' && ('structural' in fetchedData)) {
        setServicesData(fetchedData);
        localStorage.setItem('smart_engineering_services_cache', JSON.stringify(fetchedData));
      } else if (cached) {
        setServicesData(JSON.parse(cached));
      }
    } catch (e) {
      console.error("Error fetching services:", e);
      const cached = localStorage.getItem('smart_engineering_services_cache');
      if (cached) {
        setServicesData(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesFromAPI();
  }, []);

  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState('consultation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'استشارة هندسية',
    customSubject: '',
    message: '',
    dateTime: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const officialContacts = {
    fb: "https://www.facebook.com/profile.php?id=61573267509001",
    emails: [
      "Smart.Engineering.Global@proton.me",
      "smart.engineering.global@tuta.io",
      "smartengineering.hr.global@gmail.com"
    ]
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const requestPayload = {
      id: 'req_' + Date.now(),
      type: activeTab === 'consultation' ? 'حجز استشارة مجانية' : 'نموذج استفسار ومراسلة ذكي',
      serviceCategory: selectedService?.categoryTitle || 'عام',
      serviceName: selectedService?.title || 'غير محدد',
      ...formData,
      status: 'جديد/غير مقروء',
      createdAt: new Date().toLocaleString('ar-YE')
    };

    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SUBMIT_REQUEST', requestData: requestPayload })
      });

      setNotification('تم إرسال طلبك بنجاح! تم توجيه الطلب إلى لوحة تحكم الأدمن والإيميلات الرسمية للمنصة.');
      
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: 'استشارة هندسية',
        customSubject: '',
        message: '',
        dateTime: ''
      });

      setTimeout(() => {
        setNotification('');
        setSelectedService(null);
      }, 3500);

    } catch (err) {
      console.error("Error submitting request:", err);
      setNotification('حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased relative overflow-hidden dir-rtl">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none"></div>

      <header className="border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              SE
            </div>
            <div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">منصة الهندسة الذكية والموارد البشرية</h1>
              <p className="text-[10px] text-cyan-400/80 tracking-widest uppercase font-semibold">Smart Engineering Platform</p>
            </div>
          </div>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            <span className="font-medium text-xs sm:text-sm">العودة للرئيسية</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 inline-flex items-center gap-2 shadow-[0_0_10px_rgba(34,211,238,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>قائمة خدماتنا الهندسية الذكية المعتمدة</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            حلول هندسية متطورة تجمع بين <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">الدقة والأتمتة البرمجية</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            استكشف باقة الخدمات المحدثة مباشرة. اضغط على أي خدمة لطلب الاستشارة الفورية أو المراسلة.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-cyan-400 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-sm font-semibold">جاري تحميل باقة الخدمات الحقيقية...</p>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* 1. الإنشائية والمدنية */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  1. الخدمات الإنشائية والمدنية ({servicesData?.structural?.length || 0})
                </h3>
              </div>
              
              {servicesData?.structural?.length === 0 ? (
                <p className="text-xs text-slate-500 italic">لا توجد خدمات مضافة في هذا القسم حالياً.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicesData?.structural?.map((item) => (
                    <div key={item.id} className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] flex flex-col justify-between backdrop-blur-md">
                      <div>
                        <h4 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-cyan-400 transition-colors duration-200">{item.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedService({ ...item, categoryTitle: 'الخدمات الإنشائية والمدنية' })}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-slate-950 hover:bg-cyan-400 hover:border-cyan-400 transition-all duration-300 font-bold text-xs flex items-center justify-between group/btn"
                      >
                        <span>طلب الخدمة</span>
                        <ArrowRight className="w-4 h-4 -rotate-45 group-hover/btn:rotate-0 transition-transform duration-300" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 2. المعمارية والتصميم */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  2. الهندسة المعمارية والتصميم ({servicesData?.architecture?.length || 0})
                </h3>
              </div>
              
              {servicesData?.architecture?.length === 0 ? (
                <p className="text-xs text-slate-500 italic">لا توجد خدمات مضافة في هذا القسم حالياً.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicesData?.architecture?.map((item) => (
                    <div key={item.id} className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] flex flex-col justify-between backdrop-blur-md">
                      <div>
                        <h4 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-blue-400 transition-colors duration-200">{item.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedService({ ...item, categoryTitle: 'الهندسة المعمارية والتصميم' })}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-slate-950 hover:bg-blue-400 hover:border-blue-400 transition-all duration-300 font-bold text-xs flex items-center justify-between group/btn"
                      >
                        <span>طلب الخدمة</span>
                        <ArrowRight className="w-4 h-4 -rotate-45 group-hover/btn:rotate-0 transition-transform duration-300" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 3. Smart Tech */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  3. التحول الرقمي وأتمتة الهندسة Smart Tech ({servicesData?.smartTech?.length || 0})
                </h3>
              </div>
              
              {servicesData?.smartTech?.length === 0 ? (
                <p className="text-xs text-slate-500 italic">لا توجد خدمات مضافة في هذا القسم حالياً.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicesData?.smartTech?.map((item) => (
                    <div key={item.id} className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] flex flex-col justify-between backdrop-blur-md">
                      <div>
                        <h4 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-purple-400 transition-colors duration-200">{item.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedService({ ...item, categoryTitle: 'التحول الرقمي وأتمتة الهندسة' })}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-slate-950 hover:bg-purple-400 hover:border-purple-400 transition-all duration-300 font-bold text-xs flex items-center justify-between group/btn"
                      >
                        <span>طلب الخدمة</span>
                        <ArrowRight className="w-4 h-4 -rotate-45 group-hover/btn:rotate-0 transition-transform duration-300" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 4. Academy */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  4. التدريب والتطوير المهني Academy ({servicesData?.academy?.length || 0})
                </h3>
              </div>
              
              {servicesData?.academy?.length === 0 ? (
                <p className="text-xs text-slate-500 italic">لا توجد خدمات مضافة في هذا القسم حالياً.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicesData?.academy?.map((item) => (
                    <div key={item.id} className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] flex flex-col justify-between backdrop-blur-md">
                      <div>
                        <h4 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-emerald-400 transition-colors duration-200">{item.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedService({ ...item, categoryTitle: 'التدريب والتطوير المهني' })}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-slate-950 hover:bg-emerald-400 hover:border-emerald-400 transition-all duration-300 font-bold text-xs flex items-center justify-between group/btn"
                      >
                        <span>طلب الخدمة</span>
                        <ArrowRight className="w-4 h-4 -rotate-45 group-hover/btn:rotate-0 transition-transform duration-300" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        )}
      </main>

      {/* نافذة طلب الخدمة */}
      {selectedService && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-cyan-500/40 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.25)] relative my-8">
            
            <div className="p-6 bg-slate-900/90 border-b border-slate-800 flex justify-between items-start">
              <div>
                <span className="text-[11px] text-cyan-400 font-bold tracking-wider uppercase">{selectedService.categoryTitle}</span>
                <h4 className="text-xl font-bold text-white mt-1">طلب خدمة: {selectedService.title}</h4>
              </div>
              <button 
                onClick={() => setSelectedService(null)} 
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-slate-800 bg-slate-950/60">
              <button 
                onClick={() => setActiveTab('consultation')} 
                className={`flex-1 py-3.5 text-center text-xs sm:text-sm font-bold border-b-2 transition-all ${activeTab === 'consultation' ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                حجز استشارة مجانية
              </button>
              <button 
                onClick={() => setActiveTab('inquiry')} 
                className={`flex-1 py-3.5 text-center text-xs sm:text-sm font-bold border-b-2 transition-all ${activeTab === 'inquiry' ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                نموذج الاستفسار الذكي
              </button>
              <button 
                onClick={() => setActiveTab('contact')} 
                className={`flex-1 py-3.5 text-center text-xs sm:text-sm font-bold border-b-2 transition-all ${activeTab === 'contact' ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                وسائل التواصل المباشر
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {notification && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-xs sm:text-sm">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <p className="font-semibold">{notification}</p>
                </div>
              )}

              {(activeTab === 'consultation' || activeTab === 'inquiry') && (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">الاسم الكامل *</label>
                      <input 
                        type="text" required name="fullName" value={formData.fullName} onChange={handleInputChange} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs sm:text-sm transition-colors" 
                        placeholder="المهندس / العميل المحترم" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">البريد الإلكتروني *</label>
                      <input 
                        type="email" required name="email" value={formData.email} onChange={handleInputChange} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs sm:text-sm transition-colors" 
                        placeholder="example@domain.com" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">رقم الهاتف / واتساب *</label>
                      <input 
                        type="tel" required name="phone" value={formData.phone} onChange={handleInputChange} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs sm:text-sm text-left transition-colors" 
                        placeholder="+967..." 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">موضوع الاستشارة / الطلب *</label>
                      <select 
                        name="subject" value={formData.subject} onChange={handleInputChange} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs sm:text-sm transition-colors"
                      >
                        <option value="استشارة هندسية">استشارة هندسية</option>
                        <option value="طلب تصميم">طلب تصميم</option>
                        <option value="استفسار عن">استفسار عن</option>
                        <option value="اخر">اخر (يرجى ذكرها بالأسفل)</option>
                      </select>
                    </div>
                  </div>

                  {formData.subject === 'اخر' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">يرجى كتابة موضوع الاستشارة بالتفصيل *</label>
                      <input 
                        type="text" required name="customSubject" value={formData.customSubject} onChange={handleInputChange} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs sm:text-sm transition-colors" 
                        placeholder="حدد الموضوع هنا..." 
                      />
                    </div>
                  )}

                  {activeTab === 'consultation' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">الوقت والتاريخ المطلوب للاستشارة *</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-3 w-4 h-4 text-cyan-400 pointer-events-none" />
                        <input 
                          type="datetime-local" required name="dateTime" value={formData.dateTime} onChange={handleInputChange} 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs sm:text-sm text-left transition-colors" 
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">الرسالة أو التفاصيل الإضافية *</label>
                    <textarea 
                      rows="4" required name="message" value={formData.message} onChange={handleInputChange} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs sm:text-sm resize-none transition-colors" 
                      placeholder="اكتب متطلباتك الهندسية بالتفصيل هنا..."
                    ></textarea>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                    <button 
                      type="button" onClick={() => setSelectedService(null)} 
                      className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-all"
                    >
                      إلغاء
                    </button>
                    <button 
                      type="submit" disabled={isSubmitting} 
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'جارِ الإرسال...' : activeTab === 'consultation' ? 'تأكيد حجز الاستشارة' : 'إرسال الاستفسار'}</span>
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-6 py-2">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    تصل كافة الاستشارات والطلبات مباشرة إلى لوحة تحكم الأدمن والبريد الإلكتروني المعتمد للمنصة:
                  </p>
                  
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">الإيميلات الرسمية للمنصة:</h5>
                    {officialContacts.emails.map((email, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs sm:text-sm font-mono text-slate-200 select-all">
                        <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{email}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider">فيسبوك المنصة الرسمية:</h5>
                    <a 
                      href={officialContacts.fb} target="_blank" rel="noopener noreferrer" 
                      className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">f</div>
                        <span className="text-xs sm:text-sm text-slate-200">صفحة الهندسة الذكية على فيسبوك</span>
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

      <footer className="border-t border-slate-900 mt-20 bg-slate-950/80 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 منصة الهندسة الذكية والموارد البشرية. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}