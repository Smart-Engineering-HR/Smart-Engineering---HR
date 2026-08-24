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
  Code, 
  Zap, 
  CheckCircle, 
  Lightbulb, 
  FileText 
} from "lucide-react";

export default function InsightsPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [calcInput, setCalcInput] = useState("");
  const [calcResult, setCalcResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/insights", { 
        cache: "no-store",
        headers: { "Pragma": "no-cache" } 
      });
      const json = await res.json();
      
      if (json.success && Array.isArray(json.data)) {
        setArticles(json.data);
        if (json.data.length > 0) {
          setSelectedArticle(prev => prev ? (json.data.find(a => a.id === prev.id) || json.data[0]) : json.data[0]);
        }
      }
    } catch (e) {
      console.error("Failed to fetch insights:", e);
    } font-sans finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "ALL", name: "كل العلوم والأفكار", icon: <Sparkles className="w-4 h-4" /> },
    { id: "FUTURE_ENG", name: "هندسة المستقبل", icon: <Cpu className="w-4 h-4" /> },
    { id: "EXECUTION_SECRETS", name: "أسرار التنفيذ والمكتب الفني", icon: <Layers className="w-4 h-4" /> },
    { id: "PROG_FOR_ENG", name: "البرمجة للمهندسين", icon: <Terminal className="w-4 h-4" /> },
    { id: "SIMPLIFIED_PAPERS", name: "أوراق بحثية مبسطة", icon: <BookOpen className="w-4 h-4" /> },
  ];

  const filteredArticles = activeCategory === "ALL" 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  const handleRunCalculator = (type) => {
    const val = parseFloat(calcInput);
    if (isNaN(val)) {
      setCalcResult("يرجى إدخال قيمة رقمية صحيحة للتجربة.");
      return;
    }
    if (type === "soil_safety") {
      if (val < 10) setCalcResult("⚠️ قراءة SPT ضعيفة جداً! خطر انهيار مرتفع (عامل الأمان < 1.1)");
      else if (val >= 10 && val < 30) setCalcResult("✅ تربة متوسطة الاستقرار. عامل الأمان المقدر: 1.55");
      else setCalcResult("🚀 تربة ممتازة ومستقرة تماماً. عامل الأمان يتعدى 2.70");
    } else if (type === "value_eng") {
      const optimizedCost = val * 0.82; 
      setCalcResult(`💰 التكلفة الذكية المحسنة: ${optimizedCost.toFixed(2)} $ (تم توفير 18% من الميزانية)`);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white relative overflow-hidden" dir="rtl">
      
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#070b14] to-[#04060c] pointer-events-none" />
      <div className="fixed inset-0 z-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800/80 pb-6 mb-8 gap-4 backdrop-blur-xl bg-slate-900/40 p-6 rounded-3xl border border-slate-800/60 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold tracking-wider text-xs mb-2">
              <Zap className="w-4 h-4 animate-bounce text-emerald-400" />
              <span>منصة الهندسة الذكية والموارد البشرية</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight bg-clip-text bg-gradient-to-l from-white via-slate-200 to-emerald-400">
              قائمة أفكار وعلوم
            </h1>
            <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl leading-relaxed">
              مجلة هندسية تفاعلية حديثة: هندسة المستقبل، أسرار التنفيذ، البرمجة الإنشائية، وتلخيص الأبحاث العالمية في نقاط تنفيذية فورية.
            </p>
          </div>
          
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:scale-105 group self-stretch md:self-auto justify-center text-sm shrink-0"
          >
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            <span>العودة إلى الرئيسية في منصة الهندسة الذكية</span>
          </Link>
        </header>

        <nav className="flex flex-wrap gap-2.5 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 border ${
                activeCategory === cat.id
                  ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-105"
                  : "bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white hover:border-slate-700"
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 space-y-4 max-h-[80vh] overflow-y-auto pr-1 custom-scrollbar">
            <h2 className="text-sm font-bold text-slate-400 flex items-center justify-between mb-3 px-1">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>الأفكار والمواد العلمية ({filteredArticles.length})</span>
              </span>
              <span className="text-[11px] bg-slate-900 text-slate-500 px-2.5 py-1 rounded-full border border-slate-800 font-mono">تحديث فوري ثابت</span>
            </h2>

            {loading ? (
              <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 text-center text-slate-400 animate-pulse">
                جاري جلب العلوم والأفكار الهندسية...
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                لا توجد مواضيع منشورة حالياً في هذا التصنيف الفرعي.
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => { setSelectedArticle(article); setCalcResult(null); setCalcInput(""); }}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    selectedArticle?.id === article.id
                      ? "bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/50"
                      : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90"
                  }`}
                >
                  <div className="flex justify-between items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {article.specialty || "تخصص هندسي"}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      article.difficulty === "خبير" ? "bg-rose-950 text-rose-300 border border-rose-800/50" :
                      article.difficulty === "متقدم" ? "bg-amber-950 text-amber-300 border border-amber-800/50" : "bg-blue-950 text-blue-300 border border-blue-800/50"
                    }`}>
                      {article.difficulty || "متقدم"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{article.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{article.shortDesc}</p>
                  
                  <div className="mt-4 flex justify-between items-center text-xs font-semibold text-emerald-400">
                    <span>قراءة تفاصيل الإنفوجرافيك ←</span>
                    <span className="text-[10px] text-slate-600 font-mono">#{article.id}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-7">
            {selectedArticle ? (
              <article className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-fadeIn">
                
                <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-900 border-r-4 border-emerald-400 rounded-2xl p-5 mb-6 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-2 uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>إنفوجرافيك: تلخيص الفكرة في (30 ثانية)</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans font-medium">
                    {selectedArticle.smartIdea}
                  </p>
                </div>

                <h2 className="text-xl md:text-3xl font-black text-white mb-6 leading-tight">
                  {selectedArticle.title}
                </h2>

                <div className="space-y-5">
                  <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-xs md:text-sm font-bold text-rose-400 flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>1. المشكلة (Problem)</span>
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{selectedArticle.problem}</p>
                  </div>

                  <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-xs md:text-sm font-bold text-sky-400 flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4" />
                      <span>2. العلم والنظرية (Science & Theory)</span>
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{selectedArticle.science}</p>
                  </div>

                  <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-xs md:text-sm font-bold text-emerald-400 flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4" />
                      <span>3. الفكرة الذكية والحل الخوارزمي (Smart Idea)</span>
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{selectedArticle.smartIdea}</p>
                  </div>

                  <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-xs md:text-sm font-bold text-amber-400 flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4" />
                      <span>4. الخطوات التنفيذية والكود (Application & Code)</span>
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-4">{selectedArticle.application}</p>
                    
                    {selectedArticle.codeSnippet && (
                      <div className="relative mt-3">
                        <div className="absolute top-3 left-3 text-[10px] font-mono font-bold text-slate-400 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                          Code Execution
                        </div>
                        <pre className="bg-[#050811] text-cyan-300 p-4 rounded-xl overflow-x-auto text-xs font-mono border border-slate-800/80 leading-relaxed" dir="ltr">
                          {selectedArticle.codeSnippet}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                {selectedArticle.hasCalculator && (
                  <div className="mt-8 p-6 bg-slate-950 border border-slate-800 rounded-2xl relative shadow-inner">
                    <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-3 uppercase tracking-wider">
                      <Calculator className="w-4 h-4 text-emerald-400" />
                      <span>تجربة تفاعلية حية: حاسبة المعادلة الخاصة بالمقال</span>
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="number"
                        placeholder={selectedArticle.calcType === "soil_safety" ? "أدخل قيمة اختبار SPT (مثال: 18)" : "أدخل التكلفة التقديرية (مثال: 10000)"}
                        value={calcInput}
                        onChange={(e) => setCalcInput(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-emerald-500 flex-1 font-mono"
                      />
                      <button 
                        onClick={() => handleRunCalculator(selectedArticle.calcType)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs md:text-sm transition-all shadow-md shadow-emerald-500/10 shrink-0"
                      >
                        حساب فوري
                      </button>
                    </div>
                    {calcResult && (
                      <div className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fadeIn">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{calcResult}</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedArticle.toolLink && (
                  <div className="mt-8 pt-5 border-t border-slate-800/80 flex justify-between items-center flex-wrap gap-3">
                    <span className="text-xs text-slate-400">تطبيق هذه الفكرة متوفر كأداة برمجية جاهزة داخل المنصة:</span>
                    <Link 
                      href={selectedArticle.toolLink} 
                      className="inline-flex items-center gap-2 text-xs font-black text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20"
                    >
                      <span>الانتقال للأداة البرمجية</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

              </article>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col justify-center items-center p-8 bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl text-slate-400 text-center">
                <HelpCircle className="w-12 h-12 text-slate-600 mb-4 animate-bounce" />
                <p className="font-bold text-slate-200 text-base">اختر إحدى المواد من القائمة</p>
                <p className="text-xs text-slate-500 mt-2 max-w-md leading-relaxed">
                  استعرض أفكار هندسة المستقبل، أسرار المكتب الفني، أتمتة التصميم بالبايثون، والأوراق البحثية المبسطة.
                </p>
              </div>
            )}
          </div>

        </div>

        <footer className="mt-16 pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-3">
          <p className="font-bold text-slate-400">جميع الحقوق محفوظة لمنصة الهندسة الذكية والموارد البشرية © 2026</p>
          <div className="flex justify-center flex-wrap gap-4 text-emerald-400/80 font-mono text-[11px]">
            <span>Smart.Engineering.Global@proton.me</span>
            <span>•</span>
            <span>smart.engineering.global@tuta.io</span>
            <span>•</span>
            <span>smartengineering.hr.global@gmail.com</span>
          </div>
        </footer>

      </div>
    </div>
  );
}