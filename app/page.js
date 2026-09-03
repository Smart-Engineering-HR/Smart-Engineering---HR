"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase, GraduationCap, Laptop, Building2,
  ChevronDown, Zap, Globe, Home, MessageSquare,
  BookOpen, PhoneCall, Layers, ArrowLeftRight, User,
  Menu, X, Loader2
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
    statusLabels: {
      activeUsers: "المستخدمين النشطين اليوم:",
      trainedEngineers: "مهندساً متدرباً:",
      jobOpportunities: "فرصة عمل متاحة:"
    }
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
    statusLabels: {
      activeUsers: "Active Users Today:",
      trainedEngineers: "Trained Engineers:",
      jobOpportunities: "Job Opportunities:"
    }
  }
};

export default function HomePage() {
  const [lang, setLang] = useState('ar');
  const t = localContent[lang];
  const [langListOpen, setLangListOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // حالات الإحصائيات - تبدأ بـ null للتأكد من عدم عرض أي رقم وهمي قبل الجلب الحقيقي
  const [stats, setStats] = useState({
    activeUsers: null,
    trainedEngineers: null,
    jobOpportunities: null
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // جلب البيانات الحقيقية فقط من خادم قاعدة البيانات
  useEffect(() => {
    let isMounted = true;

    async function fetchDatabaseStats() {
      try {
        setLoadingStats(true);
        const res = await fetch('/api/stats', { cache: 'no-store' });
        
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setStats({
              activeUsers: data.activeUsers ?? 0,
              trainedEngineers: data.trainedEngineers ?? 0,
              jobOpportunities: data.jobOpportunities ?? 0
            });
          }
        } else {
          if (isMounted) {
            setStats({ activeUsers: 0, trainedEngineers: 0, jobOpportunities: 0 });
          }
        }
      } catch (error) {
        if (isMounted) {
          setStats({ activeUsers: 0, trainedEngineers: 0, jobOpportunities: 0 });
        }
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    }

    fetchDatabaseStats();

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  const navIcons = [
    <Home key="home" className="h-3.5 w-3.5 xl:h-4 xl:w-4 shrink-0 stroke-[2.5]" />,
    <Briefcase key="jobs" className="h-3.5 w-3.5 xl:h-4 xl:w-4 shrink-0 stroke-[2.5]" />,
    <GraduationCap key="academy" className="h-3.5 w-3.5 xl:h-4 xl:w-4 shrink-0 stroke-[2.5]" />,
    <Laptop key="software" className="h-3.5 w-3.5 xl:h-4 xl:w-4 shrink-0 stroke-[2.5]" />,
    <Layers key="services" className="h-3.5 w-3.5 xl:h-4 xl:w-4 shrink-0 stroke-[2.5]" />,
    <BookOpen key="science" className="h-3.5 w-3.5 xl:h-4 xl:w-4 shrink-0 stroke-[2.5]" />,
    <MessageSquare key="feedback" className="h-3.5 w-3.5 xl:h-4 xl:w-4 shrink-0 stroke-[2.5]" />,
    <PhoneCall key="contact" className="h-3.5 w-3.5 xl:h-4 xl:w-4 shrink-0 stroke-[2.5]" />
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
    <div className="min-h-screen text-white flex flex-col justify-between overflow-x-hidden antialiased select-none font-black relative bg-slate-950">
      
      {/* خلفية الصفحة */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{ 
            backgroundImage: "url('/background-engineer.jpg')", 
            filter: "brightness(0.55) contrast(1.2)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040d1a]/90 via-[#08162a]/60 to-[#0c203e]/95 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>
      </div>

      {/* الشريط العلوي */}
      <header className="relative w-full bg-[#030d1a]/95 backdrop-blur-2xl border-b border-cyan-500/30 sticky top-0 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="w-full px-2 sm:px-4 xl:px-6 py-2 flex items-center justify-between gap-1 xl:gap-2">
          
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="p-1.5 bg-gradient-to-br from-cyan-500/30 to-blue-600/10 rounded-xl border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center transition-all group-hover:scale-105">
              <svg className="h-6 w-6 text-cyan-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5 L90 85 L10 85 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
                <path d="M50 5 L50 85" stroke="currentColor" strokeWidth="4" />
                <path d="M30 45 L70 45" stroke="currentColor" strokeWidth="4" />
                <path d="M20 65 L80 65" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="5" r="7" fill="#06b6d4" />
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-base xl:text-lg text-white tracking-wide">SMART ENG</span>
              <span className="text-[9px] xl:text-[10px] text-cyan-400 font-extrabold tracking-wider">
                {lang === 'ar' ? 'الهندسة الذكية' : 'Smart Engineering'}
              </span>
            </div>
          </Link>

          {/* القائمة الرئيسية الأفقیة كاملة */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-1 min-w-0">
            <ul className="flex items-center justify-center gap-0.5 xl:gap-1.5 w-full">
              {t.nav.map((item, index) => {
                const targetLink = getTargetLink(index);
                const isMainActive = index === 0;

                return (
                  <li key={index} className="shrink-0">
                    <Link
                      href={targetLink}
                      className={`px-1.5 lg:px-2 xl:px-2.5 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1 xl:gap-1.5 whitespace-nowrap text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px] font-black tracking-tight ${
                        isMainActive
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/40 border border-cyan-400'
                          : 'text-slate-100 hover:text-cyan-300 hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30'
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

          <div className="flex items-center gap-1.5 shrink-0 z-50">
            <Link 
              href="/jobs-tenders/login" 
              className="hidden sm:flex items-center gap-1 px-2.5 xl:px-3 py-1.5 text-xs font-black border border-cyan-500/50 rounded-xl bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-sm whitespace-nowrap"
            >
              <User className="h-3.5 w-3.5 stroke-[3]" />
              <span>{lang === 'ar' ? 'دخول' : 'Login'}</span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setLangListOpen(!langListOpen)}
                className="flex items-center gap-1 px-2.5 xl:px-3 py-1.5 text-xs font-black border border-white/20 rounded-xl bg-slate-900/90 hover:border-cyan-500 text-white transition-all shadow-sm whitespace-nowrap"
              >
                <Globe className="h-3.5 w-3.5 text-cyan-400 stroke-[2.5]" />
                <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${langListOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langListOpen && (
                <div className={`${t.dir === 'rtl' ? 'left-0' : 'right-0'} absolute mt-2 w-36 bg-slate-900 border border-cyan-500/30 rounded-xl shadow-2xl p-1 z-50`}>
                  <button
                    onClick={() => { setLang('ar'); setLangListOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs font-black text-slate-200 rounded-lg hover:bg-cyan-500 hover:text-slate-950 transition-all"
                  >
                    <span>العربية</span>
                  </button>
                  <button
                    onClick={() => { setLang('en'); setLangListOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs font-black text-slate-200 rounded-lg hover:bg-cyan-500 hover:text-slate-950 transition-all border-t border-white/10"
                  >
                    <span>English</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-cyan-400 hover:text-white bg-slate-900 border border-cyan-500/30 rounded-xl"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 stroke-[3]" /> : <Menu className="h-5 w-5 stroke-[3]" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-cyan-500/30 bg-[#040d1a]/98 px-4 py-4 grid grid-cols-2 gap-2 text-xs">
            {t.nav.map((item, index) => (
              <Link
                key={index}
                href={getTargetLink(index)}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-3 rounded-xl flex items-center gap-2 font-black text-xs transition-all ${
                  index === 0 ? 'bg-cyan-500 text-slate-950 col-span-2 justify-center shadow-md' : 'text-slate-100 bg-white/5 border border-white/10 hover:bg-cyan-500/20'
                }`}
              >
                <span className={index === 0 ? 'text-slate-950' : 'text-cyan-400'}>{navIcons[index]}</span>
                <span>{item}</span>
              </Link>
            ))}
            <Link
              href="/jobs-tenders/login"
              onClick={() => setMobileMenuOpen(false)}
              className="col-span-2 p-3 mt-1 rounded-xl border border-cyan-500/50 text-center font-black text-cyan-400 bg-cyan-500/10 text-sm"
            >
              {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </Link>
          </div>
        )}
      </header>

      {/* قسم Hero */}
      <main className="flex-grow flex flex-col justify-between relative z-10">
        <section className="relative pt-16 pb-12 px-6 text-center flex-grow flex flex-col justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-5xl mx-auto space-y-8">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-tight tracking-tight text-white drop-shadow-2xl">
              {t.heroH1}
              <span className="block text-cyan-400 mt-3 font-black drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">{t.heroH1Span}</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-slate-200 max-w-4xl mx-auto leading-relaxed font-black">
              {t.heroP}
            </p>
            
            <div className="flex flex-wrap justify-center gap-5 pt-6">
              <button className="bg-cyan-500 text-slate-950 px-10 py-5 rounded-3xl text-lg font-black hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_15px_35px_rgba(6,182,212,0.5)]">
                {t.btnStart}
              </button>
              <button className="bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white px-10 py-5 rounded-3xl text-lg font-black hover:bg-white/20 transition-all">
                {t.btnExplore}
              </button>
              <Link href="/jobs-tenders/register" className="bg-[#051329] border-2 border-cyan-500/40 text-cyan-400 px-10 py-5 rounded-3xl text-lg font-black hover:bg-cyan-500/20 transition-all flex items-center justify-center">
                {t.btnJoin}
              </Link>
            </div>
          </div>
        </section>

        {/* البطاقات التفاعلية */}
        <section className="relative px-4 sm:px-8 pb-14 z-20 mt-auto">
          <div className="max-w-[1350px] mx-auto bg-slate-900/95 backdrop-blur-3xl rounded-[36px] p-6 sm:p-10 border-2 border-slate-800 shadow-2xl flex flex-col lg:flex-row gap-8">
            
            <div className="flex-1 bg-slate-950/70 p-7 rounded-3xl border-2 border-slate-800/80 hover:border-cyan-500/50 transition-all">
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Briefcase className="h-7 w-7 text-cyan-400 shrink-0 stroke-[2.5]" />
                  <span>{t.card1}</span>
                </h2>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Careers</span>
              </div>
              <div className="space-y-4">
                {["BIM Engineer + Python", "Structural Engineer + Python"].map((job, idx) => (
                  <Link key={idx} href="/jobs-tenders" className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-cyan-500 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${idx === 0 ? 'bg-cyan-400' : 'bg-emerald-400'}`}></span>
                      <span className="text-base font-black text-slate-200">{job}</span>
                    </div>
                    <ArrowLeftRight className="h-5 w-5 text-slate-500" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex-1 bg-slate-950/70 p-7 rounded-3xl border-2 border-slate-800/80 hover:border-cyan-500/50 transition-all">
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <GraduationCap className="h-7 w-7 text-cyan-400 shrink-0 stroke-[2.5]" />
                  <span>{t.card2}</span>
                </h2>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Academy</span>
              </div>
              <div className="space-y-4">
                {t.training.map((item, index) => (
                  <div key={index} className="flex items-center gap-3.5 group">
                    <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <Zap className="h-5 w-5 text-cyan-400 stroke-[2.5]" />
                    </div>
                    <p className="text-base font-black text-slate-300 group-hover:text-cyan-400 transition-colors">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 bg-slate-950/70 p-7 rounded-3xl border-2 border-slate-800/80 hover:border-cyan-500/50 transition-all relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-6">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <Laptop className="h-7 w-7 text-cyan-400 shrink-0 stroke-[2.5]" />
                    <span>{t.card3}</span>
                  </h2>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Tech</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 text-center">
                    <div className="text-xs font-mono p-2 rounded-lg bg-slate-950 text-cyan-400 mb-3 font-bold"># PyModel_2D</div>
                    <p className="text-sm font-black text-slate-200">تحليل إنشائي</p>
                  </div>
                  <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center">
                    <Building2 className="h-8 w-8 text-cyan-400 mb-2" />
                    <p className="text-sm font-black text-slate-200">BIM AI</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* شريط الإحصائيات الفعلي - يتحدث مع قاعدة البيانات فقط */}
      <footer className="relative w-full bg-[#030d1a]/95 border-t-2 border-cyan-500/40 py-4 px-8 text-cyan-400 z-30 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4 text-sm font-black">
          
          <div className="flex items-center gap-2.5 mx-auto xl:mx-0">
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-cyan-400">{t.statusLabels.activeUsers}</span>
            {loadingStats || stats.activeUsers === null ? (
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
            ) : (
              <strong className="text-white text-xl font-black">{stats.activeUsers}</strong>
            )}
          </div>

          <div className="flex items-center gap-2.5 mx-auto xl:mx-0">
            <span className="text-cyan-400">{t.statusLabels.trainedEngineers}</span>
            {loadingStats || stats.trainedEngineers === null ? (
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
            ) : (
              <strong className="text-white text-xl font-black">{stats.trainedEngineers}</strong>
            )}
          </div>

          <div className="flex items-center gap-2.5 mx-auto xl:mx-0">
            <span className="text-cyan-400">{t.statusLabels.jobOpportunities}</span>
            {loadingStats || stats.jobOpportunities === null ? (
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
            ) : (
              <strong className="text-white text-xl font-black">{stats.jobOpportunities}</strong>
            )}
          </div>

          <span className="text-slate-500 text-xs font-black tracking-widest hidden xl:block">LIVE SMART STATUS 2026</span>
        </div>
      </footer>

    </div>
  );
}