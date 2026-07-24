"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // إضافة مكتبة الروابط
import {
  Briefcase, GraduationCap, Laptop, Building2,
  ChevronDown, Zap, Globe, Home, MessageSquare,
  BookOpen, PhoneCall, Layers, ArrowLeftRight, User // أضفت أيقونة User للتسجيل
} from 'lucide-react';

const localContent = {
  ar: {
    dir: "rtl",
    heroH1: "هندسة تتقن التنفيذ..",
    heroH1Span: "وذكاء يسبق الزمن.",
    heroP: "أكاديمية التدريب، البرمجيات، والمشروعات، والتوظيف للمهندس العربي والعالمي.",
    btnStart: "ابدأ برمجياتك الآن",
    btnExplore: "استكشف التدريب",
    btnJoin: "انضم للبوابة الوطنية",
    card1: "ركن التوظيف",
    card2: "مسارات التدريب",
    card3: "أدواتنا البرمجية",
    nav: [
      "الرئيسية",
      "بوابة الوظائف والمناقصات",
      "الأكاديمية والتدريب",
      "برمجيات وأدوات",
      "خدماتنا",
      "أفكار وعلوم",
      "شاركنا رأيك",
      "تواصل معنا"
    ],
    training: [
      "الإنجاز وإدارة المشاريع",
      "برمجة الـ BIM + Data Science",
      "الذكاء الاصطناعي في البناء"
    ],
    status: ["مستخدم نشط حالياً", "مهندساً متدرباً", "فرصة عمل متاحة"]
  },
  en: {
    dir: "ltr",
    heroH1: "Engineering with Masterful Execution..",
    heroH1Span: "And Intelligence Ahead of Time.",
    heroP: "Training academy, software, projects, and employment for Arab and international engineers.",
    btnStart: "Start Software Now",
    btnExplore: "Explore Training",
    btnJoin: "Join National Portal",
    card1: "Jobs Section",
    card2: "Training Paths",
    card3: "Our Software Tools",
    nav: [
      "Home",
      "Jobs & Tenders",
      "Academy & Training",
      "Software & Tools",
      "Services",
      "Insights & Science",
      "Share Feedback",
      "Contact Us"
    ],
    training: [
      "Construction & Project Management",
      "BIM Programming + Data Science",
      "AI in Construction"
    ],
    status: ["Active Users Now", "Trained Engineers", "Job Opportunities Available"]
  }
};

