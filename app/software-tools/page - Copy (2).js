"use client";

import React, { useState, useEffect } from 'react';
import { 
  Home, Search, Filter, Play, Download, CheckCircle2, 
  TerminalSquare, Globe, Cpu, Sparkles, LayoutDashboard, 
  Smartphone, Mail, User, FileText, ArrowLeft, Bot, 
  MessageSquare, Briefcase, Ruler, HardHat
} from 'lucide-react';

export default function SoftwareToolsPage() {
  // الحالات التفاعلية للفلترة والبحث
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStage, setActiveStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredVideoId, setHoveredVideoId] = useState(null);

  // حالة نموذج طلب الأداة
  const [requestForm, setRequestForm] = useState({ name: '', email: '', phone: '', details: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success

  // ---------------------------------------------------------------------------
  // قاعدة بيانات الأدوات (يتم تغذيتها والتحكم بها من لوحة تحكم الإدارة Backend)
  // تحتوي على كافة الحقول المطلوبة للإعلان والنشر كما طلبت
  // ---------------------------------------------------------------------------
  const toolsData = [
    // A. هندسة الأوامر (Prompt Engineering)
    {
      id: "prompt-struct-analysis",
      title: "محلل الأكواد الإنشائية (SBC/ACI)",
      category: "prompt",
      stage: "design",
      badge: "مجانية",
      problem: "استغراق وقت طويل في استخراج اشتراطات التسليح من الكود.",
      desc: "برومبت هندسي احترافي مصمم لاستخلاص ومقارنة اشتراطات الكود السعودي والأمريكي بدقة للكمرات والأعمدة.",
      actionText: "جرب البرومبت الآن",
      icon: <TerminalSquare className="w-6 h-6 text-cyan-400" />,
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-34324-large.mp4"
    },
    {
      id: "prompt-soil-report",
      title: "مُصيغ تقارير فحص التربة",
      category: "prompt",
      stage: "office",
      badge: "Pro",
      problem: "صعوبة صياغة التوصيات الجيوتقنية بشكل قانوني وهندسي سليم.",
      desc: "أمر ذكي موجه لنماذج الذكاء الاصطناعي لكتابة تقرير تربة متكامل بناءً على بيانات الجسات المُدخلة.",
      actionText: "جرب البرومبت الآن",
      icon: <TerminalSquare className="w-6 h-6 text-cyan-400" />,
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-programmer-typing-on-a-laptop-42173-large.mp4"
    },

    // B. تطبيقات الويب الحية (Live Web Apps)
    {
      id: "web-col-strengthen",
      title: "حاسبة تقوية الأعمدة الخرسانية",
      category: "web",
      stage: "site",
      badge: "Pro",
      problem: "التعقيد في حساب القمصان الخرسانية (Jacketing) وتقوية الألياف (FRP).",
      desc: "أداة ويب حية تدخل فيها أبعاد العمود والأحمال الجديدة لتعطيك تفاصيل التقوية المطلوبة مع رسم بياني (Chart) فوري.",
      actionText: "افتح الأداة الحية",
      icon: <Globe className="w-6 h-6 text-blue-400" />,
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-hands-typing-on-a-computer-keyboard-40348-large.mp4"
    },
    {
      id: "web-beam-deflection",
      title: "أداة حساب ترحيم الكمرات (Deflection)",
      category: "web",
      stage: "design",
      badge: "مجانية",
      problem: "صعوبة التحقق اليدوي السريع من الترخيم طويل الأمد للكمرات الطويلة.",
      desc: "تطبيق متصفح سريع للتحقق من الترخيم اللحظي وطويل الأمد بمجرد إدخال المجاز (Span) والأحمال.",
      actionText: "افتح الأداة الحية",
      icon: <Globe className="w-6 h-6 text-blue-400" />,
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-monitor-with-running-code-41566-large.mp4"
    },

    // C. برمجيات الأتمتة (Automation Software)
    {
      id: "auto-revit-rebar",
      title: "BIM Rebar Auto-Detailer",
      category: "auto",
      stage: "design",
      badge: "Pro",
      problem: "هدر مئات الساعات في رسم حديد التسليح داخل برنامج Revit.",
      desc: "إضافة (Plugin) متطورة لبرنامج Revit تقوم بتوليد تسليح الأعمدة والكمرات والقواعد أوتوماتيكياً حسب الكود بنقرة واحدة.",
      actionText: "تحميل السكربت",
      icon: <Cpu className="w-6 h-6 text-emerald-400" />,
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-designing-a-3d-architectural-model-on-a-computer-42171-large.mp4"
    },
    {
      id: "auto-pdf-extractor",
      title: "مستخلص الكميات من الـ PDF",
      category: "auto",
      stage: "office",
      badge: "تجريبية",
      problem: "العمل اليدوي الممل في نقل جداول الكميات من المخططات إلى الإكسل.",
      desc: "سكربت بايثون ذكي يقرأ المخططات بصيغة PDF ويستخرج جداول التسليح والكميات ويصدرها كملف Excel جاهز.",
      actionText: "تحميل الأداة",
      icon: <Cpu className="w-6 h-6 text-emerald-400" />,
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-34324-large.mp4"
    },

    // D. حلول الذكاء الاصطناعي (AI Solutions)
    {
      id: "ai-cad-converter",
      title: "مُحول الصور لمخططات CAD بالذكاء الاصطناعي",
      category: "ai",
      stage: "office",
      badge: "Pro",
      problem: "إعادة رسم المخططات القديمة المتوفرة كصور أو ورقيات ممسوحة ضوئياً.",
      desc: "نظام رؤية حاسوبية (Computer Vision) يحول المخططات الصورية إلى ملفات DWG قابلة للتعديل بدقة تصل لـ 95%.",
      actionText: "ارفع صورتك الآن",
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-graphic-designer-working-on-a-tablet-42183-large.mp4"
    },
    {
      id: "ai-clash-detector",
      title: "روبوت تشخيص الأخطاء الإنشائية (AI Inspector)",
      category: "ai",
      stage: "design",
      badge: "تجريبية",
      problem: "الأخطاء البشرية في تداخل العناصر الإنشائية والمعمارية (Clashes).",
      desc: "نموذج ذكاء اصطناعي مدرب على الأكواد الهندسية يحلل ملفاتك ويكتشف التعارضات ونقاط الضعف التصميمية آلياً.",
      actionText: "افحص مخططك",
      icon: <Bot className="w-6 h-6 text-amber-400" />,
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-programmer-typing-on-a-laptop-42173-large.mp4"
    },

    // E. الإدارة والتحكم (Management & Control)
    {
      id: "mgmt-tech-office",
      title: "نظام إدارة المكتب الفني المتكامل (SaaS)",
      category: "manage",
      stage: "office",
      badge: "Pro",
      problem: "فقدان تتبع المستخلصات، العقود، والمطالبات المالية في المكاتب.",
      desc: "لوحة تحكم سحابية لإدارة مهام المكتب الفني، تتبع المناقصات، وإدارة سجلات الموارد البشرية للمهندسين مركزياً.",
      actionText: "دخول للوحة التحكم",
      icon: <LayoutDashboard className="w-6 h-6 text-purple-400" />,
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-monitor-with-running-code-41566-large.mp4"
    },
    {
      id: "mgmt-site-tracker",
      title: "تطبيق التتبع الميداني (Site Tracker)",
      category: "manage",
      stage: "site",
      badge: "مجانية",
      problem: "صعوبة التواصل اللحظي بين مدير المشروع وطاقم التنفيذ بالموقع.",
      desc: "تطبيق لإدارة المهام اليومية، طلبات استلام الأعمال (IR)، وتوثيق تقدم العمل بالصور المربوطة بالإحداثيات الجغرافية.",
      actionText: "تحميل التطبيق",
      icon: <LayoutDashboard className="w-6 h-6 text-purple-400" />,
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-hands-typing-on-a-computer-keyboard-40348-large.mp4"
    }
  ];

  // دالة الفلترة
  const filteredTools = toolsData.filter(tool => {
    const matchCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchStage = activeStage === 'all' || tool.stage === activeStage;
    const matchSearch = tool.title.includes(searchQuery) || tool.desc.includes(searchQuery) || tool.problem.includes(searchQuery);
    return matchCategory && matchStage && matchSearch;
  });

  // معالجة إرسال طلب الأداة
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    // محاكاة إرسال البيانات للبريد الإلكتروني المذكور وقاعدة البيانات
    setTimeout(() => {
      setFormStatus('success');
      setRequestForm({ name: '', email: '', phone: '', details: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  return (
    // الواجهة مبنية بأسلوب لوحة التحكم مع صورة خلفية احترافية وطبقة تعتيم
    <div className="min-h-screen bg-[#020813] text-slate-200 font-sans selection:bg-cyan-500 selection:text-black relative" dir="rtl">
      
      {/* صورة الخلفية المعبرة لكامل القائمة */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop')" }}
      ></div>
      {/* طبقة تدرج لوني لضمان وضوح النصوص فوق الصورة */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#020813]/90 via-[#020813]/95 to-[#020813]"></div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* الهيدر العلوي */}
        <header className="w-full bg-[#020813]/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <Cpu className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
                  برمجيات وأدوات
                </h1>
                <span className="text-xs text-slate-400">منصة الهندسة الذكية - المركز البرمجي</span>
              </div>
            </div>
            {/* زر العودة إلى الرئيسية */}
            <a href="/" className="group flex items-center gap-2 px-5 py-2.5 bg-slate-800/50 hover:bg-cyan-500 border border-slate-700 hover:border-cyan-400 rounded-xl transition-all duration-300 text-sm font-bold text-slate-300 hover:text-slate-900 shadow-lg backdrop-blur-sm">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">العودة للرئيسية</span>
            </a>
          </div>
        </header>

        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">
          
          {/* قسم الفلترة المتقدمة (لوحة التحكم المصغرة) */}
          <section className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-6 justify-between">
              
              <div className="space-y-5 flex-grow">
                {/* 1. القوائم الأساسية للبرمجيات (A-E) */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> التصنيف البرمجي الأساسي:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'الكل' },
                      { id: 'prompt', label: 'هندسة الأوامر (Prompts)' },
                      { id: 'web', label: 'تطبيقات الويب الحية' },
                      { id: 'auto', label: 'برمجيات الأتمتة' },
                      { id: 'ai', label: 'حلول الذكاء الاصطناعي' },
                      { id: 'manage', label: 'الإدارة والتحكم' },
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          activeCategory === cat.id 
                            ? 'bg-cyan-500 text-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                            : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:border-cyan-500/50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. فلترة حسب مرحلة المشروع (احتياج المهندس) */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> مرحلة المشروع (الاحتياج الواقعي):
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'كافة المراحل', icon: <Globe className="w-3 h-3" /> },
                      { id: 'design', label: 'مرحلة التصميم الإنشائي', icon: <Ruler className="w-3 h-3" /> },
                      { id: 'site', label: 'مرحلة التنفيذ والموقع', icon: <HardHat className="w-3 h-3" /> },
                      { id: 'office', label: 'المكتب الفني وحصر الكميات', icon: <FileText className="w-3 h-3" /> },
                    ].map(stage => (
                      <button
                        key={stage.id}
                        onClick={() => setActiveStage(stage.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          activeStage === stage.id 
                            ? 'bg-blue-600/20 text-blue-400 border-blue-500/50' 
                            : 'bg-transparent text-slate-400 border-slate-700/50 hover:bg-slate-800/50'
                        }`}
                      >
                        {stage.icon} {stage.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* شريط البحث */}
              <div className="w-full lg:w-80 flex flex-col justify-end">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="ابحث عن أداة ذكية..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-700 focus:border-cyan-500 rounded-2xl py-3.5 pr-11 pl-4 text-sm text-white font-medium outline-none transition-all"
                  />
                </div>
              </div>

            </div>
          </section>

          {/* شبكة عرض الأدوات (البطاقات التفاعلية) */}
          <section>
            {filteredTools.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/20 border border-slate-800 border-dashed rounded-3xl">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-400">لا توجد أدوات تطابق بحثك حالياً</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTools.map(tool => (
                  <div 
                    key={tool.id}
                    onMouseEnter={() => setHoveredVideoId(tool.id)}
                    onMouseLeave={() => setHoveredVideoId(null)}
                    className="group bg-slate-900/50 backdrop-blur-md border border-white/5 hover:border-cyan-500/50 rounded-[28px] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] relative"
                  >
                    {/* قسم المعاينة السريعة (الفيديو أو الصورة) */}
                    <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                      {hoveredVideoId === tool.id ? (
                        <video 
                          src={tool.videoUrl} 
                          autoPlay 
                          muted 
                          loop 
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center">
                          <div className="p-4 bg-slate-800/50 rounded-full border border-slate-700/50 mb-3 group-hover:scale-110 transition-transform duration-500">
                            {tool.icon}
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium tracking-wide flex items-center gap-1">
                            <Play className="w-3 h-3" /> مرر للـ معاينة المباشرة
                          </span>
                        </div>
                      )}

                      {/* شارة (Badge) نوع الخدمة */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border shadow-lg backdrop-blur-md ${
                          tool.badge === 'Pro' ? 'bg-gradient-to-r from-amber-500/90 to-orange-600/90 text-white border-amber-400/30' :
                          tool.badge === 'تجريبية' ? 'bg-blue-600/90 text-white border-blue-400/30' : 
                          'bg-emerald-600/90 text-white border-emerald-400/30'
                        }`}>
                          {tool.badge}
                        </span>
                      </div>
                    </div>

                    {/* تفاصيل البطاقة */}
                    <div className="p-6 flex flex-col flex-grow relative">
                      <h3 className="text-base font-black text-white mb-2 leading-tight group-hover:text-cyan-400 transition-colors">
                        {tool.title}
                      </h3>
                      
                      {/* قسم المشكلة التي تحلها */}
                      <div className="bg-rose-950/20 border-r-2 border-rose-500/50 p-2.5 rounded-l-lg mb-3">
                        <p className="text-[11px] text-rose-300/90 font-bold leading-relaxed">
                          <span className="text-rose-400">المشكلة: </span> {tool.problem}
                        </p>
                      </div>

                      <p className="text-xs text-slate-400 leading-loose mb-6 flex-grow">
                        {tool.desc}
                      </p>

                      {/* زر الإجراء (Call to Action) المخصص حسب النوع */}
                      <button className="w-full mt-auto py-3 px-4 bg-slate-800 hover:bg-cyan-500 text-cyan-400 hover:text-slate-900 border border-slate-700 hover:border-cyan-400 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2">
                        {tool.category === 'prompt' ? <MessageSquare className="w-4 h-4" /> : 
                         tool.category === 'auto' ? <Download className="w-4 h-4" /> :
                         <Globe className="w-4 h-4" />}
                        {tool.actionText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* قسم اطلب أداتك البرمجية الخاصة (متوافق مع متطلبات الإدارة والإيميلات) */}
          <section className="bg-gradient-to-br from-[#06142e] to-[#0a1e3f] border border-cyan-500/20 rounded-[32px] overflow-hidden shadow-2xl relative mt-16">
            {/* تأثيرات بصرية للخلفية */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 relative z-10">
              
              {/* الجانب النصي التعريفي */}
              <div className="lg:col-span-2 p-10 lg:p-12 border-b lg:border-b-0 lg:border-l border-white/5 bg-slate-900/30">
                <div className="inline-flex p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 mb-6">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
                  اطلب أداتك <br/><span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 to-blue-500">البرمجية الخاصة</span>
                </h2>
                <p className="text-sm text-slate-300 leading-loose mb-8">
                  هل تواجه مشكلة مكررة في مكتبك الفني أو في الموقع؟ فريقنا من المهندسين المبرمجين جاهز لتحويل فكرتك إلى أداة، أو تطبيق ويب، أو سكربت يختصر مئات الساعات من العمل.
                </p>
                
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">يتم استقبال الطلبات عبر:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-white/5">
                      <Mail className="w-4 h-4 text-cyan-400" /> Smart.Engineering.Global@proton.me
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-white/5">
                      <Mail className="w-4 h-4 text-cyan-400" /> smart.engineering.global@tuta.io
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-white/5">
                      <Mail className="w-4 h-4 text-cyan-400" /> smartengineering.hr.global@gmail.com
                    </div>
                  </div>
                </div>
              </div>

              {/* نموذج الطلب الفعلي */}
              <div className="lg:col-span-3 p-10 lg:p-12">
                {formStatus === 'success' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-500/10 flex items-center justify-center rounded-full border border-emerald-500/30 mb-4">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-black text-white">تم استلام طلبك بنجاح!</h3>
                    <p className="text-sm text-slate-400 max-w-md">
                      سيقوم فريق الإدارة الهندسية بمراجعة فكرتك والتواصل معك قريباً عبر البريد أو الهاتف لترتيب التفاصيل الفنية للبرمجة.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRequestSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* حقل الاسم */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 ml-1 flex items-center gap-2">
                          <User className="w-3.5 h-3.5" /> الاسم الكريم
                        </label>
                        <input 
                          type="text" 
                          required
                          value={requestForm.name}
                          onChange={(e) => setRequestForm({...requestForm, name: e.target.value})}
                          className="w-full bg-slate-950/50 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all"
                          placeholder="الاسم الكامل"
                        />
                      </div>
                      
                      {/* حقل الإيميل */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 ml-1 flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" /> البريد الإلكتروني
                        </label>
                        <input 
                          type="email" 
                          required
                          value={requestForm.email}
                          onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
                          className="w-full bg-slate-950/50 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all"
                          placeholder="example@domain.com"
                        />
                      </div>
                    </div>

                    {/* حقل التلفون (تم إضافته حسب الطلب) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 ml-1 flex items-center gap-2">
                        <Smartphone className="w-3.5 h-3.5" /> رقم الهاتف / واتساب
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={requestForm.phone}
                        onChange={(e) => setRequestForm({...requestForm, phone: e.target.value})}
                        className="w-full bg-slate-950/50 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all text-right"
                        dir="ltr"
                        placeholder="+967 7X XXX XXXX"
                      />
                    </div>

                    {/* حقل تفاصيل الأداة */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 ml-1 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" /> شرح وتفاصيل للأداة المطلوبة
                      </label>
                      <textarea 
                        required
                        rows="4"
                        value={requestForm.details}
                        onChange={(e) => setRequestForm({...requestForm, details: e.target.value})}
                        className="w-full bg-slate-950/50 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all resize-none leading-relaxed"
                        placeholder="اشرح لنا المشكلة بالتفصيل، ما هي المدخلات المتوقعة؟ وما هي المخرجات التي تريدها من الأداة؟"
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={formStatus === 'submitting'}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 rounded-xl text-sm font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                      {formStatus === 'submitting' ? 'جاري إرسال الطلب للوحة التحكم...' : 'إرسال طلب البرمجة الآن'} 
                      {formStatus !== 'submitting' && <ArrowLeft className="w-5 h-5" />}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>

        </main>

        {/* الفوتر */}
        <footer className="w-full border-t border-white/5 py-8 mt-auto backdrop-blur-md bg-[#020813]/80">
          <div className="max-w-7xl mx-auto px-6 text-center text-xs font-medium text-slate-500 flex flex-col items-center gap-2">
             <p>جميع الأدوات والبرمجيات تخضع لرقابة وإدارة الجودة بمنصة الهندسة الذكية.</p>
             <p>Smart Engineering Platform © {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}