"use client";

import React from 'react';
import { 
  Building2, Home, Cpu, Award, ArrowRight,
  Layers, CheckSquare, ShieldAlert, FileSpreadsheet,
  Compass, Layout, Image, Trees, 
  Terminal, Database, GraduationCap, MonitorPlay, 
  Zap, Recycle, BarChart3, Binary
} from 'lucide-react';

export default function ServicesPage() {
  
  // هيكلية بيانات الخدمات الأربعة الرئيسية وفقاً للتعليمات الصارمة
  const serviceCategories = [
    {
      id: "civil-structural",
      title: "1. الخدمات الإنشائية والمدنية",
      icon: <Building2 className="h-8 w-8 text-cyan-400" />,
      gradient: "from-cyan-500/20 to-blue-600/5",
      borderColor: "border-cyan-500/30",
      items: [
        {
          title: "التصميم والتحليل الإنشائي",
          icon: <Layers className="h-5 w-5 text-cyan-400" />,
          desc: "تصميم المنشآت الخرسانية والمعدنية وفق الأكواد العالمية (ACI, BS, Eurocodes)."
        },
        {
          title: "مراجعة وتدقيق المخططات (Third Party)",
          icon: <ShieldAlert className="h-5 w-5 text-cyan-400" />,
          desc: "تقديم خدمة التدقيق الفني لضمان السلامة وتقليل التكاليف الإجمالية للهيكل."
        },
        {
          title: "حساب الكميات وتقدير التكلفة (QS)",
          icon: <FileSpreadsheet className="h-5 w-5 text-cyan-400" />,
          desc: "إعداد جداول الكميات (BOQ) بدقة عالية لضبط ميزانية المشاريع."
        },
        {
          title: "تقييم وتدعيم المنشآت",
          icon: <CheckSquare className="h-5 w-5 text-cyan-400" />,
          desc: "دراسة المباني القائمة وتقديم حلول التدعيم الإنشائي وإعادة التأهيل."
        }
      ]
    },
    {
      id: "architectural-design",
      title: "2. الهندسة المعمارية والتصميم",
      icon: <Compass className="h-8 w-8 text-blue-400" />,
      gradient: "from-blue-500/20 to-indigo-600/5",
      borderColor: "border-blue-500/30",
      items: [
        {
          title: "التصميم المعماري الحديث",
          icon: <Layout className="h-5 w-5 text-blue-400" />,
          desc: "ابتكار تصاميم (فلل، مباني تجارية) تركز على استغلال المساحات والإضاءة الطبيعية."
        },
        {
          title: "التصميم الداخلي و 3D Rendering",
          icon: <Image className="h-5 w-5 text-blue-400" />,
          desc: "تقديم صور واقعية وفيديوهات توضيحية للمشاريع قبل البدء في التنفيذ الميداني."
        },
        {
          title: "تنسيق المواقع (Landscape)",
          icon: <Trees className="h-5 w-5 text-blue-400" />,
          desc: "تصميم المساحات الخارجية والحدائق بشكل جمالي وعملي يتناغم مع البيئة."
        }
      ]
    },
    {
      id: "smart-tech",
      title: "3. التحول الرقمي وأتمتة الهندسة",
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      gradient: "from-yellow-500/20 to-orange-600/5",
      borderColor: "border-yellow-500/30",
      items: [
        {
          title: "تطوير برمجيات الهندسة المخصصة",
          icon: <Terminal className="h-5 w-5 text-yellow-400" />,
          desc: "تصميم أدوات برمجية (بـ Python و Flutter) لحل مشاكل هندسية معقدة."
        },
        {
          title: "أتمتة التصميم الإنشائي",
          icon: <Binary className="h-5 w-5 text-yellow-400" />,
          desc: "تحويل الحسابات اليدوية المتكررة إلى سكربتات برمجية سريعة ودقيقة للغاية."
        },
        {
          title: "تقليل الهالك (Waste Management)",
          icon: <Recycle className="h-5 w-5 text-yellow-400" />,
          desc: "حلول برمجية مثل (Rebar Zero-Waste) لتقليل فاقد الحديد بنسبة تصل لـ 20%."
        },
        {
          title: "نمذجة معلومات البناء (BIM)",
          icon: <Database className="h-5 w-5 text-emerald-400" />,
          desc: "تحويل المخططات إلى نماذج ثلاثية الأبعاد ذكية وإدارة المشاريع رقمياً."
        }
      ]
    },
    {
      id: "academy",
      title: "4. التدريب والتطوير المهني (Academy)",
      icon: <GraduationCap className="h-8 w-8 text-purple-400" />,
      gradient: "from-purple-500/20 to-pink-600/5",
      borderColor: "border-purple-500/30",
      items: [
        {
          title: "دورات Python for Engineers",
          icon: <MonitorPlay className="h-5 w-5 text-purple-400" />,
          desc: "تدريب المهندسين على البرمجة الهندسية لرفع كفاءة الإنتاج وأتمتة المهام."
        },
        {
          title: "برامج التحليل الإنشائي",
          icon: <Award className="h-5 w-5 text-purple-400" />,
          desc: "تأهيل المهندسين على أحدث برامج التحليل العالمية لمواكبة متطلبات السوق."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#020813] text-white font-black antialiased flex flex-col justify-between" dir="rtl">
      
      {/* شريط التنقل العلوي - تصميم فاتح وشفاف جداً (تم حذف زر بوابة التوظيف كما طلبت) */}
      <header className="w-full bg-white/5 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Cpu className="h-7 w-7 text-cyan-400" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-2xl tracking-tighter text-white uppercase">Smart <span className="text-cyan-400">Eng</span></span>
              <span className="text-[10px] text-cyan-100/60 font-black tracking-[0.2em]">Engineering Tech Hub</span>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <a href="/" className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm flex items-center gap-2 font-black">
              <Home className="h-4 w-4" /> العودة للرئيسية
            </a>
          </nav>
        </div>
      </header>

      {/* المحتوى الرئيسي للخدمات */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-16 space-y-20">
        
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
            خدماتنا <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">الاستشارية</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium">
            حلول هندسية متكاملة تدمج بين الخبرة الإنشائية العميقة وأحدث تقنيات التحول الرقمي.
          </p>
        </div>

        {/* شبكة الكروت الذكية - Service Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {serviceCategories.map((category) => (
            <div 
              key={category.id} 
              className={`group relative bg-[#040f21] border ${category.borderColor} p-8 md:p-10 rounded-[40px] overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] hover:scale-[1.01] hover:border-cyan-400/60`}
            >
              {/* توهج خلفي ديناميكي عند Hover */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative z-10 space-y-10">
                {/* Header: أيقونة + عنوان الخدمة */}
                <div className="flex items-center gap-6">
                  <div className={`p-4 bg-gradient-to-br ${category.gradient} rounded-2xl border border-white/5 shadow-inner`}>
                    {category.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white group-hover:text-cyan-400 transition-colors">
                    {category.title}
                  </h2>
                </div>

                {/* هيكل الخدمات الفرعية (Brief) */}
                <div className="space-y-8">
                  {category.items.map((item, index) => (
                    <div key={index} className="flex gap-5 items-start group/item">
                      <div className="mt-1.5 p-2 bg-white/5 rounded-xl border border-white/5 transition-colors group-hover/item:border-cyan-500/30">
                        {item.icon}
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-xl font-black text-slate-100 group-hover/item:text-cyan-300 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-md">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Button: زر طلب الخدمة */}
                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <button className="flex items-center gap-3 text-cyan-400 font-black text-sm uppercase tracking-widest hover:text-white transition-all group-hover:translate-x-[-10px]">
                    تفاصيل أكثر <ArrowRight className="h-5 w-5 rotate-180" />
                  </button>
                  <a href="/contact" className="px-6 py-3 bg-white/5 hover:bg-cyan-500 hover:text-black border border-white/10 rounded-xl text-sm transition-all font-black">
                    طلب الخدمة
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ذيل الصفحة */}
      <footer className="w-full bg-[#030d1a] border-t border-white/5 py-12 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Cpu className="h-6 w-6 text-cyan-500" />
            <span className="text-sm font-black text-slate-400 tracking-tighter uppercase">Smart Engineering Platform © 2026</span>
          </div>
          <p className="text-xs text-slate-500 font-bold max-w-xs text-right leading-relaxed">
            المنصة الأولى المخصصة لدمج الحلول البرمجية المتطورة في صلب العمل الهندسي الإنشائي.
          </p>
        </div>
      </footer>

    </div>
  );
}