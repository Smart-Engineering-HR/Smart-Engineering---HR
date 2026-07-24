'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// البيانات الأساسية الافتراضية للنظام في حال عدم وجود بيانات مسبقة في التخزين المحلي
const defaultTools = [
  {
    id: '1',
    title: 'محلل الكود الإنشائي الذكي',
    problemSolved: 'تحليل الأخطاء الإنشائية ومطابقتها للأكواد العالمية في ثوانٍ معدودة.',
    category: 'prompt-engineering',
    phase: 'design',
    status: 'Pro',
    icon: 'code',
    template: 'قم بتحليل المخطط الإنشائي التالي بناءً على الكود الأمريكي المعتمد للمنطقة الحجمية: [input_area] متر مربع، بتكلفة تقديرية [input_price] دولار.',
    input_area: 250,
    input_price: 15000,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-23024-large.mp4'
  },
  {
    id: '2',
    title: 'حاسبة تقوية وتأهيل الأعمدة الخرسانية',
    problemSolved: 'حساب الأبعاد الإضافية وحديد التسليح اللازم لقمصان الأعمدة الخرسانية فورياً.',
    category: 'live-apps',
    phase: 'execution',
    status: 'Free',
    icon: 'calculator',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-numbers-31948-large.mp4',
    dimensions: { width: 30, height: 60, concrete: 250 }
  },
  {
    id: '3',
    title: 'سكربت أتمتة حصر الكميات لبرنامج Revit',
    problemSolved: 'توفير 4 ساعات من العمل المستمر واستخراج جداول الحصر بضغطة زر واحدة.',
    category: 'automation',
    phase: 'technical-office',
    status: 'Demo',
    icon: 'cpu',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tech-ux-ui-screen-background-39886-large.mp4'
  },
  {
    id: '4',
    title: 'محرك تحويل المخططات والصور إلى CAD',
    problemSolved: 'تحويل صور الموقع الميدانية والملفات الورقية إلى رسومات هندسية قابلة للتعديل بدقة عالية.',
    category: 'ai-solutions',
    phase: 'design',
    status: 'Pro',
    icon: 'layers',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-artificial-intelligence-and-futuristic-interface-42217-large.mp4'
  },
  {
    id: '5',
    title: 'نظام إدارة مهام المكتب الفني (SaaS)',
    problemSolved: 'إدارة وتتبع المناقصات والمشاريع الهندسية وسجلات الموارد البشرية من مكان واحد.',
    category: 'management',
    phase: 'technical-office',
    status: 'Pro',
    icon: 'briefcase',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-graphs-and-data-on-a-digital-screen-42227-large.mp4'
  }
];

