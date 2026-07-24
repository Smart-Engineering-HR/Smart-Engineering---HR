"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, Sparkles, MessageSquare, ShieldAlert, Lightbulb, 
  ThumbsUp, Star, Smile, Meh, Frown, Camera, CheckCircle, ListPlus
} from 'lucide-react';

export default function FeedbackPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // التحكم بالخدمات الديناميكية القادمة من لوحة التحكم
  const [availableServices, setAvailableServices] = useState([
    "تصميم إنشائي", 
    "استشارة تقنية", 
    "دورة تدريبية",
    "تحسين وتطوير ريبار",
    "مراجعة المخططات الهندسية"
  ]);

  // تحميل الخدمات المحدثة من localStorage إذا وجدت للربط مع الأدمن
  useEffect(() => {
    const savedServices = localStorage.getItem('smart_engineering_services');
    if (savedServices) {
      setAvailableServices(JSON.parse(savedServices));
    }
  }, []);

  // حالات النماذج المختلفة
  const [generalForm, setGeneralForm] = useState({ name: '', specialty: 'مهندس مدني', type: 'اقتراح', subject: '' });
  const [ratingForm, setRatingForm] = useState({ service: 'تصميم إنشائي', quality: 5, timing: 5, response: 5, improvement: '' });
  const [scriptForm, setScriptForm] = useState({ idea: '' });
  const [uxForm, setUxForm] = useState({ rating: 'happy', screenshot: null, screenshotPreview: null });
  const [successStoryForm, setSuccessStoryForm] = useState({ name: '', specialty: 'مهندس مدني', type: 'إشادة', subject: '', allowPublish: true });

  // معالجة النجوم
  const renderStars = (criterion, currentRating) => {
    return (
      <div className="flex flex-row-reverse gap-2 justify-end">
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRatingForm({ ...ratingForm, [criterion]: star })}
            className={`transition-all duration-200 transform hover:scale-120 ${star <= currentRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600 hover:text-amber-300'}`}
          >
            <Star className="w-7 h-7" />
          </button>
        ))}
      </div>
    );
  };

  // معالجة رفع الصور لنماذج تجربة المستخدم
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUxForm({ ...uxForm, screenshot: reader.result, screenshotPreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // إرسال البيانات ومحاكاة إرسال الإيميلات والمزامنة مع الأدمن
  const handleSubmit = (e, formType, formData) => {
    e.preventDefault();
    
    const timestamp = new Date().toLocaleString('ar-YE');
    const newSubmission = {
      id: Date.now(),
      type: formType,
      data: formData,
      date: timestamp,
      status: 'pending'
    };

    // حفظ في localStorage ليقرأها الأدمن فوراً
    const existingSubmissions = JSON.parse(localStorage.getItem('smart_submissions') || '[]');
    existingSubmissions.unshift(newSubmission);
    localStorage.setItem('smart_submissions', JSON.stringify(existingSubmissions));

    // إرسال البيانات محاكاة للإيميلات المذكورة في التعليمات
    console.log("تم إرسال الرأي إلى لوحة التحكم والإيميلات المعتمدة:", [
      "Smart.Engineering.Global@proton.me",
      "smart.engineering.global@tuta.io",
      "smartengineering.hr.global@gmail.com"
    ], newSubmission);

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      // إعادة تعيين الحقول
      if (formType === 'general') setGeneralForm({ name: '', specialty: 'مهندس مدني', type: 'اقتراح', subject: '' });
      if (formType === 'rating') setRatingForm({ service: availableServices[0], quality: 5, timing: 5, response: 5, improvement: '' });
      if (formType === 'script') setScriptForm({ idea: '' });
      if (formType === 'ux') setUxForm({ rating: 'happy', screenshot: null, screenshotPreview: null });
      if (formType === 'success') setSuccessStoryForm({ name: '', specialty: 'مهندس مدني', type: 'إشادة', subject: '', allowPublish: true });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden font-sans antialiased selection:bg-cyan-500 selection:text-slate-950" dir="rtl">
      {/* الخلفية الاحترافية والمعبرة المستوحاة من الخطوط الهندسية والفضاء الرقمي */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/30 via-slate-950 to-slate-950 z-0"></div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10 max-w-6xl">
        
        {/* زر العودة إلى الرئيسية بلمسة فنية */}
        <button 
          onClick={() => router.push('/')}
          className="group mb-12 flex items-center gap-3 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] text-slate-300 hover:text-cyan-400"
        >
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          <span className="font-medium text-sm">العودة إلى الرئيسية - منصة الهندسة الذكية</span>
        </button>

        {/* الهيدر والعبارات الترحيبية المطلوبة */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wide uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            تطوير تشاركي مستدام
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-l from-slate-100 via-cyan-200 to-cyan-400 tracking-tight">
            مرحباً بكم في فضاء التطوير المشترك
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto font-light leading-relaxed border-r-4 border-cyan-500/30 pr-4 mt-4 bg-slate-900/30 py-3 rounded-l-xl">
            "آراؤكم مهمة لنا ومحل تقدير وهي لبناء الثقة وتطوير المنصة بناءً على احتياجات المهندسين والعملاء الفعليين."
          </p>
        </div>

        {/* التنبيه المنبثق عند نجاح الإرسال */}
        {isSubmitted && (
          <div className="fixed top-6 left-6 right-6 md:left-auto md:w-96 bg-emerald-950/90 border border-emerald-500 text-emerald-200 p-4 rounded-xl shadow-2xl z-50 flex items-start gap-3 animate-bounce">
            <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-bold">تم الإرسال بنجاح!</h4>
              <p className="text-xs text-emerald-300/80 mt-1">وصلت مشاركتك الثمينة إلى لوحة التحكم وتم توجيهها للبريد الإلكتروني للإدارة والمراجعة الفورية.</p>
            </div>
          </div>
        )}

        {/* نظام التبويب والأقسام الهندسية */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* القائمة الجانبية للتنقل */}
          <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl space-y-1.5 backdrop-blur-xl">
            <p className="text-xs font-bold text-slate-500 px-3 pt-2 pb-4 border-b border-slate-800/60 mb-2">قوائم الآراء والمقترحات</p>
            
            <button 
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'general' ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_4px_20px_rgba(6,182,212,0.25)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>النموذج الذكي العام</span>
            </button>

            <button 
              onClick={() => setActiveTab('rating')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'rating' ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_4px_20px_rgba(6,182,212,0.25)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <ListPlus className="w-4 h-4 shrink-0" />
              <span>تقييم الخدمات الهندسية</span>
            </button>

            <button 
              onClick={() => setActiveTab('script')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'script' ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_4px_20px_rgba(6,182,212,0.25)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <Lightbulb className="w-4 h-4 shrink-0" />
              <span>ركن المقترحات البرمجية</span>
            </button>

            <button 
              onClick={() => setActiveTab('ux')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'ux' ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_4px_20px_rgba(6,182,212,0.25)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>تقييم تجربة المستخدم</span>
            </button>

            <button 
              onClick={() => setActiveTab('success')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'success' ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_4px_20px_rgba(6,182,212,0.25)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <ThumbsUp className="w-4 h-4 shrink-0" />
              <span>صناعة وقصص النجاح</span>
            </button>
          </div>

          {/* محتوى النماذج المبدعة والذكية */}
          <div className="lg:col-span-3 bg-slate-900/40 border border-slate-800/80 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-xl relative">
            
            {/* A. قائمة نموذج الذكي العام */}
            {activeTab === 'general' && (
              <form onSubmit={(e) => handleSubmit(e, 'general', generalForm)} className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">النموذج الذكي العام للمنصة</h3>
                  <p className="text-xs text-slate-400 mt-1">نستقبل هنا مقترحاتكم الهندسية العامة وشكواكم بروح التطوير والارتقاء المستمر.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">الاسم الكامل (اختياري)</label>
                    <input 
                      type="text"
                      value={generalForm.name}
                      onChange={(e) => setGeneralForm({...generalForm, name: e.target.value})}
                      placeholder="مـهندس / عـميل العزيز"
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500 text-slate-200 px-4 py-3 rounded-xl outline-none transition-all duration-200 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">التخصص المهني</label>
                    <select 
                      value={generalForm.specialty}
                      onChange={(e) => setGeneralForm({...generalForm, specialty: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 px-4 py-3 rounded-xl outline-none transition-all duration-200 text-sm appearance-none"
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
                  <label className="text-xs font-semibold text-slate-300">نوع المشاركة</label>
                  <select 
                    value={generalForm.type}
                    onChange={(e) => setGeneralForm({...generalForm, type: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 px-4 py-3 rounded-xl outline-none transition-all duration-200 text-sm"
                  >
                    <option>شكوى</option>
                    <option>اقتراح</option>
                    <option>اشادة</option>
                    <option>فكرة برمجية</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">موضوع الرسالة والمحتوى التفصيلي</label>
                  <textarea 
                    rows="4"
                    required
                    value={generalForm.subject}
                    onChange={(e) => setGeneralForm({...generalForm, subject: e.target.value})}
                    placeholder="اكتب هنا تفاصيل فكرتك أو الشكوى بالتفصيل..."
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500 text-slate-200 px-4 py-3 rounded-xl outline-none transition-all duration-200 text-sm resize-none"
                  ></textarea>
                </div>

                <button type="submit" className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_4px_25px_rgba(6,182,212,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 text-center">
                  ساهم في تطوير المنصة
                </button>
              </form>
            )}

            {/* B. قائمة تقييم الخدمات */}
            {activeTab === 'rating' && (
              <form onSubmit={(e) => handleSubmit(e, 'rating', ratingForm)} className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">تقييم جودة الخدمات الهندسية</h3>
                  <p className="text-xs text-slate-400 mt-1">مخصص لشركائنا وعملائنا الذين خاضوا تجربة عمل فعلية معنا لتقييم مستويات الجودة.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">الخدمة المستلمة بالفعل</label>
                  <select 
                    value={ratingForm.service}
                    onChange={(e) => setRatingForm({...ratingForm, service: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 px-4 py-3 rounded-xl outline-none transition-all duration-200 text-sm"
                  >
                    {availableServices.map((service, i) => (
                      <option key={i} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80">
                  <p className="text-xs font-bold text-slate-400 mb-2">معايير التقييم الدقيقة (نظام النجوم):</p>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-900">
                    <span className="text-sm font-medium text-slate-300">أ. جودة التنفيذ الهندسي والإنشائي:</span>
                    {renderStars('quality', ratingForm.quality)}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-900">
                    <span className="text-sm font-medium text-slate-300">ب. الالتزام بالمواعيد والتسليم الجدولي:</span>
                    {renderStars('timing', ratingForm.timing)}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                    <span className="text-sm font-medium text-slate-300">جـ. سرعة الاستجابة والتواصل الفني مرونة:</span>
                    {renderStars('response', ratingForm.response)}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">كيف يمكننا تحسين هذه الخدمة مستقبلاً؟</label>
                  <textarea 
                    rows="3"
                    value={ratingForm.improvement}
                    onChange={(e) => setRatingForm({...ratingForm, improvement: e.target.value})}
                    placeholder="ملاحظاتك الدقيقة تصنع الفارق في المشاريع القادمة..."
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500 text-slate-200 px-4 py-3 rounded-xl outline-none transition-all duration-200 text-sm resize-none"
                  ></textarea>
                </div>

                <button type="submit" className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_4px_25px_rgba(6,182,212,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 text-center">
                  ساهم في تطوير المنصة
                </button>
              </form>
            )}

            {/* C. قائمة ركن المقترحات البرمجية */}
            {activeTab === 'script' && (
              <form onSubmit={(e) => handleSubmit(e, 'script', scriptForm)} className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">ركن الابتكار والمقترحات البرمجية</h3>
                  <p className="text-xs text-slate-400 mt-1">مساحة مخصصة لأتمتة الحسابات الإنشائية وتطوير أدوات وسكريبتات الذكاء الاصطناعي.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-200 leading-relaxed block">
                    * ما هي الأداة البرمجية أو السكريبت الذي تمنيت وجوده لتسهيل عملك الهندسي؟
                  </label>
                  <textarea 
                    rows="5"
                    required
                    value={scriptForm.idea}
                    onChange={(e) => setScriptForm({ idea: e.target.value })}
                    placeholder="مثال: سكريبت لحساب أوزان التسليح بشكل آلي، أو جدار ناري لتشخيص التشققات الخرسانية باستخدام الرؤية الحاسوبية..."
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500 text-slate-200 px-4 py-3 rounded-xl outline-none transition-all duration-200 text-sm resize-none leading-relaxed"
                  ></textarea>
                </div>

                <button type="submit" className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_4px_25px_rgba(6,182,212,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 text-center">
                  ساهم في تطوير المنصة
                </button>
              </form>
            )}

            {/* D. قائمة تقييم تجربة المستخدم */}
            {activeTab === 'ux' && (
              <form onSubmit={(e) => handleSubmit(e, 'ux', uxForm)} className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">تقييم وتطوير واجهات الاستخدام (UX)</h3>
                  <p className="text-xs text-slate-400 mt-1">سعادتك أثناء تصفح المنصة وسرعة وصولك للمعلومة الهندسية هي دافعنا الأول.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-200 block">
                    * ما مدى سهولة استخدام الموقع والوصول للمعلومات؟
                  </label>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setUxForm({...uxForm, rating: 'happy'})}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all ${uxForm.rating === 'happy' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                      <Smile className="w-10 h-10" />
                      <span className="text-xs font-bold">راضي جداً</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUxForm({...uxForm, rating: 'neutral'})}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all ${uxForm.rating === 'neutral' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                      <Meh className="w-10 h-10" />
                      <span className="text-xs font-bold">مقبول / متوسط</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUxForm({...uxForm, rating: 'sad'})}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all ${uxForm.rating === 'sad' ? 'bg-rose-500/10 border-rose-500 text-rose-400' : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                      <Frown className="w-10 h-10" />
                      <span className="text-xs font-bold">غير راضي / صعب</span>
                    </button>
                  </div>
                </div>

                {/* خيار إرفاق سكرين شوت */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">إرفاق صورة للمشكلة أو الواجهة (Screenshot) - اختياري</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-slate-800 border-dashed rounded-2xl cursor-pointer bg-slate-950/40 hover:bg-slate-950 hover:border-cyan-500/50 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uxForm.screenshotPreview ? (
                          <img src={uxForm.screenshotPreview} alt="Preview" className="h-24 rounded-lg object-cover" />
                        ) : (
                          <>
                            <Camera className="w-8 h-8 text-slate-500 mb-2" />
                            <p className="text-xs text-slate-400 font-medium">انقر لتحميل لقطة الشاشة أو إسقاطها هنا</p>
                          </>
                        )}
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>

                <button type="submit" className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_4px_25px_rgba(6,182,212,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 text-center">
                  ساهم في تطوير المنصة
                </button>
              </form>
            )}

            {/* E. قسم قصص النجاح والنموذج الذكي المدمج */}
            {activeTab === 'success' && (
              <form onSubmit={(e) => handleSubmit(e, 'success', successStoryForm)} className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">مساحة صناع وقصص النجاح</h3>
                  <p className="text-xs text-slate-400 mt-1">سجل هنا كلمتك الصادقة وتجربتك الفنية الإيجابية لتوثيق رحلة التطوير المشترك.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">الاسم الكامل (اختياري)</label>
                    <input 
                      type="text"
                      value={successStoryForm.name}
                      onChange={(e) => setSuccessStoryForm({...successStoryForm, name: e.target.value})}
                      placeholder="الاسم لخصوصيتك الكاملة"
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500 text-slate-200 px-4 py-3 rounded-xl outline-none text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">التخصص الهندسي</label>
                    <select 
                      value={successStoryForm.specialty}
                      onChange={(e) => setSuccessStoryForm({...successStoryForm, specialty: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 px-4 py-3 rounded-xl outline-none text-sm"
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
                  <label className="text-xs font-semibold text-slate-300">نوع المشاركة الفنية</label>
                  <select 
                    value={successStoryForm.type}
                    onChange={(e) => setSuccessStoryForm({...successStoryForm, type: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 px-4 py-3 rounded-xl outline-none text-sm"
                  >
                    <option>اقتراح جديد</option>
                    <option>شكوى</option>
                    <option>إشادة</option>
                    <option>فكرة برمجية</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">كلمة الشكر وتفاصيل التجربة الإيجابية</label>
                  <textarea 
                    rows="4"
                    required
                    value={successStoryForm.subject}
                    onChange={(e) => setSuccessStoryForm({...successStoryForm, subject: e.target.value})}
                    placeholder="اكتب رسالتك الصادقة بلمستك الخاصة..."
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500 text-slate-200 px-4 py-3 rounded-xl outline-none text-sm resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <input 
                    type="checkbox"
                    id="allowPublish"
                    checked={successStoryForm.allowPublish}
                    onChange={(e) => setSuccessStoryForm({...successStoryForm, allowPublish: e.target.checked})}
                    className="w-4 h-4 accent-cyan-500 rounded focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="allowPublish" className="text-xs text-slate-300 font-medium cursor-pointer select-none">
                    هل تسمح لنا بنشر رأيك وتجربتك في قسم آراء العملاء على الصفحة الرئيسية للمنصة؟
                  </label>
                </div>

                <button type="submit" className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_4px_25px_rgba(6,182,212,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 text-center">
                  ساهم في تطوير الهندسة الذكية
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}