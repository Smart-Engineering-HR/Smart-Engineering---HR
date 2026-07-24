'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// البيانات الافتراضية الأولية المجهزة بالكامل وفقاً للهيكل المطلوب
const initialInsights = [
  {
    id: '1',
    category: 'future',
    categoryTitle: 'هندسة المستقبل',
    title: 'الذكاء الاصطناعي في الإنشاءات: التنبؤ بانهيار التربة',
    difficulty: 'متقدم',
    specialty: 'جيوتقني',
    summary30s: 'استخدام خوارزميات تعلم الآلة وتحليل الحساسية لبيانات التربة للتنبؤ بمستويات الإجهاد المسببة للانهيار قبل حدوثها بنسبة دقة تصل إلى 94%.',
    problem: 'صعوبة التنبؤ اللحظي بانهيار التربة الجانبية أثناء الحفر العميق في المشاريع الحضرية، مما يهدد المنشآت المجاورة ويعتمد على تقارير ورقية دورية غير فورية.',
    science: 'تعتمد النظرية على دمج معادلات توازن الحدود (Limit Equilibrium) مع خوارزميات الشبكات العصبية الاصطناعية (ANN) لتحليل قوى القص (Shear Strength) وضغط الماء الفجوي (Pore Water Pressure).',
    smartIdea: 'تحويل مخرجات الحساسات الحقلية مباشرة إلى خوارزمية برمجية تقوم بتحديث معامل الأمان (Factor of Safety) كل 5 ثوانٍ وإرسال تحذير مبكر في حال انخفاضه عن 1.2.',
    applicationCode: `import math
def predict_soil_stability(c, phi, gamma, h, beta):
    # حساب تقريبي لمعامل الأمان باستخدام خوارزمية مبسطة
    phi_rad = math.radians(phi)
    beta_rad = math.radians(beta)
    numerator = c + (gamma * h * (math.cos(beta_rad)**2) * math.tan(phi_rad))
    denominator = gamma * h * math.sin(beta_rad) * math.cos(beta_rad)
    fos = numerator / denominator if denominator != 0 else 0
    return round(fos, 2)

# مثال تشغيلي: تماسك 20، زاوية احتكاك 28، عمق 6م
print("معامل الأمان المتوقع:", predict_soil_stability(20, 28, 18, 6, 45))`,
    toolLink: '/tools/soil-analyzer',
    calcType: 'soil'
  },
  {
    id: '2',
    category: 'technical',
    categoryTitle: 'أسرار التنفيذ والمكتب الفني',
    title: 'هندسة القيمة: تحسين تكلفة الأعمدة الخرسانية للأبراج',
    difficulty: 'خبير',
    specialty: 'مكتب فني',
    summary30s: 'خوارزمية ذكية توازن بين رتبة الخرسانة ونسبة حديد التسليح للوصول إلى التصميم الأكثر أماناً والأقل كلفة للمتر الطولي في المنشآت العالية.',
    problem: 'زيادة الهدر المالي نتيجة استخدام نسب تسليح مرتفعة ثابتة أو رتب خرسانية منخفضة في الأدوار السفلى للأبراج دون مراعاة الجدوى الاقتصادية للبدائل المتكافئة إنشائياً.',
    science: 'تعتمد على مبادئ الكود في التصميم تحت الأحكام المركبة (Axial Load + Bending Moment) وصياغة دالة الكلفة الإجمالية (Objective Cost Function) كمتغير تابع لأبعاد القطاع والحديد.',
    smartIdea: 'تطوير مصفوفة مقارنات سريعة تختبر 12 سيناريو مختلف للقطاع خلال ثوانٍ وتحدد بدقة نقطة التقاطع المثالية بين أقل حجم خرسانة وأقل وزن تسليح.',
    applicationCode: `# خوارزمية حساب الكلفة التقديرية للمتر الطولي في العمود
def optimize_column_cost(width, depth, rebar_percentage, conc_price_per_m3, steel_price_per_ton):
    area_m2 = (width * depth) / 1000000
    conc_cost = area_m2 * 1 * conc_price_per_m3
    steel_volume = area_m2 * 1 * (rebar_percentage / 100)
    steel_weight_tons = steel_volume * 7.85
    steel_cost = steel_weight_tons * steel_price_per_ton
    total_cost = conc_cost + steel_cost
    return round(total_cost, 2)

print("كلفة المتر الطولي للسيناريو المقترح:", optimize_column_cost(600, 600, 2.5, 450, 3200))`,
    toolLink: '/tools/column-value-eng',
    calcType: 'value'
  },
  {
    id: '3',
    category: 'programming',
    categoryTitle: 'البرمجة للمهندسين',
    title: 'أتمتة استخراج وتدقيق جداول التسليح باستخدام بايثون',
    difficulty: 'أساسيات',
    specialty: 'برمجيات هندسية',
    summary30s: 'تحويل ساعات العمل الطويلة في تدقيق وحصر كميات الحديد من المخططات إلى عملية مؤتمتة بالكامل تستغرق دقيقة واحدة عبر قراءة ملفات DXF/DWG.',
    problem: 'الأخطاء البشرية المتكررة أثناء الحصر اليدوي لحديد تسليح القواعد والأسقف، مما يتسبب في طلب كميات زائدة أو حدوث عجز بالموقع.',
    science: 'تعتمد الفكرة على توظيف الهندسة التحليلية وقراءة الكيانات الرسومية (Polylines & Texts) من ملفات التصميم بمساعدة الحاسوب وتصنيفها برمجياً.',
    smartIdea: 'تطوير سكريبت يقوم بمسح طبقات الحديد (Layers)، واستخراج الأقطار والأطوال، ثم تصديرها مباشرة إلى جدول Excel منسق تلقائياً دون أي تدخل بشري.',
    applicationCode: `# سكريبت مصغر لتلخيص أوزان الحديد بناءً على القطر والطول
def calculate_rebar_weight(diameter, total_length):
    # الوزن النوعي للمتر الطولي = (القطر * القطر) / 162
    weight_per_meter = (diameter ** 2) / 162
    total_weight_kg = weight_per_meter * total_length
    return round(total_weight_kg, 2)

print("إجمالي الوزن بالكيلوجرام لقطر 16م بطول 500م:", calculate_rebar_weight(16, 500))`,
    toolLink: '/tools/rebar-automation',
    calcType: 'rebar'
  }
];