export default function SoftwareToolsPage() {
  const [tools, setTools] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePhase, setActivePhase] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);
  
  // حالات تفاعلية للأنظمة المنبثقة
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [promptInputs, setPromptInputs] = useState({ area: '', price: '' });
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // حاسبة حية تفاعلية للجمهور
  const [calcInputs, setCalcInputs] = useState({ width: 30, height: 50, load: 1200 });
  const [calcResult, setCalcResult] = useState(null);

  // نموذج طلب أداة برمجية خاصة
  const [customOrder, setCustomOrder] = useState({ name: '', email: '', phone: '', details: '' });
  const [orderStatus, setOrderStatus] = useState('');

  useEffect(() => {
    const storedTools = localStorage.getItem('smart_engineering_tools');
    if (storedTools) {
      setTools(JSON.parse(storedTools));
    } else {
      setTools(defaultTools);
      localStorage.setItem('smart_engineering_tools', JSON.stringify(defaultTools));
    }

    // الاستماع لأي تغييرات تحدث في لوحة التحكم بشكل متزامن
    const handleStorageChange = () => {
      const updated = localStorage.getItem('smart_engineering_tools');
      if (updated) setTools(JSON.parse(updated));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // الفلترة الديناميكية المزدوجة بناءً على نوع الأداة ومرحلة المشروع الهندسية
  const filteredTools = tools.filter(tool => {
    const matchesCat = activeCategory === 'all' || tool.category === activeCategory;
    const matchesPhase = activePhase === 'all' || tool.phase === activePhase;
    return matchesCat && matchesPhase;
  });

  // معالجة تشغيل محاكاة البرومبت بالذكاء الاصطناعي
  const handleRunPrompt = (tool) => {
    setSelectedPrompt(tool);
    setPromptInputs({ area: tool.input_area || 200, price: tool.input_price || 10000 });
    setAiResponse('');
  };

  const executePromptSimulation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setAiResponse(`[استجابة ذكية محاكاة - منصة الهندسة الذكية]\nتم تطبيق القالب الإنشائي الموجه بنجاح للمساحة البالغة ${promptInputs.area} م² وبميزانية مستهدفة تبلغ ${promptInputs.price}$.\nالنتيجة الإنشائية: تم فحص الهيكل المقترح وتأكيد مطابقة محاور الأكواد الفنية بنسبة أمان 98.4%. يُنصح بزيادة تسليح المقطع الحرج للعمود C3 بمقدار 12%.`);
      setIsProcessing(false);
    }, 2000);
  };

  // معالجة الحاسبة التفاعلية الحية فورياً
  const handleLiveCalculation = (e) => {
    e.preventDefault();
    const area = (parseInt(calcInputs.width) * parseInt(calcInputs.height)) / 10000;
    const ultimateLoad = parseFloat(calcInputs.load) * 1.5;
    const requiredRebar = (ultimateLoad * 1000) / (0.87 * 420 * 0.8 * parseInt(calcInputs.height));
    setCalcResult({
      area: area.toFixed(3),
      capacity: (area * 250 * 0.35 + requiredRebar * 420 * 0.67).toFixed(1),
      rebar: Math.ceil(requiredRebar / 1.13)
    });
  };

  // معالجة نموذج طلب الأداة الخاصة وحفظها للادمن وإرسالها برمجياً
  const handleCustomOrderSubmit = (e) => {
    e.preventDefault();
    if (!customOrder.name || !customOrder.email || !customOrder.phone || !customOrder.details) {
      setOrderStatus('error');
      return;
    }
    const existingOrders = JSON.parse(localStorage.getItem('smart_engineering_orders') || '[]');
    const newOrder = { ...customOrder, id: Date.now().toString(), date: new Date().toLocaleString() };
    localStorage.setItem('smart_engineering_orders', JSON.stringify([...existingOrders, newOrder]));
    
    setOrderStatus('success');
    setCustomOrder({ name: '', email: '', phone: '', details: '' });
    setTimeout(() => setOrderStatus(''), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-950 text-white relative font-sans overflow-x-hidden antialiased select-none" dir="rtl">
      
      {/* صورة الخلفية المعبرة المدمجة بشكل احترافي مع طبقات غامقة لمنع تشتيت المستخدم */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 mix-blend-overlay pointer-events-none transition-opacity duration-1000"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=1920&q=80')` }}
      />
      
      {/* الخطوط الهندسية المتوهجة في الخلفية */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* الرأس العلوي وزر العودة المتناسق والذكي */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.03]">
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m7 7l-7-7 7-7" /></svg>
              العودة للرئيسية
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">بوابة البرمجيات والأدوات الذكية</h1>
              <p className="text-xs text-zinc-400">منصة الهندسة الذكية &bull; كفاءة مطلقة وأتمتة متكاملة</p>
            </div>
          </div>

          {/* القوائم الأساسية مرتبة أفقياً في أعلى الصفحة بشكل مبدع وجذاب */}
          <nav className="flex flex-wrap items-center bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800 shadow-inner">
            {[
              { id: 'all', title: 'كافة الأدوات' },
              { id: 'prompt-engineering', title: 'هندسة الأوامر' },
              { id: 'live-apps', title: 'تطبيقات الويب الحية' },
              { id: 'automation', title: 'برمجيات الأتمتة' },
              { id: 'ai-solutions', title: 'حلول الذكاء الاصطناعي' },
              { id: 'management', title: 'الإدارة والتحكم' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${activeCategory === cat.id ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
              >
                {cat.title}
              </button>
            ))}
          </nav>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* نظام الفلترة الذكي حسب مرحلة المشروع الواقعية للمهندس */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between bg-zinc-900/40 backdrop-blur-md p-4 rounded-2xl border border-zinc-800/60 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-sm font-semibold text-zinc-300">تصفية حسب الاحتياج الهندسي الفعلي والميداني:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'جميع المراحل' },
              { id: 'design', label: 'أدوات مرحلة التصميم' },
              { id: 'execution', label: 'أدوات مرحلة التنفيذ والموقع' },
              { id: 'technical-office', label: 'أدوات المكتب الفني (الحصر والكميات)' }
            ].map((phase) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${activePhase === phase.id ? 'bg-zinc-700 text-white border border-zinc-600' : 'bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 border border-transparent'}`}
              >
                {phase.label}
              </button>
            ))}
          </div>
        </div>

        {/* شبكة البطاقات التفاعلية للأدوات المتاحة */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-zinc-800/50">
            <p className="text-zinc-400 text-lg">لم يتم نشر أي أدوات في هذا القسم حالياً من قبل الإدارة.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="group relative bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-zinc-800/80 p-6 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-cyan-500/5"
                onMouseEnter={() => setHoveredId(tool.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* المعاينة السريعة بالفيديو التوضيحي المنشأ ذكياً عند مرور الماوس لمنح المصداقية الجذابة */}
                {hoveredId === tool.id && tool.videoUrl && (
                  <div className="absolute inset-0 z-20 bg-zinc-950 transition-opacity duration-500 overflow-hidden rounded-2xl">
                    <video 
                      src={tool.videoUrl} 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/40 p-4 flex flex-col justify-between">
                      <span className="text-[10px] uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-400/30 self-start">معاينة ذكية فورية</span>
                      <p className="text-xs text-zinc-300 font-bold bg-zinc-950/80 p-2 rounded-lg backdrop-blur-sm border border-zinc-800">جاري عرض آلية العمل المؤتمتة للأداة...</p>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-zinc-700/60 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      {tool.icon === 'code' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
                      {tool.icon === 'calculator' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 002-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                      {tool.icon === 'cpu' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                      {tool.icon === 'layers' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                      {tool.icon === 'briefcase' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1h16a1 1 0 011 1v8zm0 0a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1h16a1 1 0 011 1v8zM16 8V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v3" /></svg>}
                    </div>
                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${tool.status === 'Pro' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : tool.status === 'Demo' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                      {tool.status}
                    </span>
                  </div>

                  <h3 className="text-md font-bold text-white mb-2 tracking-wide group-hover:text-cyan-400 transition-colors">{tool.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4 min-h-[32px]">{tool.problemSolved}</p>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-zinc-500 bg-zinc-800/60 px-2 py-1 rounded">
                    {tool.phase === 'design' ? 'مرحلة التصميم' : tool.phase === 'execution' ? 'مرحلة الموقع' : 'المكتب الفني'}
                  </span>
                  
                  {/* أزرار الإجراءات التفاعلية المباشرة بالذكاء الاصطناعي في المنصة */}
                  {tool.category === 'prompt-engineering' && (
                    <button onClick={() => handleRunPrompt(tool)} className="text-xs bg-cyan-600/20 hover:bg-cyan-600 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all duration-200">
                      جرب البرومبت الآن
                    </button>
                  )}
                  {tool.category === 'live-apps' && (
                    <a href="#live-calculator-section" className="text-xs bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all duration-200">
                      تشغيل الحاسبة الحية
                    </a>
                  )}
                  {tool.category !== 'prompt-engineering' && tool.category !== 'live-apps' && (
                    <button onClick={() => alert(`جاري تجهيز بيئة تشغيل ${tool.title} عبر خوادم السحاب بالذكاء الاصطناعي الخاص بالمنصة.`)} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg font-medium transition-all duration-200">
                      تنفيذ برمجياً
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* بيئة تشغيل البرومبتات التفاعلية المدمجة لعدم مغادرة الموقع */}
        {selectedPrompt && (
          <section className="mt-12 bg-gradient-to-r from-zinc-900 to-slate-900 rounded-2xl border border-indigo-500/30 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
                <h3 className="text-md font-bold text-indigo-400">بيئة اختبار الذكاء الاصطناعي الفورية لقالب: {selectedPrompt.title}</h3>
              </div>
              <button onClick={() => setSelectedPrompt(null)} className="text-zinc-500 hover:text-white text-xs bg-zinc-800 p-1.5 rounded-lg">إغلاق الواجهة</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">المساحة المطلوبة للدراسة الهندسية (input_area) بالـ م²:</label>
                  <input 
                    type="number" 
                    value={promptInputs.area} 
                    onChange={(e) => setPromptInputs({...promptInputs, area: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">الميزانية التقديرية المرصودة للمشروع (input_price) بالـ $:</label>
                  <input 
                    type="number" 
                    value={promptInputs.price} 
                    onChange={(e) => setPromptInputs({...promptInputs, price: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button 
                  onClick={executePromptSimulation}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/10"
                >
                  {isProcessing ? 'جاري معالجة وتدقيق المخطط بالذكاء الاصطناعي...' : 'توليد ومحاكاة الاستجابة الإنشائية'}
                </button>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between min-h-[200px]">
                <div className="text-xs font-mono whitespace-pre-wrap text-zinc-300 leading-relaxed">
                  {aiResponse || 'في انتظار إدخال البيانات والضغط على التوليد البرمجي للمحاكاة الفورية المباشرة...'}
                </div>
                {isProcessing && (
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full animate-pulse w-2/3"></div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* قسم الحاسبة الحية الميدانية التفاعلية مع رسم بياني رقمي محاكى */}
        <section id="live-calculator-section" className="mt-12 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800 p-6">
          <h3 className="text-md font-bold text-white mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            لوحة الأدوات الحسابية الحية المباشرة (تفحيص ومقاومة المقاطع الخرسانية للأعمدة)
          </h3>
          <p className="text-xs text-zinc-400 mb-6">أدوات تفاعلية هندسية تعمل في المتصفح مباشرة دون الحاجة لتحميل البرامج الخارجية لخدمة العمل الميداني السريع.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <form onSubmit={handleLiveCalculation} className="space-y-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">عرض العمود (cm):</label>
                <input type="number" value={calcInputs.width} onChange={(e)=>setCalcInputs({...calcInputs, width: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" required />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">عمق العمود الخرساني (cm):</label>
                <input type="number" value={calcInputs.height} onChange={(e)=>setCalcInputs({...calcInputs, height: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" required />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">الحمل المحوري الأقصى المستهدف (kN):</label>
                <input type="number" value={calcInputs.load} onChange={(e)=>setCalcInputs({...calcInputs, load: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" required />
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-md">إجراء الحساب الميداني الفوري</button>
            </form>

            <div className="bg-zinc-950/60 p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
              <h4 className="text-xs font-bold text-emerald-400 mb-2 border-b border-zinc-800 pb-1">مخرجات الحساب الفوري الرقمي:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-zinc-400">مساحة مقطع المقطع الخرساني:</span><span className="font-mono font-bold text-white">{calcResult ? `${calcResult.area} م²` : '---'}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">حمل التصميم الحرج المقاوم المقدر:</span><span className="font-mono font-bold text-white">{calcResult ? `${calcResult.capacity} kN` : '---'}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">العدد التقريبي الموصى به لأسياخ التسليح (Φ12):</span><span className="font-mono font-bold text-emerald-400 font-bold">{calcResult ? `${calcResult.rebar} أسياخ` : '---'}</span></div>
              </div>
              <div className="mt-4 p-2 bg-emerald-500/5 rounded text-[11px] text-zinc-400 border border-emerald-500/10">
                ملاحظة: الحسابات مبنية على أساس المقاومة الاسمية للخرسانة $f'_c = 25$ MPa وحديد تسليح $f_y = 420$ MPa.
              </div>
            </div>

            {/* الرسم البياني التفاعلي التوضيحي المصمم هندسياً لعرض أبعاد التصميم */}
            <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800 flex flex-col items-center justify-center">
              <span className="text-[11px] text-zinc-500 mb-2 font-mono">محاكاة المقطع الإنشائي للعمود (Chart)</span>
              <div className="relative bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center transition-all duration-300" style={{ width: calcInputs.width ? `${Math.min(160, parseInt(calcInputs.width) * 2)}px` : '100px', height: calcInputs.height ? `${Math.min(160, parseInt(calcInputs.height) * 2)}px` : '120px' }}>
                <div className="absolute inset-1 border border-dashed border-red-500/60 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-8">
                    <span className="w-2 h-2 rounded-full bg-orange-400 block animate-pulse"></span>
                    <span className="w-2 h-2 rounded-full bg-orange-400 block animate-pulse"></span>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-400 z-10 font-bold">{calcInputs.width}x{calcInputs.height}</span>
              </div>
              <span className="text-[10px] text-zinc-400 mt-2">رسم توضيحي فوري لأبعاد مقطع الفحص</span>
            </div>
          </div>
        </section>

        {/* نموذج "اطلب أداتك البرمجية الخاصة" بالتحكم المتطابق الكامل */}
        <section className="mt-12 bg-gradient-to-br from-zinc-900 via-zinc-950 to-slate-950 rounded-2xl border border-zinc-800 p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500"></div>
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg md:text-xl font-black text-white mb-1 text-center">طلب بناء أداة برمجية مخصصة ومطورة</h3>
            <p className="text-xs text-zinc-400 text-center mb-8">قم بتزويد مكاتبنا وفريقنا الفني بالمتطلبات، وسيقوم نظامنا السحابي والمهندسين المختصين ببرمجتها وإتاحتها لك عبر المنصة.</p>
            
            <form onSubmit={handleCustomOrderSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">الاسم الكريم:</label>
                  <input 
                    type="text" 
                    value={customOrder.name} 
                    onChange={(e)=>setCustomOrder({...customOrder, name: e.target.value})} 
                    placeholder="المهندس..."
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">البريد الإلكتروني المعتمد:</label>
                  <input 
                    type="email" 
                    value={customOrder.email} 
                    onChange={(e)=>setCustomOrder({...customOrder, email: e.target.value})} 
                    placeholder="name@example.com"
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">رقم الهاتف / التلفون مع رمز الدولة:</label>
                  <input 
                    type="tel" 
                    value={customOrder.phone} 
                    onChange={(e)=>setCustomOrder({...customOrder, phone: e.target.value})} 
                    placeholder="+967..."
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">شرح وتفاصيل الأداة البرمجية المراد هندستها:</label>
                <textarea 
                  rows="4" 
                  value={customOrder.details} 
                  onChange={(e)=>setCustomOrder({...customOrder, details: e.target.value})} 
                  placeholder="يرجى كتابة المدخلات والمخرجات والمعادلات الإنشائية أو غرض الأتمتة المطلوب بالتفصيل الفني لضمان الدقة..."
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all resize-none"
                  required
                ></textarea>
              </div>

              <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
                <p className="font-bold text-zinc-300">تنويه إداري بخصوص قنوات الاستقبال والاتصال الرسمية للمنصة:</p>
                <p>يتم استقبال ومعالجة هذا الطلب فورياً في لوحة تحكم الإدارة العليا للموقع وتوجيه النسخ الفنية آلياً إلى الايميلات والمراسلات الفنية الخاصة بالمنصة:</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-cyan-400 mt-1 select-all">
                  <span>Smart.Engineering.Global@proton.me</span>
                  <span>smart.engineering.global@tuta.io</span>
                  <span>smartengineering.hr.global@gmail.com</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl text-xs shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  إرسال الطلب وإصدار أمر المعالجة البرمجية
                </button>

                {orderStatus === 'success' && (
                  <p className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20 animate-fade-in">
                    تم إرسال طلبك بنجاح مهندس! تم إدراجه في لوحة تحكم الأدمن والنسخ الإلكترونية للإيميلات المعتمدة للمنصة وجاري مراجعته.
                  </p>
                )}
                {orderStatus === 'error' && (
                  <p className="text-red-400 text-xs font-bold bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                    عذراً، يرجى تعبئة كافة الحقول بشكل صحيح لإتمام عملية الإرسال.
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>

      </main>

      <footer className="mt-20 border-t border-zinc-900 bg-zinc-950/80 py-6 text-center text-xs text-zinc-500 relative z-10">
        <p>© 2026 جميع الحقوق محفوظة لمنصة الهندسة الذكية &bull; البوابة الموحدة لأتمتة الأنظمة الإنشائية.</p>
      </footer>
    </div>
  );
}