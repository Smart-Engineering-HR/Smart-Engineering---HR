"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Search, Cpu, Globe, Settings, Brain, Sliders, PlayCircle } from 'lucide-react';

export default function SoftwareToolsPage() {
  const [tools, setTools] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStage, setActiveStage] = useState('All');
  const [hoveredTool, setHoveredTool] = useState(null);

  // حالة نموذج الطلب
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', details: '' });

  // جلب البيانات من التخزين المحلي (المرتبط بالادمن)
  useEffect(() => {
    const storedTools = JSON.parse(localStorage.getItem('smart_engineering_tools')) || getDefaultTools();
    setTools(storedTools);
  }, []);

  const categories = [
    { id: 'prompt', name: 'هندسة الأوامر', icon: <Search size={18} /> },
    { id: 'webapps', name: 'تطبيقات الويب الحية', icon: <Globe size={18} /> },
    { id: 'automation', name: 'برمجيات الأتمتة', icon: <Settings size={18} /> },
    { id: 'ai', name: 'حلول الذكاء الاصطناعي', icon: <Brain size={18} /> },
    { id: 'management', name: 'الإدارة والتحكم', icon: <Sliders size={18} /> }
  ];

  const stages = [
    { id: 'design', name: 'مرحلة التصميم' },
    { id: 'execution', name: 'مرحلة التنفيذ والموقع' },
    { id: 'tech_office', name: 'المكتب الفني (حصر وكميات)' }
  ];

  const filteredTools = tools.filter(tool => {
    const matchCategory = activeCategory === 'All' || tool.category === activeCategory;
    const matchStage = activeStage === 'All' || tool.stage === activeStage;
    return matchCategory && matchStage;
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // حفظ الطلب للوحة التحكم
    const existingRequests = JSON.parse(localStorage.getItem('smart_engineering_requests')) || [];
    localStorage.setItem('smart_engineering_requests', JSON.stringify([...existingRequests, { ...formData, id: Date.now(), date: new Date().toLocaleDateString() }]));
    
    // إرسال الإيميل عبر العميل
    const subject = encodeURIComponent("طلب أداة برمجية خاصة - منصة الهندسة الذكية");
    const body = encodeURIComponent(`الاسم: ${formData.name}\nالإيميل: ${formData.email}\nالتلفون: ${formData.phone}\nالتفاصيل:\n${formData.details}`);
    const emails = "Smart.Engineering.Global@proton.me,smart.engineering.global@tuta.io,smartengineering.hr.global@gmail.com";
    window.location.href = `mailto:${emails}?subject=${subject}&body=${body}`;
    
    alert('تم تسجيل طلبك بنجاح وسيتم التواصل معك قريباً.');
    setFormData({ name: '', email: '', phone: '', details: '' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans" dir="rtl">
      {/* خلفية الصفحة والهيدر */}
      <div className="relative bg-[url('/images/software-bg.jpg')] bg-cover bg-center h-80 flex items-center justify-center">
        <div className="absolute inset-0 bg-gray-900 bg-opacity-80"></div>
        <div className="relative z-10 text-center w-full max-w-6xl px-4">
          <div className="flex justify-between items-center w-full mb-8">
            <Link href="/" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
              <Home size={20} />
              <span>العودة للرئيسية</span>
            </Link>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              برمجيات وأدوات
            </h1>
          </div>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl mx-auto">
            الذكاء والتبسيط في مكان واحد. اكتشف أدواتك الهندسية المتقدمة لتعزيز الإنتاجية وتقليل الأخطاء.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* القوائم الأفقية (التصنيفات) */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 border-b border-gray-700 pb-6">
          <button 
            onClick={() => setActiveCategory('All')}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition ${activeCategory === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            الكل
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 transition ${activeCategory === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* الفلترة حسب مرحلة المشروع */}
        <div className="flex justify-center gap-4 mb-12">
          <span className="text-gray-400 self-center">فلترة حسب المرحلة:</span>
          <select 
            value={activeStage} 
            onChange={(e) => setActiveStage(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">جميع المراحل</option>
            {stages.map(stage => (
              <option key={stage.id} value={stage.id}>{stage.name}</option>
            ))}
          </select>
        </div>

        {/* شبكة البطاقات التفاعلية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredTools.map((tool) => (
            <div 
              key={tool.id} 
              className="relative group bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 overflow-hidden shadow-lg"
              onMouseEnter={() => setHoveredTool(tool.id)}
              onMouseLeave={() => setHoveredTool(null)}
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-gray-900 rounded-lg text-blue-400 group-hover:scale-110 transition">
                  <Cpu size={28} />
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${tool.status === 'مجانية' ? 'bg-green-500/20 text-green-400' : tool.status === 'Pro' ? 'bg-purple-500/20 text-purple-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {tool.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">{tool.title}</h3>
              <p className="text-sm text-gray-400 mb-4 relative z-10 line-clamp-2">{tool.problem}</p>
              
              <button className="w-full bg-gray-700 hover:bg-blue-600 text-white py-2 rounded-lg transition relative z-10 font-medium">
                استخدم الأداة الآن
              </button>

              {/* المعاينة السريعة (فيديو بالذكاء الاصطناعي 5 ثواني) */}
              {hoveredTool === tool.id && (
                <div className="absolute inset-0 bg-gray-900 z-20 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                   {/* يرجى استبدال مسار الفيديو بفيديو حقيقي مصمم بالذكاء الاصطناعي */}
                  <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-50">
                    <source src="/videos/ai-preview.mp4" type="video/mp4" />
                  </video>
                  <PlayCircle size={48} className="text-blue-500 mb-2 relative z-30" />
                  <span className="text-white font-bold relative z-30 text-sm bg-black/50 px-3 py-1 rounded-full">معاينة حية...</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* نموذج طلب أداة مخصصة */}
        <div className="max-w-3xl mx-auto bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 blur-[100px] opacity-30"></div>
          <h2 className="text-3xl font-bold text-center mb-2">اطلب أداتك البرمجية الخاصة</h2>
          <p className="text-center text-gray-400 mb-8">هل لديك فكرة لأداة تخدم مكتبك الهندسي؟ دع الذكاء الاصطناعي يحققها لك.</p>
          
          <form onSubmit={handleFormSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الاسم الكريم</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="م. هاشم سلطان" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="engineer@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">رقم الهاتف</label>
              <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="+967..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">شرح وتفاصيل الأداة المطلوبة</label>
              <textarea required value={formData.details} onChange={(e) => setFormData({...formData, details: e.target.value})} rows="4" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="اشرح المشكلة الهندسية التي تريد للأداة حلها..."></textarea>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all">
              إرسال الطلب للتحليل
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// بيانات افتراضية في حال كانت قاعدة البيانات المحلية فارغة
function getDefaultTools() {
  return [
    { id: 1, title: 'مولد برومبتات التحليل الإنشائي', category: 'prompt', stage: 'design', status: 'مجانية', problem: 'يصيغ لك أوامر دقيقة لـ ChatGPT لتحليل تقارير التربة وتصميم الأساسات.' },
    { id: 2, title: 'حاسبة تقوية الأعمدة التفاعلية', category: 'webapps', stage: 'execution', status: 'Pro', problem: 'أدخل بيانات العمود واحصل على تصميم التقوية بالـ FRP أو القمصان الخرسانية فوراً.' },
    { id: 3, title: 'سكربت حصر حديد التسليح (Revit)', category: 'automation', stage: 'tech_office', status: 'تجريبية', problem: 'استخرج جداول التفريد بضغطة زر وبدون هدر.' },
    { id: 4, title: 'AI Checker للمخططات', category: 'ai', stage: 'design', status: 'Pro', problem: 'رفع ملف PDF ليقوم الذكاء الاصطناعي بتحديد التعارضات المعمارية الإنشائية.' },
    { id: 5, title: 'لوحة تحكم المكتب الفني', category: 'management', stage: 'tech_office', status: 'Pro', problem: 'إدارة المستخلصات، العقود، وتتبع المناقصات في منصة سحابية واحدة.' }
  ];
}