export default function InsightsPage() {
  const [insights, setInsights] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [expandedInsight, setExpandedInsight] = useState(null);

  // حاسبات تفاعلية هندسية فورية حية داخل المقالات
  const [soilInputs, setSoilInputs] = useState({ c: 20, phi: 28, h: 6 });
  const [valueInputs, setValueInputs] = useState({ width: 600, depth: 600, rebar: 2 });
  const [rebarInputs, setRebarInputs] = useState({ dia: 16, len: 120 });

  useEffect(() => {
    const stored = localStorage.getItem('smart_engineering_insights_data');
    if (stored) {
      setInsights(JSON.parse(stored));
    } else {
      localStorage.setItem('smart_engineering_insights_data', JSON.stringify(initialInsights));
      setInsights(initialInsights);
    }
  }, []);

  const handleFilter = (category) => {
    setActiveTab(category);
  };

  const filteredInsights = insights.filter(item => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    return matchesTab && matchesSearch && matchesDiff;
  });

  // دوال الحساب للحاسبات التفاعلية الحية
  const runSoilCalc = () => {
    const { c, phi, h } = soilInputs;
    const rad = Math.PI * 45 / 180;
    const num = parseFloat(c) + (18 * parseFloat(h) * (Math.cos(rad)**2) * Math.tan(parseFloat(phi) * Math.PI / 180));
    const den = 18 * parseFloat(h) * Math.sin(rad) * Math.cos(rad);
    return den !== 0 ? (num / den).toFixed(2) : '0';
  };

  const runValueCalc = () => {
    const { width, depth, rebar } = valueInputs;
    const area = (parseFloat(width) * parseFloat(depth)) / 1000000;
    const conc = area * 1 * 450;
    const steel = area * 1 * (parseFloat(rebar) / 100) * 7.85 * 3200;
    return (conc + steel).toFixed(2);
  };

  const runRebarCalc = () => {
    const { dia, len } = rebarInputs;
    return (((parseFloat(dia) ** 2) / 162) * parseFloat(len)).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-900" dir="rtl">
      {/* غلاف خلفية علوي متطور مع تأثير شبكي هندسي */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-950/60 via-slate-950 to-slate-950 border-b border-slate-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs uppercase font-semibold tracking-wider text-cyan-400">منصة الهندسة الذكية</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              أفكار وعلوم <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">الهندسة الذكية</span>
            </h1>
            <p className="mt-3 text-lg text-slate-400 max-w-2xl">
              المجلة العلمية المتقدمة لتوثيق ونشر أحدث الابتكارات التقنية، النظريات الهندسية التطبيقية، وأدوات الأتمتة البرمجية.
            </p>
          </div>
          
          {/* زر العودة الصارم والمطلوب إلى الرئيسية */}
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 hover:border-slate-600 font-medium transition-all group shrink-0">
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            العودة للرئيسية للمنصة
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* شريط البحث والفرز المتقدم */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="ابحث عن مقال، فكرة، أو تخصص هندسي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-11 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-300 outline-none focus:border-cyan-500"
            >
              <option value="all">كل مستويات الصعوبة</option>
              <option value="أساسيات">أساسيات</option>
              <option value="متقدم">متقدم</option>
              <option value="خبير">خبير</option>
            </select>
          </div>
        </div>

        {/* قوائم التبويب الرئيسية الأربعة */}
        <div className="flex flex-wrap gap-2 border-b border-slate-850 pb-4 mb-10">
          <button onClick={() => handleFilter('all')} className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'all' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}>كل الأفكار والعلوم</button>
          <button onClick={() => handleFilter('future')} className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'future' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}>هندسة المستقبل</button>
          <button onClick={() => handleFilter('technical')} className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'technical' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}>أسرار التنفيذ والمكتب الفني</button>
          <button onClick={() => handleFilter('programming')} className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'programming' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}>البرمجة للمهندسين</button>
          <button onClick={() => handleFilter('papers')} className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'papers' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}>أوراق بحثية مبسطة</button>
        </div>

        {/* شبكة عرض المقالات بطابع المجلة */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredInsights.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-slate-900/20 rounded-2xl border border-slate-850">
              <p className="text-slate-500 text-lg">لم يتم العثور على محتوى يطابق خيارات البحث الحالية.</p>
            </div>
          ) : (
            filteredInsights.map((item) => (
              <article key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:border-slate-700 transition-all shadow-xl group">
                <div className="p-6 sm:p-8 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      item.category === 'future' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800' :
                      item.category === 'technical' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      item.category === 'programming' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-purple-950 text-purple-400 border border-purple-800'
                    }`}>
                      {item.categoryTitle || 'عام'}
                    </span>
                    
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-slate-800 rounded text-slate-300 font-mono">الصعوبة: {item.difficulty}</span>
                      <span className="px-2 py-1 bg-slate-800 rounded text-cyan-400 font-mono">#{item.specialty}</span>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h2>

                  {/* إنفوجرافيك القراءة السريعة (30 ثانية) */}
                  <div className="bg-gradient-to-l from-slate-950 to-slate-900 p-4 rounded-xl border-r-4 border-cyan-500 mb-6 shadow-inner">
                    <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      ملخص سريع (30 ثانية):
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">{item.summary30s}</p>
                  </div>

                  {/* محتوى المقال التفاعلي المنظم بالكامل */}
                  <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                    <div>
                      <h4 className="text-slate-200 font-bold mb-1 flex items-center gap-2">
                        <span className="text-xs bg-red-950 text-red-400 px-1.5 py-0.5 rounded">1</span> المشكلة:
                      </h4>
                      <p>{item.problem}</p>
                    </div>

                    <div>
                      <h4 className="text-slate-200 font-bold mb-1 flex items-center gap-2">
                        <span className="text-xs bg-indigo-950 text-indigo-400 px-1.5 py-0.5 rounded">2</span> العلم والنظرية:
                      </h4>
                      <p>{item.science}</p>
                    </div>

                    <div>
                      <h4 className="text-slate-200 font-bold mb-1 flex items-center gap-2">
                        <span className="text-xs bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded">3</span> الفكرة الذكية:
                      </h4>
                      <p>{item.smartIdea}</p>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-slate-200 font-bold mb-2 flex items-center gap-2">
                        <span className="text-xs bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded">4</span> التطبيق والكود البرمجي:
                      </h4>
                      <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto border border-slate-850 dir-ltr text-left leading-normal whitespace-pre">
                        {item.applicationCode}
                      </pre>
                    </div>
                  </div>

                  {/* الحاسبة التفاعلية المدمجة الفورية */}
                  <div className="mt-6 bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <span className="text-xs font-bold text-slate-400 block mb-3">⚙️ حاسبة هندسية فورية مدمجة للتجربة:</span>
                    {item.calcType === 'soil' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-500 block">التماسك C (kPa)</label>
                            <input type="number" value={soilInputs.c} onChange={e => setSoilInputs({...soilInputs, c: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">الاحتكاك Phi°</label>
                            <input type="number" value={soilInputs.phi} onChange={e => setSoilInputs({...soilInputs, phi: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">العمق H (m)</label>
                            <input type="number" value={soilInputs.h} onChange={e => setSoilInputs({...soilInputs, h: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                          </div>
                        </div>
                        <div className="text-xs text-cyan-400 font-mono bg-cyan-950/30 p-2 rounded text-center border border-cyan-900/50">
                          معامل الأمان الحالي للحفر الفوري المحسوب = <span className="font-bold text-sm text-white">{runSoilCalc()}</span>
                        </div>
                      </div>
                    )}

                    {item.calcType === 'value' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-500 block">العرض (mm)</label>
                            <input type="number" value={valueInputs.width} onChange={e => setValueInputs({...valueInputs, width: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">العمق (mm)</label>
                            <input type="number" value={valueInputs.depth} onChange={e => setValueInputs({...valueInputs, depth: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">التسليح %</label>
                            <input type="number" step="0.1" value={valueInputs.rebar} onChange={e => setValueInputs({...valueInputs, rebar: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                          </div>
                        </div>
                        <div className="text-xs text-emerald-400 font-mono bg-emerald-950/30 p-2 rounded text-center border border-emerald-900/50">
                          الكلفة التقديرية للمتر الطولي = <span className="font-bold text-sm text-white">${runValueCalc()}</span>
                        </div>
                      </div>
                    )}

                    {(!item.calcType || item.calcType === 'rebar') && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-500 block">قطر السيخ (mm)</label>
                            <input type="number" value={rebarInputs.dia} onChange={e => setRebarInputs({...rebarInputs, dia: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">الطول الإجمالي (m)</label>
                            <input type="number" value={rebarInputs.len} onChange={e => setRebarInputs({...rebarInputs, len: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white" />
                          </div>
                        </div>
                        <div className="text-xs text-amber-400 font-mono bg-amber-950/30 p-2 rounded text-center border border-amber-900/50">
                          الوزن الإجمالي المحسوب للحديد = <span className="font-bold text-sm text-white">{runRebarCalc()} كجم</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* رابط الأداة التفاعلي للقسم البرمجي بالأسفل */}
                <div className="px-6 py-4 bg-slate-950 border-t border-slate-850 flex items-center justify-between">
                  <span className="text-xs text-slate-500">تم التحقق العلمي والبرمجي</span>
                  <Link href={item.toolLink || '#'} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                    تشغيل الأداة في قسم البرمجيات
                    <svg className="w-3.5 h-3.5 transform -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {/* تذييل الصفحة الاحترافي متضمناً الإيميلات الرسمية المطلوبة للمنصة */}
      <footer className="mt-24 border-t border-slate-900 bg-slate-950 py-12 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-4">منصة الهندسة الذكية © 2026 - إدارة أفكار وعلوم هندسة المستقبل</p>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 bg-slate-900/40 p-4 rounded-xl border border-slate-900 max-w-3xl mx-auto">
            <span>📪 <strong className="text-slate-300">البريد الرئيسي:</strong> Smart.Engineering.Global@proton.me</span>
            <span>✉️ <strong className="text-slate-300">الاحتياطي:</strong> smart.engineering.global@tuta.io</span>
            <span>💼 <strong className="text-slate-300">الموارد البشرية:</strong> smartengineering.hr.global@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}