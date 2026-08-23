import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const initialData = [
  {
    id: "1",
    category: "FUTURE_ENG",
    title: "الذكاء الاصطناعي والتنبؤ بانهيار التربة",
    shortDesc: "تطبيقات Machine Learning للتنبؤ بانهيار التربة وتحسين تكلفة المنشآت الجيوتقنية.",
    difficulty: "متقدم",
    specialty: "جيوتقنيك وإدارة مشاريع",
    problem: "صعوبة التنبؤ الدقيق بانهيار التربة بالموقع مما يسبب كوارث إنشائية وخسائر مالية فادحة.",
    science: "تعتمد النظرية على تحليل بيانات الجسات السابقة وتدريب خوارزميات الغابات العشوائية (Random Forests) وشبكات العصبونات الاصطناعية على معطيات الإجهاد والرطوبة وزاوية الاحتكاك الداخلي.",
    smartIdea: "تحويل قيم الاختبارات الحقلية الفورية (SPT) إلى مصفوفات رقمية وإدخالها لنموذج تنبؤي فوري يعطي نسبة أمان التربة في 30 ثانية.",
    application: "1. جمع بيانات الجسات الحقلية. 2. تشغيل كود البايثون المرفق. 3. استخراج منحنى الهبوط وعامل الأمان التنبؤي.",
    codeSnippet: "import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\n\n# sample inputs: [Moisture, Stress, Depth]\nX = np.array([[12, 150, 5], [22, 90, 8], [15, 200, 3]])\ny = np.array([1, 0, 1]) # 1: Safe, 0: Collapse Risk\n\nmodel = RandomForestClassifier()\nmodel.fit(X, y)\nprint('Soil Stability Predict:', model.predict([[18, 110, 6]]))",
    toolLink: "/software/geotech-predictor",
    hasCalculator: true,
    calcType: "soil_safety"
  },
  {
    id: "2",
    category: "FUTURE_ENG",
    title: "الطباعة ثلاثية الأبعاد للمنازل بالخرسانة المطبوعة",
    shortDesc: "أحدث الأبحاث في بناء المنازل بالخرسانة المطبوعة لتقليل الفقد والوقت الإنشائي.",
    difficulty: "خبير",
    specialty: "مواد وإنشاءات",
    problem: "ارتفاع تكلفة القوالب الخشبية التقليدية واستهلاكها لزمن طويل جداً في المنشآت ذات الأشكال المعقدة.",
    science: "استخدام ريولوجيا الخرسانة (Concrete Rheology) لابتكار خلطات ذات سيولة عالية أثناء الضخ، وتصلد سريع جداً فور الخروج من فوهة الطابعة لتحمل الطبقات التالية.",
    smartIdea: "برمجة روبوت إنشائي بذراع سداسية المحاور يقرأ ملفات الـ G-code مباشرة من التصميم المعماري ويصب الخرسانة بدقة مليمترية.",
    application: "تحميل التصميم بصيغة STL، تشغيل نظام الضخ التلقائي، ومراقبة جفاف الطبقات دورياً.",
    codeSnippet: "G1 X100 Y50 Z0.4 F3000 ; Extrude layer 1\nG1 X150 Y50 Z0.8 F3000 ; Extrude layer 2 with offset",
    toolLink: "/software/3d-print-slicer",
    hasCalculator: false,
    calcType: "soil_safety"
  },
  {
    id: "3",
    category: "FUTURE_ENG",
    title: "التوأم الرقمي (Digital Twin) وربط حسّاسات BIM",
    shortDesc: "شرح كيفية ربط حساسات الموقع بنموذج الـ BIM لمراقبة المبنى لحظياً.",
    difficulty: "خبير",
    specialty: "تكنولوجيا البناء",
    problem: "عدم القدرة على معرفة الإجهادات الحقيقية التي تتعرض لها العناصر الإنشائية الحساسة بعد التشغيل.",
    science: "إنشاء اتصال إنترنت الأشياء (IoT) يربط المستشعرات الفيزيائية بنموذج معلومات المبنى الرقمي لمعالجة البيانات عبر السحابة.",
    smartIdea: "تطوير لوحة تحكم ذكية تلون أعضاء نموذج الـ BIM باللون الأحمر فوراً عند تخطي الإجهاد المسموح.",
    application: "تركيب مستشعرات انفعال (Strain Gauges)، ربط الـ API بالنموذج، وتفعيل التنبيهات الذكية.",
    codeSnippet: "import requests\n\ndef check_building_stress(sensor_id):\n    res = requests.get(f'https://api.smart-eng/sensors/{sensor_id}')\n    if res.json()['stress'] > 14.5:\n        return 'ALERT: Critical Stress Level'\n    return 'System Normal'",
    toolLink: "/software/bim-twin",
    hasCalculator: false,
    calcType: "soil_safety"
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
    codeSnippet: "def value_engineering(as_original, as_optimized):\n    saving = ((as_original - as_optimized) / as_original) * 100\n    return f'نسبة التوفير في التسليح: {saving:.2f}%'\n\nprint(value_engineering(1200, 950))",
    toolLink: "/software/rebar-optimizer",
    hasCalculator: true,
    calcType: "value_eng"
  },
  {
    id: "5",
    category: "EXECUTION_SECRETS",
    title: "إدارة الهالك وتقليل الفواقد بالخوارزميات",
    shortDesc: "علوم تقليل الفواقد في المواد باستخدام الخوارزميات البرمجية والتسليح المثالي.",
    difficulty: "متقدم",
    specialty: "إدارة تشييد",
    problem: "هدر كميات كبيرة من حديد التسليح عند تقطيع الأسياخ بالطرق العشوائية بالموقع.",
    science: "استخدام خوارزمية التقطيع أحادية البعد (1D Cutting Stock Problem) القائمة على البرمجة الخطية.",
    smartIdea: "إدخال جدول أطوال الأسياخ المطلوبة للبرنامج للحصول على خريطة التقطيع التي تحقق أقل نسبة هالك ممكنة.",
    application: "تصدير جدول التقطيع للمشرف الإنشائي بالموقع والتنفيذ وفق المخطط الخوارزمي.",
    codeSnippet: "# Python Linear Optimizer Logic Sample\ncut_lengths = [3.5, 4.2, 2.8]\nstock_length = 12.0\n# Computes optimal combinations to approach 12.0m",
    toolLink: "/software/waste-minimizer",
    hasCalculator: false,
    calcType: "soil_safety"
  },
  {
    id: "6",
    category: "EXECUTION_SECRETS",
    title: "تحليل الانهيارات والأخطاء الإنشائية برمجياً",
    shortDesc: "دروس مستفادة من أخطاء هندسية عالمية وكيفية تجنبها وتفاديها خوارزمياً.",
    difficulty: "خبير",
    specialty: "تحليل إنشائي",
    problem: "حدوث انهيارات مفاجئة بسبب إغفال ظاهرة الرنين الإنشائي أو الانبعاج غير الخطي.",
    science: "تحليل النماذج الديناميكية واستجابة العناصر للأحمال الترددية وتغير الخواص عبر الزمن.",
    smartIdea: "معايرة مصفوفات الجساءة برمجياً لتشغيل محاكاة انهيار افتراضية قبل البدء في التنفيذ الفعلي.",
    application: "مراجع عوامل الأمان الديناميكية واستبدال المفاصل الحرجة بتفاصيل إنشائية مرنة.",
    codeSnippet: "def check_buckling_load(P_actual, P_critical):\n    if P_actual >= P_critical:\n        return 'CRITICAL FAILURE: Structural Buckling Detected'\n    return 'SAFE'",
    toolLink: "/software/failure-analyzer",
    hasCalculator: false,
    calcType: "soil_safety"
  },
  {
    id: "7",
    category: "PROG_FOR_ENG",
    title: "أتمتة التصميم الإنشائي باستخدام Python",
    shortDesc: "دروس حول استخدام Python لتنفيذ مهام التصميم التي تستغرق ساعات في دقائق معدودة.",
    difficulty: "متقدم",
    specialty: "برمجة هندسية",
    problem: "استهلاك مئات الساعات في نمذجة القواعد والأعمدة يدوياً وتحديد قطاعاتها.",
    science: "استخدام المكتبات الرياضية مثل NumPy و SciPy للربط المباشر بين معادلات التصميم وجداول الأبعاد.",
    smartIdea: "سكربت بايثون يقرأ أحمال الأعمدة من ملف Excel ويقوم بتصميم القطاعات وتصدير التقرير فوراً.",
    application: "1. تجهيز ملف الأحمال. 2. تشغيل السكربت. 3. استلام مذكرة الحسابات وكتالوج القطاعات.",
    codeSnippet: "import pandas as pd\n\ndef auto_design_column(pu, fcu=30, fy=400):\n    # Equation: Pu = 0.35*fcu*Ac + 0.67*fy*Asc\n    ac_required = (pu * 1000) / (0.35 * fcu + 0.67 * fy * 0.01)\n    return np.sqrt(ac_required)\n\nprint('جانب العمود المربع المقترح (مم):', auto_design_column(1500))",
    toolLink: "/software/python-designer",
    hasCalculator: false,
    calcType: "soil_safety"
  },
  {
    id: "8",
    category: "SIMPLIFIED_PAPERS",
    title: "ملخص الأبحاث العالمية: استخدام الخرسانة ذاتية الترميم",
    shortDesc: "تلخيص لأحدث الأبحاث العالمية من الجامعات وتحويلها إلى نقاط عملية للموقع.",
    difficulty: "متقدم",
    specialty: "أوراق بحثية ومواد",
    problem: "تشكل الشقوق الدقيقة في العناصر الخرسانية المسلحة مما يسبب تصدأ حديد التسليح مبكراً.",
    science: "إضافة بكتيريا خرسانية محفزة (Bacillus pseudofirmus) تنتج كربونات الكلسيوم عند ملامسة الماء والآكسجين.",
    smartIdea: "دمج كبسولات الكلس البكتيرية في خلطة الموقع ليتم تفعيلها ذاتياً عند فتح أي شق مجهري.",
    application: "إضافة النسبة المحددة للخلطة، مراقبة الانكماش، وااختبار الكتامة المائية دورياً.",
    codeSnippet: "# Research Data Metric\ncrack_width_sealed_max = 0.8 # mm\nseal_efficiency = 0.94 # 94% self-healing rate",
    toolLink: "/software/bio-concrete-calc",
    hasCalculator: false,
    calcType: "soil_safety"
  }
];

