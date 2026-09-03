"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase, GraduationCap, Laptop, Building2,
  ChevronDown, Zap, Globe, Home, MessageSquare,
  BookOpen, PhoneCall, Layers, ArrowLeftRight, User,
  Menu, X
} from 'lucide-react';

const localContent = {
  ar: {
    dir: "rtl",
    heroH1: "هندسة تتقن التنفيذ..",
    heroH1Span: "وذكاء يسبق الزمن.",
    heroP: "أكاديمية التدريب، البرمجيات، المشروعات، والتوظيف للمهندس العربي والعالمي.",
    btnStart: "ابدأ برمجياتك الآن",
    btnExplore: "استكشف التدريب",
    btnJoin: "انضم للبوابة الوطنية",
    card1: "ركن التوظيف والمناقصات",
    card2: "مسارات التدريب الأكاديمي",
    card3: "الأدوات والحلول البرمجية",
    nav: [
      "الرئيسية",
      "الوظائف والمناقصات",
      "الأكاديمية والتدريب",
      "البرمجيات والأدوات",
      "الخدمات الهندسية",
      "الأفكار والعلوم",
      "شاركنا رأيك",
      "تواصل معنا"
    ],
    training: [
      "إدارة المشاريع والتنفيذ",
      "برمجة BIM + علوم البيانات",
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
    card1: "Jobs & Tenders",
    card2: "Academic Training Paths",
    card3: "Software Tools & Solutions",
    nav: [
      "Home",
      "Jobs & Tenders",
      "Academy & Training",
      "Software & Tools",
      "Services",
      "Insights & Science",
      "Feedback",
      "Contact Us"
    ],
    training: [
      "Project & Construction Management",
      "BIM Programming + Data Science",
      "AI in Construction"
    ],
    status: ["Active Users Now", "Trained Engineers", "Job Opportunities"]
  }
};

export default function HomePage() {
  const [lang, setLang] = useState('ar');
  const t = localContent[lang];
  const [langListOpen, setLangListOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  const navIcons = [
    <Home key="home" className="h-4 w-4 shrink-0 stroke-[2.5]" />,
    <Briefcase key="jobs" className="h-4 w-4 shrink-0 stroke-[2.5]" />,
    <GraduationCap key="academy" className="h-4 w-4 shrink-0 stroke-[2.5]" />,
    <Laptop key="software" className="h-4 w-4 shrink-0 stroke-[2.5]" />,
    <Layers key="services" className="h-4 w-4 shrink-0 stroke-[2.5]" />,
    <BookOpen key="science" className="h-4 w-4 shrink-0 stroke-[2.5]" />,
    <MessageSquare key="feedback" className="h-4 w-4 shrink-0 stroke-[2.5]" />,
    <PhoneCall key="contact" className="h-4 w-4 shrink-0 stroke-[2.5]" />
  ];

  const getTargetLink = (index) => {
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
    <div className="min-h-screen text-white flex flex-col justify-between overflow-x-hidden antialiased select-none font-bold relative bg-slate-950">
      
      {/* خلفية الصفحة مع تباين محسن */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{ 
            backgroundImage: "url('/background-engineer.jpg')", 
            filter: "brightness(0.55) contrast(1.2)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040d1a]/80 via-[#08162a]/50 to-[#0c203e]/90 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-25"></div>
      </div>

      {/* 1. الشريط العلوي (الهيدر) - عرض كامل بدون سحب */}
      <header className="relative w-full bg-[#030d1a]/90 backdrop-blur-2xl border-b border-cyan-500/30 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* اللوجو والعلامة التجارية */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative p-2 bg-gradient-to-br from-cyan-500/30 to-blue-600/10 rounded-xl border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center transition-all group-hover:scale-105">
              <svg className="h-8 w-8 text-cyan-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5 L90 85 L10 85 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
                <path d="M50 5 L50 85" stroke="currentColor" strokeWidth="4" />
                <path d="M30 45 L70 45" stroke="currentColor" strokeWidth="4" />
                <path d="M20 65 L80 65" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="5" r="7" fill="#06b6d4" />
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-xl text-white tracking-tight">SMART ENG</span>
              <span className="text-[11px] text-cyan-400 font-bold tracking-wider">
                {lang === 'ar' ? 'الهندسة الذكية' : 'Smart Engineering'}
              </span>
            </div>
          </Link>

          {/* القائمة الرئيسية - مرتبة ومباشرة بدون سحب */}
          <nav className="hidden lg:flex items-center justify-center flex-1 px-2">
            <ul className="flex items-center justify-center gap-1 xl:gap-2 text-[13px] font-bold">
              {t.nav.map((item, index) => {
                const targetLink = getTargetLink(index);
                const isMainActive = index === 0;

                return (
                  <li key={index}>
                    <Link
                      href={targetLink}
                      className={`px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                        isMainActive
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/30'
                          : 'text-slate-200 hover:text-cyan-300 hover:bg-white/10'
                      }`}
                    >
                      <span className={isMainActive ? 'text-slate-950' : 'text-cyan-400'}>
                        {navIcons[index]}
                      </span>
                      <span>{item}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* أدوات التحكم (تسجيل الدخول والتغيير اللغة والموبايل) */}
          <div className="flex items-center gap-2 shrink-0 z-50">
            <Link 
              href="/jobs-tenders/login" 
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold border border-cyan-500/40 rounded-xl bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-md"
            >
              <User className="h-4 w-4" />
              <span>{lang === 'ar' ? 'دخول' : 'Login'}</span>
            </Link>

            {/* محول اللغة */}
            <div className="relative">
              <button
                onClick={() => setLangListOpen(!langListOpen)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold border border-white/20 rounded-xl bg-slate-900/90 hover:border-cyan-500 text-white transition-all"
              >
                <Globe className="h-4 w-4 text-cyan-400" />
                <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${langListOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langListOpen && (
                <div className={`${t.dir === 'rtl' ? 'left-0' : 'right-0'} absolute mt-2 w-36 bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-1 z-50`}>
                  <button
                    onClick={() => { setLang('ar'); setLangListOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-slate-200 rounded-lg hover:bg-cyan-500 hover:text-slate-950 transition-all"
                  >
                    <span>العربية</span>
                  </button>
                  <button
                    onClick={() => { setLang('en'); setLangListOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-slate-200 rounded-lg hover:bg-cyan-500 hover:text-slate-950 transition-all border-t border-white/5"
                  >
                    <span>English</span>
                  </button>
                </div>
              )}
            </div>

            {/* زر القائمة للشاشات الصغيرة */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-cyan-400 hover:text-white bg-slate-900 border border-white/10 rounded-xl"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* قائمة الموبايل المنسدلة - تظهر جميع القوائم دفعة واحدة في شبكة بدون سحب */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-cyan-500/20 bg-[#040d1a]/98 px-4 py-4 grid grid-cols-2 gap-2 text-xs">
            {t.nav.map((item, index) => (
              <Link
                key={index}
                href={getTargetLink(index)}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-3 rounded-xl flex items-center gap-2 font-bold transition-all ${
                  index === 0 ? 'bg-cyan-500 text-slate-950 col-span-2 justify-center' : 'text-slate-200 bg-white/5 hover:bg-cyan-500/20'
                }`}
              >
                <span className={index === 0 ? 'text-slate-950' : 'text-cyan-400'}>{navIcons[index]}</span>
                <span>{item}</span>
              </Link>
            ))}
            <Link
              href="/jobs-tenders/login"
              onClick={() => setMobileMenuOpen(false)}
              className="col-span-2 p-3 mt-2 rounded-xl border border-cyan-500/40 text-center font-bold text-cyan-400 bg-cyan-500/10"
            >
              {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </Link>
          </div>
        )}
      </header>

      {/* 2. قسم الرئيسية (Hero) */}
      <main className="flex-grow flex flex-col justify-between relative z-10">
        <section className="relative pt-16 pb-12 px-6 text-center flex-grow flex flex-col justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-5xl mx-auto space-y-8">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-tight tracking-tight text-white drop-shadow-lg">
              {t.heroH1}
              <span className="block text-cyan-400 mt-2 font-black drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">{t.heroH1Span}</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-semibold">
              {t.heroP}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <button className="bg-cyan-500 text-slate-950 px-8 py-4 rounded-2xl text-base font-black hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_10px_30px_rgba(6,182,212,0.4)]">
                {t.btnStart}
              </button>
              <button className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-8 py-4 rounded-2xl text-base font-bold hover:bg-white/20 transition-all">
                {t.btnExplore}
              </button>
              <Link href="/jobs-tenders/register" className="bg-[#051329] border border-cyan-500/40 text-cyan-400 px-8 py-4 rounded-2xl text-base font-bold hover:bg-cyan-500/20 transition-all flex items-center justify-center">
                {t.btnJoin}
              </Link>
            </div>
          </div>
        </section>

        {/* 3. البطاقات التفاعلية */}
        <section className="relative px-4 sm:px-8 pb-12 z-20 mt-auto">
          <div className="max-w-[1300px] mx-auto bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl flex flex-col lg:flex-row gap-6">
            
            {/* البطاقة 1: الوظائف */}
            <div className="flex-1 bg-slate-950/60 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-cyan-400 shrink-0" />
                  <span>{t.card1}</span>
                </h2>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Careers</span>
              </div>
              <div className="space-y-3">
                {["BIM Engineer + Python", "Structural Engineer + Python"].map((job, idx) => (
                  <Link key={idx} href="/jobs-tenders" className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between hover:border-cyan-500 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${idx === 0 ? 'bg-cyan-400' : 'bg-emerald-400'}`}></span>
                      <span className="text-sm font-bold text-slate-200">{job}</span>
                    </div>
                    <ArrowLeftRight className="h-4 w-4 text-slate-500" />
                  </Link>
                ))}
              </div>
            </div>

            {/* البطاقة 2: الأكاديمية */}
            <div className="flex-1 bg-slate-950/60 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-cyan-400 shrink-0" />
                  <span>{t.card2}</span>
                </h2>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academy</span>
              </div>
              <div className="space-y-4">
                {t.training.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <Zap className="h-4 w-4 text-cyan-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* البطاقة 3: البرمجيات */}
            <div className="flex-1 bg-slate-950/60 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <Laptop className="h-6 w-6 text-cyan-400 shrink-0" />
                    <span>{t.card3}</span>
                  </h2>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tech</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
                    <div className="text-[10px] font-mono p-1.5 rounded bg-slate-950 text-cyan-400 mb-2"># PyModel_2D</div>
                    <p className="text-xs font-bold text-slate-200">تحليل إنشائي</p>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center flex flex-col items-center justify-center">
                    <Building2 className="h-6 w-6 text-cyan-400 mb-1" />
                    <p className="text-xs font-bold text-slate-200">BIM AI</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* 4. شريط الحالة السفلي */}
      <footer className="relative w-full bg-[#030d1a]/95 border-t border-cyan-500/30 py-6 px-6 text-center text-xs font-bold text-cyan-400 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2 mx-auto lg:mx-0">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{lang === 'ar' ? 'المستخدمين النشطين اليوم:' : 'Active Users Today:'} <strong className="text-white text-base ml-1">252</strong></span>
          </div>
          <div className="flex items-center gap-2 mx-auto lg:mx-0">
            <span>{lang === 'ar' ? 'مهندساً متدرباً:' : 'Trained Engineers:'} <strong className="text-white text-base ml-1">122</strong></span>
          </div>
          <div className="flex items-center gap-2 mx-auto lg:mx-0">
            <span>{lang === 'ar' ? 'فرصة عمل متاحة:' : 'Job Opportunities:'} <strong className="text-white text-base ml-1">27</strong></span>
          </div>
          <span className="text-slate-500 text-[11px] font-bold tracking-widest hidden lg:block">LIVE SMART STATUS 2026</span>
        </div>
      </footer>

    </div>
  );
}