export default function HomePage() {
  const [lang, setLang] = useState('ar');
  const t = localContent[lang];
  const [langListOpen, setLangListOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  const navIcons = [
    <Home key="home" className="h-5 w-5 shrink-0 stroke-[3] text-cyan-400" />,
    <Briefcase key="jobs" className="h-5 w-5 shrink-0 stroke-[3] text-cyan-400" />,
    <GraduationCap key="academy" className="h-5 w-5 shrink-0 stroke-[3] text-cyan-400" />,
    <Laptop key="software" className="h-5 w-5 shrink-0 stroke-[3] text-cyan-400" />,
    <Layers key="services" className="h-5 w-5 shrink-0 stroke-[3] text-cyan-400" />,
    <BookOpen key="science" className="h-5 w-5 shrink-0 stroke-[3] text-cyan-400" />,
    <MessageSquare key="feedback" className="h-5 w-5 shrink-0 stroke-[3] text-cyan-400" />,
    <PhoneCall key="contact" className="h-5 w-5 shrink-0 stroke-[3] text-cyan-400" />
  ];

  const getTargetLink = (index) => {
    // تم تحديث الروابط لتفعيل التحكم
    const links = [
      "/", 
      "/jobs-tenders", 
      "/training", 
      "/software-tools", 
      "/services", 
      "/insights", 
      "/feedback", 
      "/contact"
    ];
    return links[index] || "#";
  };

  return (
    <div className="min-h-screen text-white flex flex-col justify-between overflow-x-hidden antialiased select-none font-black relative">
      
      {/* --- الإضافة: إظهار الخلفية بوضوح فائق (High Definition Visibility) --- */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{ 
            backgroundImage: "url('/background-engineer.jpg')", 
            filter: "brightness(0.6) contrast(1.2)" // رفع السطوع والتباين لإظهار تفاصيل الصورة بوضوح
          }}
        />
        {/* طبقة تدرج لوني شفافة جداً لضمان عدم ضياع النصوص فوق الخلفية الواضحة */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040d1a]/70 via-[#08162a]/40 to-[#0c203e]/80 backdrop-blur-[0.5px]"></div>
        {/* شبكة هندسية أكثر وضوحاً */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-30"></div>
      </div>

      {/* 1. الشريط العلوي (الهيدر) - قوائم عريضة وخطوط واضحة */}
      <header className="relative w-full bg-[#030d1a]/80 backdrop-blur-2xl border-b border-cyan-500/40 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto h-28 px-8 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 shrink-0 cursor-pointer group">
            <div className="relative p-2.5 bg-gradient-to-br from-cyan-500/30 to-blue-600/10 rounded-2xl border border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3">
              <svg className="h-10 w-10 text-cyan-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5 L90 85 L10 85 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
                <path d="M50 5 L50 85" stroke="currentColor" strokeWidth="4" />
                <path d="M30 45 L70 45" stroke="currentColor" strokeWidth="4" />
                <path d="M20 65 L80 65" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="5" r="7" fill="#06b6d4" />
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-3xl text-white tracking-tighter drop-shadow-lg">SMART ENG</span>
              <span className="text-[13px] text-cyan-400 font-black tracking-widest mt-1">
                {lang === 'ar' ? 'الهندسة الذكية' : 'Smart Engineering'}
              </span>
            </div>
          </div>

          <nav className="hidden xl:block overflow-x-auto scrollbar-none py-1">
            <ul className="flex items-center justify-center gap-2 text-[15px] font-black whitespace-nowrap">
              {t.nav.map((item, index) => {
                const targetLink = getTargetLink(index);
                const isMainActive = index === 0;

                return (
                  <li key={index}>
                    <Link
                      href={targetLink}
                      className={`group px-5 py-3.5 rounded-2xl transition-all duration-300 flex items-center gap-3 ${
                        isMainActive
                          ? 'bg-cyan-500 text-black font-black shadow-xl shadow-cyan-500/50 scale-105'
                          : 'text-white hover:text-cyan-300 hover:bg-white/10 border border-transparent hover:border-cyan-500/30'
                      }`}
                    >
                      <span className={isMainActive ? 'text-black' : 'group-hover:scale-125 transition-transform duration-300'}>
                        {navIcons[index]}
                      </span>
                      <span className="tracking-wide">
                        {item}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3 shrink-0 z-50">
            {/* إضافة زر تسجيل الدخول للتحكم */}
            <Link 
              href="/jobs-tenders/login" 
              className="hidden md:flex items-center gap-2 px-5 py-3 text-sm font-black border-2 border-cyan-500/40 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500 hover:text-black transition-all shadow-xl"
            >
              <User className="h-4 w-4" />
              <span>{lang === 'ar' ? 'دخول' : 'Login'}</span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setLangListOpen(!langListOpen)}
                className="flex items-center gap-3 px-5 py-3 text-sm font-black border-2 border-white/20 rounded-2xl bg-slate-900/90 hover:border-cyan-500 text-white transition-all shadow-2xl"
              >
                <Globe className="h-5 w-5 text-cyan-400" />
                <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${langListOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langListOpen && (
                <div className={`${t.dir === 'rtl' ? 'left-0' : 'right-0'} absolute mt-3 w-48 bg-[#0a1628] border-2 border-white/10 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden`}>
                  <button
                    onClick={() => { setLang('ar'); setLangListOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-4 text-sm font-black text-slate-200 rounded-xl hover:bg-cyan-500 hover:text-black transition-all"
                  >
                    <img src="https://flagicons.lipis.dev/flags/4x3/ae.svg" alt="AR" className="h-4 w-6 rounded-sm shadow-sm" />
                    <span>العربية</span>
                  </button>
                  <button
                    onClick={() => { setLang('en'); setLangListOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-4 text-sm font-black text-slate-200 rounded-xl hover:bg-cyan-500 hover:text-black transition-all border-t border-white/5"
                  >
                    <img src="https://flagicons.lipis.dev/flags/4x3/gb.svg" alt="EN" className="h-4 w-6 rounded-sm shadow-sm" />
                    <span>English</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* شريط الملاحة للجوال - خطوط أوضح */}
      <div className="xl:hidden relative w-full bg-[#030d1a]/95 border-b border-cyan-500/20 px-4 py-4 overflow-x-auto scrollbar-none flex items-center justify-start gap-3 z-40">
        {t.nav.map((item, index) => (
          <Link
            key={index}
            href={getTargetLink(index)}
            className={`group px-5 py-3 rounded-xl text-[13px] font-black flex items-center gap-3 whitespace-nowrap transition-all ${
              index === 0 ? 'bg-cyan-500 text-black shadow-lg' : 'text-white bg-white/10'
            }`}
          >
            <span className={index === 0 ? 'text-black' : 'text-cyan-400'}>{navIcons[index]}</span>
            <span>{item}</span>
          </Link>
        ))}
      </div>

      {/* 2. قسم الـ Hero - وضوح تام وتنسيق خطوط ممتاز */}
      <main className="flex-grow flex flex-col justify-between relative z-10">
        <section className="relative pt-24 pb-16 px-6 text-center flex-grow flex flex-col justify-center animate-in fade-in duration-1000">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-6xl mx-auto space-y-10">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black leading-[1.1] tracking-tighter text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
              {t.heroH1}
              <span className="block text-cyan-400 mt-6 font-black drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">{t.heroH1Span}</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white max-w-4xl mx-auto leading-relaxed font-bold drop-shadow-md">
              {t.heroP}
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 pt-10">
              <button className="bg-cyan-500 text-black px-12 py-5 rounded-3xl text-lg font-black hover:bg-cyan-400 hover:scale-110 transition-all duration-300 shadow-[0_20px_40px_rgba(6,182,212,0.5)]">
                {t.btnStart}
              </button>
              <button className="bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white px-12 py-5 rounded-3xl text-lg font-black hover:bg-white/20 transition-all duration-300">
                {t.btnExplore}
              </button>
              <Link href="/jobs-tenders/register" className="bg-[#051329]/90 border-2 border-cyan-500/50 text-cyan-400 px-12 py-5 rounded-3xl text-lg font-black hover:bg-cyan-500/20 transition-all duration-300 flex items-center justify-center">
                {t.btnJoin}
              </Link>
            </div>
          </div>
        </section>

        {/* 3. البطاقات التفاعلية - بياض ناصع وخطوط بارزة */}
        <section className="relative px-8 pb-14 z-20 mt-auto">
          <div className="max-w-[1400px] mx-auto bg-white/95 backdrop-blur-3xl rounded-[48px] p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/60 flex flex-col lg:flex-row gap-10">
            
            {/* البطاقة 1 */}
            <div className="flex-1 bg-slate-50 p-8 rounded-[32px] border-2 border-slate-100 shadow-inner hover:shadow-2xl transition-all duration-500 group">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-6 mb-8">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                  <Briefcase className="h-8 w-8 text-cyan-600 shrink-0 stroke-[3]"/>
                  <span>{t.card1}</span>
                </h3>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Careers</span>
              </div>
              <div className="space-y-5">
                {["BIM Engineer + Python", "Structural Engineer + Python"].map((job, idx) => (
                  <Link key={idx} href="/jobs-tenders" className="p-6 bg-white rounded-2xl border-2 border-slate-100 flex items-center justify-between hover:border-cyan-500 hover:scale-[1.02] transition-all cursor-pointer shadow-sm">
                    <div className="flex items-center gap-4">
                      <span className={`h-3.5 w-3.5 rounded-full ${idx === 0 ? 'bg-cyan-500' : 'bg-emerald-500'} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}></span>
                      <span className="text-[16px] font-black text-slate-900">{job}</span>
                    </div>
                    <ArrowLeftRight className="h-5 w-5 text-slate-300" />
                  </Link>
                ))}
              </div>
            </div>

            {/* البطاقة 2 */}
            <div className="flex-1 bg-slate-50 p-8 rounded-[32px] border-2 border-slate-100 shadow-inner hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-6 mb-8">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                  <GraduationCap className="h-8 w-8 text-cyan-600 shrink-0 stroke-[3]"/>
                  <span>{t.card2}</span>
                </h3>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Academy</span>
              </div>
              <div className="space-y-6">
                {t.training.map((item, index) => (
                  <div key={index} className="flex items-center gap-5 px-2 group">
                    <div className="h-10 w-10 rounded-2xl bg-cyan-100 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-cyan-500 transition-colors">
                      <Zap className="h-5 w-5 text-cyan-600 stroke-[3] group-hover:text-white" />
                    </div>
                    <p className="text-[17px] font-black text-slate-800 leading-tight group-hover:text-cyan-600 transition-colors">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* البطاقة 3 */}
            <div className="flex-1 bg-slate-950 p-8 rounded-[32px] border border-white/10 shadow-3xl group overflow-hidden relative">
              <div className="relative z-10">
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                  <h3 className="text-2xl font-black text-white flex items-center gap-4">
                    <Laptop className="h-8 w-8 text-cyan-400 shrink-0 stroke-[3]"/>
                    <span>{t.card3}</span>
                  </h3>
                  <span className="text-xs font-black text-cyan-500/50 uppercase tracking-widest">Tech</span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-cyan-500/50 transition-all text-center group/item">
                    <div className="bg-slate-800 text-[11px] font-mono p-2.5 rounded-lg mb-4 text-cyan-400 shadow-inner group-hover/item:bg-cyan-500 group-hover/item:text-black"># PyModel_2D</div>
                    <p className="text-sm font-black text-white">تحليل إنشائي</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-cyan-500/50 transition-all text-center group/item">
                    <div className="h-10 flex items-center justify-center mb-4">
                      <Building2 className="h-10 w-10 text-cyan-400 animate-pulse group-hover/item:scale-125 transition-transform" />
                    </div>
                    <p className="text-sm font-black text-white">BIM AI</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-20 -right-20 h-48 w-48 bg-cyan-500/10 blur-[60px] rounded-full group-hover:bg-cyan-500/20 transition-all"></div>
            </div>

          </div>
        </section>
      </main>

      {/* 4. شريط الحالة السفلي - ضخم وواضح جداً */}
      <footer className="relative w-full bg-[#030d1a]/95 border-t-2 border-cyan-500/40 py-10 px-8 text-center text-[15px] font-black text-cyan-400 z-30 backdrop-blur-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-x-14 gap-y-6">
          <div className="flex items-center gap-4">
            <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]"></span>
            <span>{lang === 'ar' ? 'المستخدمين النشطين اليوم:' : 'Active Users Today:'} <strong className="text-white text-2xl ml-2 tracking-tighter">252</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-700 text-2xl">|</span>
            <span>{lang === 'ar' ? 'مهندساً متدرباً:' : 'Trained Engineers:'} <strong className="text-white text-2xl ml-2 tracking-tighter">122</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-700 text-2xl">|</span>
            <span>{lang === 'ar' ? 'فرصة عمل متاحة:' : 'Job Opportunities:'} <strong className="text-white text-2xl ml-2 tracking-tighter">27</strong></span>
          </div>
          <span className="text-slate-600 font-black tracking-[0.3em] hidden lg:block border-l-2 border-slate-800 pl-10 ml-4">LIVE SMART STATUS 2026</span>
        </div>
      </footer>

    </div>
  );
}