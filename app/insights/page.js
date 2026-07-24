"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Cpu, 
  Layers, 
  Terminal, 
  BookOpen, 
  Calculator, 
  ExternalLink, 
  Sparkles, 
  AlertCircle, 
  HelpCircle, 
  Code 
} from "lucide-react";

export default function InsightsPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [calcInput, setCalcInput] = useState("");
  const [calcResult, setCalcResult] = useState(null);

  // تحميل البيانات المبدئية والتحقق من التحديثات بـ LocalStorage لضمان الربط مع الـ Admin
  useEffect(() => {
    const defaultArticles = [
      {
        id: "1",
        category: "FUTURE_ENG",
        title: "الذكاء الاصطناعي في الإنشاءات",
        shortDesc: "كيف يتم استخدام Machine Learning للتنبؤ بانهيار التربة أو تحسين تكلفة المشاريع.",
        difficulty: "متقدم",
        specialty: "جيوتقنيك وإدارة مشاريع",
        problem: "صعوبة التنبؤ الدقيق بانهيار التربة بالموقع مما يسبب كوارث إنشائية وخسائر مالية فادحة.",
        science: "تعتمد النظرية على تحليل بيانات الجسات السابقة وتدريب خوارزميات الغابات العشوائية (Random Forests) وشبكات العصبونات الاصطناعية على معطيات الضغط، الرطوبة، وزاوية الاحتكاك الداخلي.",
        smartIdea: "تحويل قيم الاختبارات الحقلية الفورية (SPT) إلى مصفوفات رقمية وإدخالها لنموذج تنبؤي فوري يعطي نسبة أمان التربة خلال 30 ثانية.",
        application: "خطوات التنفيذ: 1. جمع بيانات الجسات، 2. تشغيل ملف البايثون، 3. استخراج منحنى الهبوط المتوقع.",
        codeSnippet: "import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\n\n# بيانات عينة: [الرطوبة، الضغط، العمق]\nX = np.array([[12, 150, 5], [22, 90, 8], [15, 200, 3]])\ny = np.array([1, 0, 1]) # 1: آمن, 0: خطر انهيار\n\nclf = RandomForestClassifier()\nclf.fit(X, y)\nprint('التنبؤ للتربة الحالية:', clf.predict([[18, 110, 6]]))",
        toolLink: "/software/geotech-predictor",
        hasCalculator: true,
        calcType: "soil_safety"
      },
      {
        id: "2",
        category: "FUTURE_ENG",
        title: "الطباعة ثلاثية الأبعاد للمنازل",
        shortDesc: "أحدث الأبحاث في بناء المنازل بالخرسانة المطبوعة لتقليل الهدر والوقت.",
        difficulty: "خبير",
        specialty: "مواد وإنشاءات",
        problem: "ارتفاع تكلفة القوالب الخشبية التقليدية واستهلاكها لزمن طويل جداً في المنشآت ذات الأشكال المعقدة.",
        science: "استخدام ريولوجيا الخرسانة (Concrete Rheology) لابتكار خلطات ذات سيولة عالية أثناء الضخ، وتصلد سريع جداً فور الخروج من فوهة الطابعة لتحمل الطبقات التالية.",
        smartIdea: "برمجة روبوت إنشائي بذراع سداسية المحاور يقرأ ملفات الـ G-code مباشرة من التصميم المعماري ويصب الخرسانة بدقة مليمترية.",
        application: "تحميل التصميم بصيغة STL، تشغيل نظام الضخ التلقائي، ومراقبة جفاف الطبقات دورياً.",
        codeSnippet: "G1 X100 Y50 Z0.4 F3000 ; تحريك الذراع وضخ الطبقة الأولى\nG1 X150 Y50 Z0.8 F3000 ; صب الطبقة الثانية بارتفاع مضاعف",
        toolLink: "/software/3d-print-slicer",
        hasCalculator: false
      },
      {
        id: "3",
        category: "FUTURE_ENG",
        title: "التوأم الرقمي (Digital Twin)",
        shortDesc: "شرح كيفية ربط حساسات الموقع بنموذج الـ BIM لمراقبة المبنى لحظياً.",
        difficulty: "خبير",
        specialty: "تكنولوجيا البناء",
        problem: "عدم القدرة على معرفة الإجهادات الحقيقية التي تتعرض لها العناصر الإنشائية الحساسة بعد التشغيل.",
        science: "إنشاء اتصال إنترنت الأشياء (IoT) يربط المستشعرات الفيزيائية بنموذج معلومات المبنى الرقمي لمعالجة البيانات عبر السحابة.",
        smartIdea: "تطوير لوحة تحكم ذكية تلون أعضاء نموذج الـ BIM باللون الأحمر فوراً عند تخطي الإجهاد المسموح.",
        application: "تركيب مستشعرات انفعال (Strain Gauges)، ربط الـ API بالنموذج، وتفعيل التنبيهات الذكية.",
        codeSnippet: "import requests\n\ndef check_building_stress(sensor_id):\n    response = requests.get(f'https://api.smart-eng/sensors/{sensor_id}')\n    data = response.json()\n    if data['stress'] > 14.5: # 14.5 MPa الحد الأقصى\n        return 'تحذير: إجهاد مرتفع!'\n    return 'الحالة مستقرة'",
        toolLink: "/software/bim-twin",
        hasCalculator: false
      },
      {
        id: "4",
        category: "EXECUTION_SECRETS",
        title: "هندسة القيمة في العناصر الإنشائية",
        shortDesc: "أفكار وحلول ذكية لتقليل التكاليف الإجمالية للمشروع دون المساس بالجودة والسلامة.",
        difficulty: "أساسيات",
        specialty: "مكتب فني وتكاليف",
        problem: "زيادة كميات حديد التسليح والخرسانة نتيجة التصاميم التقليدية غير المحسنة اقتصادياً.",
        science: "تطبيق مبادئ النمذجة الرياضية لتقليل دالة التكلفة مع الحفاظ على قيود الأمان لـ ACI أو الكود المحلي.",
        smartIdea: "تعديل أبعاد القواعد وتغيير توزيع التسليح بالاعتماد على ذروة مخطط عزم الانحناء بدلاً من التوزيع الموحد.",
        application: "إدخال العزوم القصوى، تشغيل الحسبة المثالية، وتعديل المخططات التنفيذية بناء عليها.",
        codeSnippet: "# حساب توفير تقريبي في حديد القواعد\ndef value_engineering(as_original, as_optimized):\n    saving = ((as_original - as_optimized) / as_original) * 100\n    return f'نسبة التوفير في الحديد: {saving:.2f}%'\n\nprint(value_engineering(1200, 950))",
        toolLink: "/software/rebar-optimizer",
        hasCalculator: true,
        calcType: "value_eng"
      }
    ];

    const stored = localStorage.getItem("smart_insights_articles");
    if (stored) {
      setArticles(JSON.parse(stored));
    } else {
      localStorage.setItem("smart_insights_articles", JSON.stringify(defaultArticles));
      setArticles(defaultArticles);
    }
  }, []);

  const categories = [
    { id: "ALL", name: "كل العلوم والأفكار", icon: <Sparkles className="w-5 h-5" /> },
    { id: "FUTURE_ENG", name: "هندسة المستقبل", icon: <Cpu className="w-5 h-5" /> },
    { id: "EXECUTION_SECRETS", name: "أسرار التنفيذ والمكتب الفني", icon: <Layers className="w-5 h-5" /> },
    { id: "PROG_FOR_ENG", name: "البرمجة للمهندسين", icon: <Terminal className="w-5 h-5" /> },
    { id: "SIMPLIFIED_PAPERS", name: "أوراق بحثية مبسطة", icon: <BookOpen className="w-5 h-5" /> },
  ];

  const filteredArticles = activeCategory === "ALL" 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  const handleRunCalculator = (type) => {
    const val = parseFloat(calcInput);
    if (isNaN(val)) {
      setCalcResult("يرجى إدخال رقم صحيح.");
      return;
    }
    if (type === "soil_safety") {
      // محاكاة حاسبة أمان التربة بناء على قراءة اختبار SPT
      if (val < 10) setCalcResult("التربة ضعيفة جداً! خطر انهيار مرتفع (عامل الأمان < 1.1)");
      else if (val >= 10 && val < 30) setCalcResult("تربة متوسطة الاستقرار. عامل الأمان التقريبي: 1.5");
      else setCalcResult("تربة ممتازة ومستقرة تماماً. عامل الأمان يتعدى 2.5");
    } else if (type === "value_eng") {
      // محاكاة حساب التوفير المالي
      const optimizedCost = val * 0.82; 
      setCalcResult(`التكلفة الذكية المقترحة: ${optimizedCost.toFixed(2)} $ (تم توفير 18%)`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white" dir="rtl">
      
      {/* الخلفية الاحترافية المعبرة */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-[#0f172a] pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        
        {/* هيدر الصفحة والعودة للرئيسية */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-medium tracking-wider text-sm mb-1">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>منصة الهندسة الذكية</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white bg-clip-text bg-gradient-to-l from-white via-slate-200 to-slate-400">
              قائمة أفكار وعلوم هندسية
            </h1>
            <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
              مواكبة الثورة الرقمية، التقنيات الناشئة، والحلول البرمجية الذكية لتطوير قطاع التشييد والمكتب الفني بأسلوب علمي تفاعلي.
            </p>
          </div>
          
          {/* زر العودة الإلزامي إلى الرئيسية */}
          <Link href="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-emerald-600 hover:to-emerald-500 text-white font-semibold px-5 py-3 rounded-xl transition-all duration-300 shadow-lg group border border-slate-700 hover:border-emerald-400 self-stretch md:self-auto text-center justify-center">
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            <span>العودة للرئيسية بالمنصة</span>
          </Link>
        </header>

        {/* التبويبات والتصنيفات الذكية */}
        <nav className="flex flex-wrap gap-2 mb-10 border-b border-slate-800/60 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSelectedArticle(null); }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-emerald-500 text-slate-900 font-bold shadow-md shadow-emerald-500/20 scale-105"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white"
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </nav>

        {/* لوحة العرض الرئيسية: طراز المجلات العلمية */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* العمود الأيمن: قائمة البطاقات والمقالات المتاحة */}
          <div className="lg:col-span-5 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <h2 className="text-lg font-bold text-slate-300 flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>المواضيع والأبحاث المتاحة ({filteredArticles.length})</span>
            </h2>

            {filteredArticles.length === 0 ? (
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-8 text-center text-slate-400">
                لا توجد مقالات منشورة في هذا القسم حالياً. يمكنك إضافتها من لوحة التحكم.
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => { setSelectedArticle(article); setCalcResult(null); setCalcInput(""); }}
                  className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                    selectedArticle?.id === article.id
                      ? "bg-slate-800 border-emerald-500 shadow-xl shadow-emerald-950/20 bg-gradient-to-l from-slate-800 to-slate-800/50"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-xs px-2.5 py-1 rounded-md font-semibold bg-slate-800 text-emerald-400 border border-slate-700">
                      {article.specialty || "هندسة عامة"}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                      article.difficulty === "خبير" ? "bg-rose-950 text-rose-300" :
                      article.difficulty === "متقدم" ? "bg-amber-950 text-amber-300" : "bg-blue-950 text-blue-300"
                    }`}>
                      {article.difficulty || "أساسيات"}
                    </span>
                  </div>
                  <h3 className="text-md font-bold text-white mb-2">{article.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{article.shortDesc}</p>
                  
                  <div className="mt-4 flex justify-between items-center text-xs text-emerald-400 font-medium">
                    <span>قراءة سريعة وهيكل تفاعلي ←</span>
                    <span className="text-slate-500 text-[11px]">معرف المقال: #{article.id}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* العمود الأيسر: عرض تفاصيل المقال المختار بنظام الهيكل العلمي الرباعي الصارم والوسوم التفاعلية */}
          <div className="lg:col-span-7">
            {selectedArticle ? (
              <article className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm animate-fadeIn">
                
                {/* وسم إنفوجرافيك تلخيصي سريع (30 ثانية) */}
                <div className="bg-gradient-to-r from-emerald-950 to-slate-900 border-l-4 border-emerald-500 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>ملخص الفكرة الذكية (في 30 ثانية)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {selectedArticle.smartIdea}
                  </p>
                </div>

                <h2 className="text-xl md:text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
                  <span className="text-emerald-400">■</span>
                  {selectedArticle.title}
                </h2>

                {/* الهيكل الرباعي الصارم لمنع الحشو */}
                <div className="space-y-6 mt-6">
                  
                  {/* 1. المشكلة */}
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                    <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>1. المشكلة الهندسية المطروحة</span>
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{selectedArticle.problem}</p>
                  </div>

                  {/* 2. العلم */}
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                    <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4" />
                      <span>2. الأساس العلمي والنظرية الرياضية</span>
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{selectedArticle.science}</p>
                  </div>

                  {/* 3. الفكرة الذكية */}
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                    <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4" />
                      <span>3. الخوارزمية والفكرة الذكية</span>
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{selectedArticle.smartIdea}</p>
                  </div>

                  {/* 4. التطبيق */}
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                    <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4" />
                      <span>4. خطوات التنفيذ البرمجي والموقعي</span>
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-3">{selectedArticle.application}</p>
                    
                    {/* كود برميي منسق بالكامل */}
                    {selectedArticle.codeSnippet && (
                      <div className="relative mt-2">
                        <div className="absolute top-2 left-2 text-[10px] uppercase font-bold text-slate-500 px-2 py-0.5 rounded bg-slate-900">
                          Python / Script
                        </div>
                        <pre className="bg-[#0b0f19] text-emerald-300 p-4 rounded-lg overflow-x-auto text-xs font-mono border border-slate-800 leading-normal">
                          {selectedArticle.codeSnippet}
                        </pre>
                      </div>
                    )}
                  </div>

                </div>

                {/* جزء تفاعلي: حاسبة ذكية مدمجة بالمقال للاختبار الفوري للمعدلات */}
                {selectedArticle.hasCalculator && (
                  <div className="mt-8 p-5 bg-slate-950 border border-slate-800 rounded-xl">
                    <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 mb-3 uppercase tracking-wider">
                      <Calculator className="w-4 h-4 text-emerald-400" />
                      <span>تجربة تفاعلية حية: حاسبة المعادلة الفورية للمقال</span>
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="number"
                        placeholder={selectedArticle.calcType === "soil_safety" ? "أدخل قيمة قراءة اختبار SPT كمثال" : "أدخل التكلفة الأصلية بالدولار"}
                        value={calcInput}
                        onChange={(e) => setCalcInput(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 flex-1"
                      />
                      <button 
                        onClick={() => handleRunCalculator(selectedArticle.calcType)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        معالجة فورية
                      </button>
                    </div>
                    {calcResult && (
                      <div className="mt-3 p-3 rounded bg-slate-900 border border-emerald-900/60 text-xs font-mono text-emerald-400">
                        {calcResult}
                      </div>
                    )}
                  </div>
                )}

                {/* الرابط البرمجي بالأداة في قسم البرمجيات بالمنصة */}
                {selectedArticle.toolLink && (
                  <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center flex-wrap gap-2">
                    <span className="text-xs text-slate-400">هل تريد الانتقال للتطبيق الشامل والكامل في الموقع؟</span>
                    <Link href={selectedArticle.toolLink} className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      <span>فتح الأداة البرمجية التابعة</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}

              </article>
            ) : (
              <div className="h-full min-h-[350px] flex flex-col justify-center items-center p-8 bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl text-slate-400 text-center">
                <HelpCircle className="w-12 h-12 text-slate-600 mb-3 animate-bounce" />
                <p className="font-medium text-slate-300">لم يتم اختيار أي فكرة أو مقال علمي حتى الآن</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">اختر أحد الأبحاث أو الأفكار التقنية من القائمة اليمنى لقراءتها بأسلوب المجلة العلمية المتقدمة والتفاعل مع بياناتها المعالجة حياً.</p>
              </div>
            )}
          </div>

        </div>

        {/* ذيل الصفحة يحتوي على ايميلات المنصة للتواصل */}
        <footer className="mt-16 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 space-y-2">
          <p>جميع الحقوق محفوظة لمنصة الهندسة الذكية العالمية © 2026</p>
          <p className="text-slate-600">للتواصل والدعم الفني الأكاديمي والمؤسسي: Smart.Engineering.Global@proton.me | smart.engineering.global@tuta.io | smartengineering.hr.global@gmail.com</p>
        </footer>

      </div>
    </div>
  );
}