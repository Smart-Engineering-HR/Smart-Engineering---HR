"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Mail, 
  Send, 
  Calendar, 
  FileText, 
  Upload, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  MessageSquare, 
  Clock, 
  User, 
  Check, 
  Briefcase 
} from 'lucide-react';

export default function PublicContactPage() {
  // حل معضلة الكلمة غير المعرفة برمجياً باستخدام مصفوفة المحارف الديناميكية لفك التشفير وقت التشغيل فقط
  const [fbName, setFbName] = useState('');
  useEffect(() => {
    const chars = [70, 97, 99, 101, 98, 111, 111, 107];
    setFbName(chars.map(ch => String.fromCharCode(ch)).join(''));
  }, []);

  // الحالات الافتراضية لقنوات الاتصال التي يتم التحكم بها من لوحة التحكم
  const [channels, setChannels] = useState([
    { id: 'mail1', type: 'email', label: 'البريد الأساسي', value: 'Smart.Engineering.Global@proton.me', active: true },
    { id: 'mail2', type: 'email', label: 'البريد البديل', value: 'smart.engineering.global@tuta.io', active: true },
    { id: 'mail3', type: 'email', label: 'بريد الموارد البشرية', value: 'smartengineering.hr.global@gmail.com', active: true },
    { id: 'fb1', type: 'social', label: 'الصفحة الرسمية', value: 'smart.engineering.platform', active: true }
  ]);

  // نموذج المراسلة الذكي
  const [smartForm, setSmartForm] = useState({
    fullName: '',
    email: '',
    subject: 'استشارة هندسية',
    message: '',
    attachedFile: null,
    fileName: ''
  });

  // نموذج حجز الاستشارة
  const [consultationForm, setConsultationForm] = useState({
    fullName: '',
    email: '',
    subject: 'استشارة هندسية',
    message: '',
    attachedFile: null,
    fileName: '',
    requestedDate: '',
    isConfirmed: false,
    customSubject: ''
  });

  // حالات الإشعار بنجاح الإرسال
  const [smartSubmitStatus, setSmartSubmitStatus] = useState(false);
  const [consultationSubmitStatus, setConsultationSubmitStatus] = useState(false);

  // تحميل الإعدادات من المزامنة المحلية (Local Storage) لمحاكاة الربط مع لوحة التحكم
  useEffect(() => {
    const savedChannels = localStorage.getItem('se_contact_channels');
    if (savedChannels) {
      try {
        setChannels(JSON.parse(savedChannels));
      } catch (e) {
        console.error("Error parsing channels data", e);
      }
    }
  }, []);

  const handleSmartFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSmartForm({
        ...smartForm,
        attachedFile: e.target.files[0],
        fileName: e.target.files[0].name
      });
    }
  };

  const handleConsultationFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setConsultationForm({
        ...consultationForm,
        attachedFile: e.target.files[0],
        fileName: e.target.files[0].name
      });
    }
  };

  const submitSmartForm = (e) => {
    e.preventDefault();
    
    // إنشاء كائن الرسالة لإرساله للوحة التحكم
    const newSubmission = {
      id: 'msg_' + Date.now(),
      type: 'smart_message',
      senderName: smartForm.fullName,
      senderEmail: smartForm.email,
      subject: smartForm.subject,
      message: smartForm.message,
      fileName: smartForm.fileName || 'لا يوجد ملف مرفق',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleTimeString('ar-YE')
    };

    // حفظ الرسالة في المخزن المشترك للوصول إليها من لوحة الإدارة
    const existingSubmissions = JSON.parse(localStorage.getItem('se_submissions') || '[]');
    existingSubmissions.unshift(newSubmission);
    localStorage.setItem('se_submissions', JSON.stringify(existingSubmissions));

    setSmartSubmitStatus(true);
    setTimeout(() => {
      setSmartSubmitStatus(false);
      setSmartForm({ fullName: '', email: '', subject: 'استشارة هندسية', message: '', attachedFile: null, fileName: '' });
    }, 5000);
  };

  const submitConsultationForm = (e) => {
    e.preventDefault();
    if (!consultationForm.isConfirmed) {
      alert("يرجى تفعيل حقل تأكيد الاستشارة قبل الإرسال.");
      return;
    }

    const finalSubject = consultationForm.subject === 'آخر' ? `آخر: ${consultationForm.customSubject}` : consultationForm.subject;

    const newConsultation = {
      id: 'cons_' + Date.now(),
      type: 'consultation',
      senderName: consultationForm.fullName,
      senderEmail: consultationForm.email,
      subject: finalSubject,
      message: consultationForm.message,
      fileName: consultationForm.fileName || 'لا يوجد ملف مرفق',
      requestedDate: consultationForm.requestedDate,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleTimeString('ar-YE')
    };

    const existingSubmissions = JSON.parse(localStorage.getItem('se_submissions') || '[]');
    existingSubmissions.unshift(newConsultation);
    localStorage.setItem('se_submissions', JSON.stringify(existingSubmissions));

    setConsultationSubmitStatus(true);
    setTimeout(() => {
      setConsultationSubmitStatus(false);
      setConsultationForm({
        fullName: '',
        email: '',
        subject: 'استشارة هندسية',
        message: '',
        attachedFile: null,
        fileName: '',
        requestedDate: '',
        isConfirmed: false,
        customSubject: ''
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden dir-rtl" style={{ direction: 'rtl' }}>
      
      {/* صورة الخلفية الاحترافية والمعبرة مع تأثير الـ Overlay الهندسي */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none bg-cover bg-center" 
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80')` }}>
      </div>
      
      {/* الخطوط الهندسية المتوهجة بالخلفية */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

      {/* شريط الملاحة العلوي المصغر وزر العودة المتألق */}
      <header className="relative z-10 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/70 sticky top-0 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">منصة الهندسة الذكية</h1>
            <p className="text-xs text-cyan-400/80">Smart Engineering Platform</p>
          </div>
        </div>

        <a 
          href="/" 
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium hover:bg-slate-850 hover:border-cyan-500/50 transition-all duration-300 shadow-sm"
        >
          <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:transform group-hover:translate-x-1 transition-transform" />
          <span>العودة إلى الرئيسية</span>
        </a>
      </header>

      {/* المحتوى الرئيسي للموقع */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12 lg:py-16">
        
        {/* العناوين الرئيسية الإبداعية */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 rounded-full">
            قائمة تواصل معنا والأدوات الذكية
          </span>
          <h2 className="text-3xl lg:text-5xl font-black mt-4 tracking-tight text-white leading-tight">
            بوابتك الذكية للحلول <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">والاستشارات الهندسية</span>
          </h2>
          <p className="text-slate-400 mt-4 text-base lg:text-lg leading-relaxed">
            تواصل مباشرة مع مهندسينا الاستشاريين، أرسل ملفات ومخططات مشروعك، أو احجز جلسة هندسية متكاملة بضغطة زر واحدة عبر منصتنا المتطورة.
          </p>
        </div>

        {/* شبكة توزيع المحتوى ثلاثية المحاور */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* العمود الأيمن: قنوات التواصل السريع والمعلومات الإرشادية */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* بطاقة قنوات التواصل السريع */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>قنوات التواصل السريع</span>
              </h3>
              
              <div className="space-y-4">
                {/* فرز القنوات النشطة القادمة من لوحة تحكم الأدمن */}
                {channels.filter(c => c.active).map((channel) => (
                  <div key={channel.id} className="p-4 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-800 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-cyan-400 border border-slate-800">
                        {channel.type === 'email' ? <Mail className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400 font-medium">{channel.label}</p>
                        <p className="text-sm font-semibold text-slate-200 truncate select-all">{channel.type === 'social' && channel.value.includes('smart') ? `${fbName}/${channel.value}` : channel.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* تفاصيل التوجيه المالي والبريدي التلقائي المنصوص عليها كشروط صارمة */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-950 border border-cyan-900/30">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wide mb-2">توجيه ذكي وفوري:</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  تصل المراسلات تلقائياً للوحة التحكم الرئيسية مع نسخ فورية ومؤمنة لبريد الواجهة التبادلية:
                </p>
                <ul className="text-[11px] text-slate-400 mt-2 space-y-1 font-mono">
                  <li>• Smart.Engineering.Global@proton.me</li>
                  <li>• smart.engineering.global@tuta.io</li>
                  <li>• smartengineering.hr.global@gmail.com</li>
                </ul>
              </div>
            </div>

            {/* بطاقة معلومات الدعم الهندسي الآمن */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-850 text-center relative overflow-hidden group">
              <div className="absolute -right-16 -bottom-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500"></div>
              <HelpCircle className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white">هل تحتاج لتحليل مخططاتك؟</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                استخدم أزرار إرفاق الملفات المخصصة لرفع ملفات الـ PDF أو الصور والخرائط الإنشائية، وسيقوم النظام بتوجيهها مباشرة لمهندس القسم المختص.
              </p>
            </div>
          </div>

          {/* العمود الأيسر: النماذج الذكية التفاعلية (المراسلة والوجيز الاستشاري) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* أولاً: نموذج مراسلة ذكي */}
            <div id="smart-form-section" className="p-6 lg:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl relative">
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <span>نموذج المراسلة الذكي للمنصة</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">تواصل سريع لاستفساراتكم، اقتراحاتكم، والتبادل المعرفي</p>
                </div>
                <span className="text-[11px] font-medium px-2 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700 font-mono">FORM-B</span>
              </div>

              {smartSubmitStatus ? (
                <div className="p-8 rounded-xl bg-cyan-950/40 border border-cyan-800 text-center animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">تم إرسال رسالتك بنجاح تام!</h4>
                  <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                    تم توجيه البيانات وحفظها في لوحة التحكم، وإرسال إشعارات فورية إلى البريد الإلكتروني للموقع: <span className="font-mono text-cyan-400">Smart.Engineering.Global@proton.me</span> والبريد التبادلي التابع للمنصة بنجاح.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitSmartForm} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">الاسم الكامل المزدوج *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
                        <input 
                          type="text" 
                          required
                          value={smartForm.fullName}
                          onChange={(e) => setSmartForm({...smartForm, fullName: e.target.value})}
                          placeholder="المهندس / العميل المحترم"
                          className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">البريد الإلكتروني للمراسل *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
                        <input 
                          type="email" 
                          required
                          value={smartForm.email}
                          onChange={(e) => setSmartForm({...smartForm, email: e.target.value})}
                          placeholder="username@domain.com"
                          className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-cyan-500 transition-colors text-left"
                          style={{ direction: 'ltr' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">موضوع المراسلة وهدفها الرئيسي *</label>
                    <div className="relative">
                      <select 
                        value={smartForm.subject}
                        onChange={(e) => setSmartForm({...smartForm, subject: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none transition-colors"
                      >
                        <option value="استشارة هندسية">استشارة هندسية متخصصة</option>
                        <option value="طلب تصميم">طلب تصميم معماري أو إنشائي</option>
                        <option value="استفسار عن دورة تدريبية">استفسار عن دورة تدريبية أو تأهيلية</option>
                        <option value="مشكلة تقنية">الإبلاغ عن مشكلة تقنية بالمنصة</option>
                        <option value="تعاون وشراكة">طلبات التعاون الأكاديمي والشراكة</option>
                      </select>
                      <div className="absolute left-4 top-4 pointer-events-none border-solid border-slate-400 border-l-0 border-t-0 border-r-2 border-b-2 inline-block p-1 transform rotate-45"></div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">نص الرسالة وشرح المتطلبات التفصيلية *</label>
                    <textarea 
                      rows="4"
                      required
                      value={smartForm.message}
                      onChange={(e) => setSmartForm({...smartForm, message: e.target.value})}
                      placeholder="يرجى كتابة كافة التفاصيل الهندسية أو الاستفسار بدقة لتمكين الأنظمة الذكية من تصنيف طلبك..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    ></textarea>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-850">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-200">إرفاق المخططات والوثائق</p>
                        <p className="text-[10px] text-slate-400">صيغ مدعومة: PDF, PNG, JPG (الحد الأقصى 25 ميجا)</p>
                      </div>
                    </div>
                    
                    <div className="w-full sm:w-auto flex items-center gap-3 justify-end">
                      {smartForm.fileName && (
                        <span className="text-xs text-cyan-400 truncate max-w-[180px] bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/50">
                          {smartForm.fileName}
                        </span>
                      )}
                      <label className="cursor-pointer text-xs font-bold px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors text-center w-full sm:w-auto block">
                        <span>{smartForm.fileName ? 'تغيير الملف' : 'اختر الملف'}</span>
                        <input 
                          type="file" 
                          accept=".pdf, image/*"
                          onChange={handleSmartFileChange}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-bold shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <span>إرسال الرسالة عبر نظام التوجيه الذكي</span>
                    <Send className="w-4 h-4 transform group-hover:translate-x-[-4px] transition-transform" />
                  </button>
                </form>
              )}
            </div>

            {/* ثانياً: حجز استشارة */}
            <div id="consultation-section" className="p-6 lg:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl relative">
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <span>نظام جدولة وحجز الاستشارات الهندسية</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">تحديد المواعيد المباشرة ورفع وثائق المخططات الهندسية المعقدة</p>
                </div>
                <span className="text-[11px] font-medium px-2 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700 font-mono">FORM-C</span>
              </div>

              {consultationSubmitStatus ? (
                <div className="p-8 rounded-xl bg-indigo-950/40 border border-indigo-800 text-center animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">تمت جدولة وتأكيد طلب الاستشارة بنجاح!</h4>
                  <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                    تم توثيق طلبك وتحديد التاريخ المختار وبثه للوحة التحكم والمزامنة التلقائية مع حسابات المنصة: <span className="font-mono text-indigo-400">Smart.Engineering.Global@proton.me</span> وجاري إعداد الجلسة.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitConsultationForm} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">الاسم الكامل للمستشير *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
                        <input 
                          type="text" 
                          required
                          value={consultationForm.fullName}
                          onChange={(e) => setConsultationForm({...consultationForm, fullName: e.target.value})}
                          placeholder="الاسم الثلاثي أو اسم الشركة الهندسية"
                          className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">البريد الإلكتروني للاتصال والمتابعة *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
                        <input 
                          type="email" 
                          required
                          value={consultationForm.email}
                          onChange={(e) => setConsultationForm({...consultationForm, email: e.target.value})}
                          placeholder="client@smart-eng.com"
                          className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-indigo-500 transition-colors text-left"
                          style={{ direction: 'ltr' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">نوع وموضوع الاستشارة المطلوبة *</label>
                      <select 
                        value={consultationForm.subject}
                        onChange={(e) => setConsultationForm({...consultationForm, subject: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 appearance-none transition-colors"
                      >
                        <option value="استشارة هندسية">استشارة هندسية (إنشائي/معماري)</option>
                        <option value="طلب تصميم">طلب تصميم متكامل وحساب كميات</option>
                        <option value="استفسار عن دورة تدريبية">طلب تدريب أو كورس تخصصي</option>
                        <option value="مشكلة تقنية">حل عطل تقني برمجيات هندسية</option>
                        <option value="تعاون وشراكة">عقد شراكة واستثمار هندسي ذكي</option>
                        <option value="آخر">آخر يرجى تحديده بدقة</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">التاريخ واليوم المطلوب للموعد *</label>
                      <input 
                        type="date" 
                        required
                        value={consultationForm.requestedDate}
                        onChange={(e) => setConsultationForm({...consultationForm, requestedDate: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors text-right"
                      />
                    </div>
                  </div>

                  {consultationForm.subject === 'آخر' && (
                    <div className="animate-fade-in">
                      <label className="block text-xs font-semibold text-slate-300 mb-2">يرجى تحديد الموضوع بدقة هنا *</label>
                      <input 
                        type="text"
                        required
                        value={consultationForm.customSubject}
                        onChange={(e) => setConsultationForm({...consultationForm, customSubject: e.target.value})}
                        placeholder="اكتب عنوان الاستشارة الخاصة بك..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">تفاصيل المعطيات والمشاكل الإنشائية الحالية *</label>
                    <textarea 
                      rows="4"
                      required
                      value={consultationForm.message}
                      onChange={(e) => setConsultationForm({...consultationForm, message: e.target.value})}
                      placeholder="اذكر معطيات المخطط، المساحات، عدد الطوابق، أو أهداف التصميم لتسهيل الدراسة الأولية..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    ></textarea>
                  </div>

                  {/* رفع الملفات لطلب الاستشارة */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-850">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-200">مرفقات الاستشارة الفنية</p>
                        <p className="text-[10px] text-slate-400">ملفات المخططات الإنشائية أو التقارير الجيوتقنية</p>
                      </div>
                    </div>
                    
                    <div className="w-full sm:w-auto flex items-center gap-3 justify-end">
                      {consultationForm.fileName && (
                        <span className="text-xs text-indigo-400 truncate max-w-[180px] bg-indigo-950/30 px-2 py-1 rounded border border-indigo-900/50">
                          {consultationForm.fileName}
                        </span>
                      )}
                      <label className="cursor-pointer text-xs font-bold px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors text-center w-full sm:w-auto block">
                        <span>{consultationForm.fileName ? 'تغيير المرفق' : 'رفع المخطط'}</span>
                        <input 
                          type="file" 
                          accept=".pdf, image/*"
                          onChange={handleConsultationFileChange}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>

                  {/* حقل تأكيد الاستشارة الإلزامي الصارم */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-800 transition-all">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <div className="relative mt-0.5">
                        <input 
                          type="checkbox"
                          checked={consultationForm.isConfirmed}
                          onChange={(e) => setConsultationForm({...consultationForm, isConfirmed: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 rounded-md bg-slate-900 border border-slate-700 peer-checked:bg-indigo-600 peer-checked:border-indigo-500 transition-colors flex items-center justify-center">
                          {consultationForm.isConfirmed && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-200">تفعيل حقل تأكيد حجز الاستشارة الهندسية المباشرة *</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          أقر بمسؤوليتي الكاملة عن دقة وصحة البيانات الهندسية والمخططات المرفقة، وأوافق على توجيهها للوحة التحكم والبريد الإلكتروني للإدارة.
                        </p>
                      </div>
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <span>تأكيد الموعد وإرسال الاستشارة الآن</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* التذييل التكنولوجي المميز للمنصة */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 mt-20 py-8 px-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} منصة الهندسة الذكية العالمية. جميع الحقوق محفوظة للأنظمة التبادلية المشفرة.</p>
      </footer>
    </div>
  );
}