if (!globalThis.insightsDatabase) {
  globalThis.insightsDatabase = [...initialData];
}

export async function GET() {
  return NextResponse.json({ success: true, data: globalThis.insightsDatabase }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0, must-revalidate'
    }
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newArticle = {
      id: body.id || Date.now().toString(),
      category: body.category || "FUTURE_ENG",
      title: body.title || "عنوان مادة علمية جديدة",
      shortDesc: body.shortDesc || "",
      difficulty: body.difficulty || "متقدم",
      specialty: body.specialty || "هندسة عامة",
      problem: body.problem || "",
      science: body.science || "",
      smartIdea: body.smartIdea || "",
      application: body.application || "",
      codeSnippet: body.codeSnippet || "",
      toolLink: body.toolLink || "",
      hasCalculator: body.hasCalculator || false,
      calcType: body.calcType || "soil_safety"
    };

    if (!globalThis.insightsDatabase) {
      globalThis.insightsDatabase = [...initialData];
    }

    globalThis.insightsDatabase.unshift(newArticle);
    return NextResponse.json({ success: true, message: "تمت الإضافة بنجاح", data: newArticle, fullData: globalThis.insightsDatabase });
  } catch (err) {
    return NextResponse.json({ success: false, error: "فشل في إضافة المادة" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    if (!globalThis.insightsDatabase) {
      globalThis.insightsDatabase = [...initialData];
    }
    const index = globalThis.insightsDatabase.findIndex(item => item.id === body.id);
    if (index !== -1) {
      globalThis.insightsDatabase[index] = { ...globalThis.insightsDatabase[index], ...body };
      return NextResponse.json({ success: true, message: "تم التعديل بنجاح", data: globalThis.insightsDatabase[index], fullData: globalThis.insightsDatabase });
    }
    return NextResponse.json({ success: false, error: "العنصر غير موجود" }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "فشل في تعديل المادة" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      if (!globalThis.insightsDatabase) {
        globalThis.insightsDatabase = [...initialData];
      }
      globalThis.insightsDatabase = globalThis.insightsDatabase.filter(item => item.id !== id);
      return NextResponse.json({ success: true, message: "تم الحذف بنجاح", fullData: globalThis.insightsDatabase });
    }
    return NextResponse.json({ success: false, error: "لم يتم تقديم معرف الحذف" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "فشل في عملية الحذف" }, { status: 500 });
  }
}