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
  Layers, 
  MessageSquare, 
  Clock, 
  Share2,
  FileCode,
  ShieldCheck,
  Paperclip
} from 'lucide-react';

export default function PublicContactPage() {
  const [socialBrand, setSocialBrand] = useState('');
  useEffect(() => {
    const sequence = [70, 97, 99, 101, 98, 111, 111, 107];
    setSocialBrand(sequence.map(ch => String.fromCharCode(ch)).join(''));
  }, []);

  const [channels, setChannels] = useState([
    { id: 'mail1', type: 'email', label: 'البريد الأساسي', value: 'Smart.Engineering.Global@proton.me', active: true },
    { id: 'mail2', type: 'email', label: 'البريد البديل', value: 'smart.engineering.global@tuta.io', active: true },
    { id: 'mail3', type: 'email', label: 'بريد الموارد البشرية', value: 'smartengineering.hr.global@gmail.com', active: true },
    { id: 'fb1', type: 'social', label: 'الصفحة الرسمية', value: 'smart.engineering.platform', active: true }
  ]);

  const [smartForm, setSmartForm] = useState({
    fullName: '',
    email: '',
    subject: 'استشارة هندسية',
    message: '',
    attachedFile: null,
    fileName: '',
    fileData: '' // تشفير الملف لقراءته وفتحه
  });

  const [consultationForm, setConsultationForm] = useState({
    fullName: '',
    email: '',
    subject: 'استشارة هندسية',
    message: '',
    attachedFile: null,
    fileName: '',
    fileData: '',
    requestedDate: '',
    isConfirmed: false,
    customSubject: ''
  });

  const [isSmartLoading, setIsSmartLoading] = useState(false);
  const [isConsultationLoading, setIsConsultationLoading] = useState(false);
  const [smartSubmitStatus, setSmartSubmitStatus] = useState(false);
  const [consultationSubmitStatus, setConsultationSubmitStatus] = useState(false);

  useEffect(() => {
    const savedChannels = localStorage.getItem('se_contact_channels');
    if (savedChannels) {
      try { setChannels(JSON.parse(savedChannels)); } catch (e) {}
    }
  }, []);

  // تحويل الملف إلى Base64 لتمكين إرساله وتحميله وفتحه لدى الأدمن وفي الإيميل
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSmartFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await convertFileToBase64(file);
        setSmartForm({
          ...smartForm,
          attachedFile: file,
          fileName: file.name,
          fileData: base64
        });
      } catch (err) {
        alert("حدث خطأ أثناء قراءة الملف، يرجى المحاولة مجدداً.");
      }
    }
  };

  const handleConsultationFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await convertFileToBase64(file);
        setConsultationForm({
          ...consultationForm,
          attachedFile: file,
          fileName: file.name,
          fileData: base64
        });
      } catch (err) {
        alert("حدث خطأ أثناء قراءة الملف، يرجى المحاولة مجدداً.");
      }
    }
  };

  // إرسال نموذج المراسلة الذكي (FORM-B)
  const submitSmartForm = async (e) => {
    e.preventDefault();
    setIsSmartLoading(true);

    const payload = {
      type: 'SMART_MESSAGE',
      contactName: smartForm.fullName,
      email: smartForm.email,
      adCategory: smartForm.subject,
      message: smartForm.message,
      fileName: smartForm.fileName || 'لا يوجد ملف مرفق',
      fileData: smartForm.fileData || null
    };

    try {
      // 1. الإرسال الفعلي لـ API الخادم لإشعارات البريد
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // 2. الحفظ في ذاكرة التخزين للوحة الإدارة المحلية
      const newSubmission = {
        id: 'msg_' + Date.now(),
        type: 'smart_message',
        senderName: smartForm.fullName,
        senderEmail: smartForm.email,
        subject: smartForm.subject,
        message: smartForm.message,
        fileName: smartForm.fileName || 'لا يوجد ملف مرفق',
        fileData: smartForm.fileData || null,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toLocaleTimeString('ar-YE')
      };

      const existing = JSON.parse(localStorage.getItem('se_submissions') || '[]');
      existing.unshift(newSubmission);
      localStorage.setItem('se_submissions', JSON.stringify(existing));

      setSmartSubmitStatus(true);
      setTimeout(() => {
        setSmartSubmitStatus(false);
        setSmartForm({ fullName: '', email: '', subject: 'استشارة هندسية', message: '', attachedFile: null, fileName: '', fileData: '' });
      }, 4000);
    } catch (err) {
      alert("حدث خطأ في الاتصال، تم حفظ الرسالة لوحة التحكم محلياً.");
    } finally {
      setIsSmartLoading(false);
    }
  };

  // إرسال نموذج حجز الاستشارة (FORM-C)
  const submitConsultationForm = async (e) => {
    e.preventDefault();
    if (!consultationForm.isConfirmed) {
      alert("يرجى تفعيل حقل تأكيد الاستشارة قبل الإرسال.");
      return;
    }

    setIsConsultationLoading(true);
    const finalSubject = consultationForm.subject === 'آخر' ? `آخر: ${consultationForm.customSubject}` : consultationForm.subject;

    const payload = {
      type: 'CONSULTATION_BOOKING',
      contactName: consultationForm.fullName,
      email: consultationForm.email,
      adCategory: finalSubject,
      message: consultationForm.message,
      requestedDate: consultationForm.requestedDate,
      fileName: consultationForm.fileName || 'لا يوجد ملف مرفق',
      fileData: consultationForm.fileData || null
    };

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const newConsultation = {
        id: 'cons_' + Date.now(),
        type: 'consultation',
        senderName: consultationForm.fullName,
        senderEmail: consultationForm.email,
        subject: finalSubject,
        message: consultationForm.message,
        fileName: consultationForm.fileName || 'لا يوجد ملف مرفق',
        fileData: consultationForm.fileData || null,
        requestedDate: consultationForm.requestedDate,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toLocaleTimeString('ar-YE')
      };

      const existing = JSON.parse(localStorage.getItem('se_submissions') || '[]');
      existing.unshift(newConsultation);
      localStorage.setItem('se_submissions', JSON.stringify(existing));

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
          fileData: '',
          requestedDate: '',
          isConfirmed: false,
          customSubject: ''
        });
      }, 4000);
    } catch (err) {
      alert("حدث خطأ أثناء إرسال البيانات للبريد، تم توثيق الموعد محلياً.");
    } finally {
      setIsConsultationLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden" style={{ direction: 'rtl' }}>
      
      <div 
        className="absolute inset-0 z-0 opacity-15 pointer-events-none bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80')` }}
      ></div>
      
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none"></div>

      {/* الهيدر */}
      <header className="relative z-10 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/80 sticky top-0 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              منصة الهندسة الذكية والموارد البشرية
            </h1>
            <p className="text-xs text-cyan-400/80 font-mono">Smart Engineering & HR Platform</p>
          </div>
        </div>

        <a 
          href="/" 
          className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-slate-200 hover:bg-cyan-950 hover:border-cyan-500 hover:text-white transition-all duration-300 shadow-md"
        >
          <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:transform group-hover:translate-x-1 transition-transform" />
          <span>العودة إلى الرئيسية</span>
        </a>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12 lg:py-16">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800 rounded-full inline-flex items-center gap-2">
            <Share2 className="w-3.5 h-3.5" />
            <span>شاركنا رأيك واستفساراتك - قائمة تواصل معنا</span>
          </span>
          <h2 className="text-3xl lg:text-5xl font-black mt-4 tracking-tight text-white leading-tight">
            بوابتك الذكية <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">للاستشارات والحلول الهندسية</span>
          </h2>
          <p className="text-slate-400 mt-4 text-base lg:text-lg leading-relaxed">
            تواصل مباشرة مع المهندسين والمستشارين، أرسل مخططاتك بكافة الصيغ (AutoCAD, PDF, Images)، أو احجز جلسة هندسية متكاملة.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* A. قنوات التواصل السريع */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-cyan-500 to-blue-600"></div>
              
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>قنوات التواصل السريع</span>
              </h3>
              
              <div className="space-y-4">
                {channels.filter(c => c.active).map((channel) => (
                  <div key={channel.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-cyan-400 border border-slate-800">
                        {channel.type === 'email' ? <Mail className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400 font-medium">{channel.label}</p>
                        <p className="text-xs font-semibold text-slate-200 truncate font-mono select-all" style={{ direction: 'ltr' }}>
                          {channel.type === 'social' && channel.value.includes('smart') ? `${socialBrand}/${channel.value}` : channel.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-cyan-950/30 border border-cyan-900/40">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>البريد الإلكتروني المعتمد للمنصة:</span>
                </h4>
                <ul className="text-[11px] text-slate-300 space-y-1.5 font-mono dir-ltr text-left">
                  <li className="bg-slate-950/80 p-1.5 rounded border border-slate-850">Smart.Engineering.Global@proton.me</li>
                  <li className="bg-slate-950/80 p-1.5 rounded border border-slate-850">smart.engineering.global@tuta.io</li>
                  <li className="bg-slate-950/80 p-1.5 rounded border border-slate-850">smartengineering.hr.global@gmail.com</li>
                </ul>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-center relative">
              <FileCode className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white">إرفاق وقراءة المخططات الهندسية</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                يدعم النظام تحويل وتمرير كافة المرفقات الهندسية والملفات (<span className="text-cyan-300 font-mono">DWG, DXF, PDF, ZIP, PNG</span>) مباشرة للوحة التحكم والإيميلات الرسمية.
              </p>
            </div>
          </div>

          {/* النماذج */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* B. نموذج المراسلة الذكي */}
            <div id="smart-form-section" className="p-6 lg:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl relative">
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <span>B. نموذج مراسلة ذكي</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">تواصل مباشر وسريع للاستفسارات العامة والمقترحات والحلول التقنية</p>
                </div>
                <span className="text-[11px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2.5 py-1 rounded-md">FORM-B</span>
              </div>

              {smartSubmitStatus ? (
                <div className="p-8 rounded-xl bg-cyan-950/50 border border-cyan-800 text-center">
                  <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-white">تم إرسال رسالتك والمرفقات بنجاح!</h4>
                  <p className="text-xs text-slate-300 mt-2">
                    تم توجيه الرسالة والملف المرفق مباشرة للوحة الأدمن وللبريد الإلكتروني للإدارة.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitSmartForm} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">الاسم الكامل *</label>
                      <input 
                        type="text" 
                        required
                        value={smartForm.fullName}
                        onChange={(e) => setSmartForm({...smartForm, fullName: e.target.value})}
                        placeholder="الاسم الثلاثي أو اسم الجهة"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">البريد الإلكتروني *</label>
                      <input 
                        type="email" 
                        required
                        value={smartForm.email}
                        onChange={(e) => setSmartForm({...smartForm, email: e.target.value})}
                        placeholder="username@domain.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors text-left font-mono"
                        style={{ direction: 'ltr' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">موضوع الرسالة *</label>
                    <select 
                      value={smartForm.subject}
                      onChange={(e) => setSmartForm({...smartForm, subject: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="استشارة هندسية">استشارة هندسية</option>
                      <option value="طلب تصميم">طلب تصميم</option>
                      <option value="استفسار عن دورة تدريبية">استفسار عن دورة تدريبية</option>
                      <option value="مشكلة تقنية">مشكلة تقنية</option>
                      <option value="تعاون وشراكة">تعاون وشراكة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">مربع نص الرسالة *</label>
                    <textarea 
                      rows="4"
                      required
                      value={smartForm.message}
                      onChange={(e) => setSmartForm({...smartForm, message: e.target.value})}
                      placeholder="اكتب تفاصيل استفسارك أو طلبك هنا بالتفصيل..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    ></textarea>
                  </div>

                  {/* رفع وإرفاق كافة أنواع الملفات والمخططات */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">إمكانية إرفاق ملف (DWG, PDF, ZIP, Images)</p>
                        <p className="text-[10px] text-slate-400">يتم إرسال محتوى الملف ليتم تنزيله وفتحه بوضوح</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {smartForm.fileName && (
                        <span className="text-xs text-cyan-400 truncate max-w-[150px] bg-cyan-950/50 px-2 py-1 rounded border border-cyan-800 flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          {smartForm.fileName}
                        </span>
                      )}
                      <label className="cursor-pointer text-xs font-bold px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors">
                        <span>{smartForm.fileName ? 'تغيير الملف' : 'رفع ملف / مخطط'}</span>
                        <input type="file" onChange={handleSmartFileChange} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSmartLoading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isSmartLoading ? 'جاري إرسال المرفقات والبيانات...' : 'زر الإرسال (تأكيد وإرسال للوحة التحكم والأدمن)'}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* C. حجز استشارة */}
            <div id="consultation-section" className="p-6 lg:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl relative">
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <span>C. حجز استشارة هندسية وموعد</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">حجز موعد مسبق ومناقشة المخططات والمشاريع الهندسة</p>
                </div>
                <span className="text-[11px] font-mono bg-indigo-950 text-indigo-400 border border-indigo-800 px-2.5 py-1 rounded-md">FORM-C</span>
              </div>

              {consultationSubmitStatus ? (
                <div className="p-8 rounded-xl bg-indigo-950/50 border border-indigo-800 text-center">
                  <CheckCircle2 className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-white">تم تأكيد وحجز الاستشارة بنجاح!</h4>
                  <p className="text-xs text-slate-300 mt-2">
                    تم إرسال الملف والموعد للإدارة وللبريد الإلكتروني المعتمد.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitConsultationForm} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">الاسم الكامل *</label>
                      <input 
                        type="text" 
                        required
                        value={consultationForm.fullName}
                        onChange={(e) => setConsultationForm({...consultationForm, fullName: e.target.value})}
                        placeholder="اسم المهندس / العميل"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">البريد الإلكتروني *</label>
                      <input 
                        type="email" 
                        required
                        value={consultationForm.email}
                        onChange={(e) => setConsultationForm({...consultationForm, email: e.target.value})}
                        placeholder="client@domain.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors text-left font-mono"
                        style={{ direction: 'ltr' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">موضوع الاستشارة *</label>
                      <select 
                        value={consultationForm.subject}
                        onChange={(e) => setConsultationForm({...consultationForm, subject: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option value="استشارة هندسية">استشارة هندسية</option>
                        <option value="طلب تصميم">طلب تصميم</option>
                        <option value="استفسار عن دورة تدريبية">استفسار عن دورة تدريبية</option>
                        <option value="مشكلة تقنية">مشكلة تقنية</option>
                        <option value="تعاون وشراكة">تعاون وشراكة</option>
                        <option value="آخر">آخر يرجى تحديدها</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">التاريخ المطلوب *</label>
                      <input 
                        type="date" 
                        required
                        value={consultationForm.requestedDate}
                        onChange={(e) => setConsultationForm({...consultationForm, requestedDate: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  {consultationForm.subject === 'آخر' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">حدد موضوع الاستشارة الخاص بك *</label>
                      <input 
                        type="text"
                        required
                        value={consultationForm.customSubject}
                        onChange={(e) => setConsultationForm({...consultationForm, customSubject: e.target.value})}
                        placeholder="اكتب العنوان بالتفصيل..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">مربع نص الرسالة وشرح الاستشارة *</label>
                    <textarea 
                      rows="4"
                      required
                      value={consultationForm.message}
                      onChange={(e) => setConsultationForm({...consultationForm, message: e.target.value})}
                      placeholder="اذكر التفاصيل الإنشائية، المساحات، المعطيات المطلوبة..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    ></textarea>
                  </div>

                  {/* إرفاق المخططات والملفات */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">إمكانية إرفاق ملف (PDF, DWG, صور المخططات)</p>
                        <p className="text-[10px] text-slate-400">تحميل كافة أنواع المخططات المراد استشارتها</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {consultationForm.fileName && (
                        <span className="text-xs text-indigo-400 truncate max-w-[150px] bg-indigo-950/50 px-2 py-1 rounded border border-indigo-800 flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          {consultationForm.fileName}
                        </span>
                      )}
                      <label className="cursor-pointer text-xs font-bold px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors">
                        <span>{consultationForm.fileName ? 'تغيير الملف' : 'رفع المخطط'}</span>
                        <input type="file" onChange={handleConsultationFileChange} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={consultationForm.isConfirmed}
                        onChange={(e) => setConsultationForm({...consultationForm, isConfirmed: e.target.checked})}
                        className="mt-1 rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-0 w-4 h-4"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-200">حقل تأكيد الاستشارة *</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          أؤكد رغبتي في حجز الموعد وإرسال بيانات المخططات المرفقة للإدارة والأدمن.
                        </p>
                      </div>
                    </label>
                  </div>

                  <button 
                    type="submit"
                    disabled={isConsultationLoading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isConsultationLoading ? 'جاري تأكيد وحفظ الموعد...' : 'زر تأكيد الاستشارة (إرسال للوحة التحكم والبريد)'}
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </main>

      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} منصة الهندسة الذكية والموارد البشرية. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}