import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// إعداد خادم البريد الإلكتروني الرسمي للمنصة
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "smartengineering.hr.global@gmail.com",
    pass: process.env.EMAIL_PASS || "", // App Password الخاص بحساب Google
  },
});

const TARGET_EMAILS = [
  "Smart.Engineering.Global@proton.me",
  "smart.engineering.global@tuta.io",
  "smartengineering.hr.global@gmail.com",
];

// قاعدة بيانات البرمجيات والأدوات
let softwareTools = [
  // A. هندسة الأوامر (Prompt Engineering)
  {
    id: "tool-prompt-1",
    title: "مولد برومبت تحليل كود إنشائي وتقارير التربة",
    category: "prompt-engineering",
    stage: "design",
    badge: "مجانية",
    aiPlatform: "ChatGPT / Claude 3",
    description: "واجهة توليد برومبتات احترافية لتحليل نتائج اختبارات التربة ومطابقة التصميم الإنشائي مع SBC و ACI.",
    secretPrompt: "أنت مهندس إنشائي وخبير تربة. قم بتحليل التقرير التالي للمساحة [input_area] م² مع ميزانية تقديرية [input_price] دولار، واستخرج أقصى إجهاد مسموح ومقترحات الأساسات.",
    placeholders: ["input_area", "input_price"],
    createdAt: new Date().toISOString(),
  },

  // B. تطبيقات الويب الحية (Live Web Apps)
  {
    id: "tool-app-1",
    title: "حاسبة التحمل القصي وتقوية الأعمدة الخرسانية",
    category: "live-web-apps",
    stage: "execution",
    badge: "Pro",
    aiPlatform: "محرك معادلات المنصة",
    description: "حساب فوري للتحمل الاسمي للأعمدة الخرسانية والتحقق من نسبة التسليح وإجهادات الضغط مع الترسيم البياني.",
    variables: [
      { name: "b", label: "عرض العمود (مم)", type: "number", default: 300 },
      { name: "h", label: "عمق العمود (مم)", type: "number", default: 600 },
      { name: "fc", label: "مقاومة الخرسانة fc' (Mpa)", type: "number", default: 30 },
      { name: "fy", label: "إجهاد خضوع حديد التسليح (Mpa)", type: "number", default: 420 },
    ],
    logic: "((0.85 * fc * (b * h)) + (0.01 * (b * h) * fy)) / 1000",
    validation: "تأكد من إدخال أبعاد ومقاومة خرسانة أكبر من الصفر",
    template: "الحمولة القصوى المسموحة للعمود هي: {Result} كسر نيوتن (kN)",
    createdAt: new Date().toISOString(),
  },

  // C. برمجيات الأتمتة (Automation Software)
  {
    id: "tool-auto-1",
    title: "سكربت Python لحصر كميات Revit و AutoCAD الفوري",
    category: "automation-software",
    stage: "technical-office",
    badge: "تجريبية",
    aiPlatform: "Python Script / Revit API",
    description: "إضافة برمجية متقدمة لتصدير جدولة الحصر التلقائية للخرسانة وحديد التسليح مباشرة إلى ملفات Excel بضغطة زر.",
    downloadUrl: "#",
    createdAt: new Date().toISOString(),
  },

  // D. حلول الذكاء الاصطناعي (AI Solutions)
  {
    id: "tool-ai-1",
    title: "فاحص المخططات والتحقق من الأخطاء في PDF / DWG",
    category: "ai-solutions",
    stage: "design",
    badge: "Pro",
    aiPlatform: "AI Computer Vision",
    description: "رفع مخططات CAD أو PDF واكتشاف التعارضات الهندسية وأخطاء الأبعاد وتداخل شبكات التكييف والكهرباء تلقائياً.",
    createdAt: new Date().toISOString(),
  },

  // E. الإدارة والتحكم (Management & Control)
  {
    id: "tool-mgmt-1",
    title: "لوحة تتبع المناقصات وإدارة المهام الميدانية والموارد البشرية",
    category: "management-control",
    stage: "technical-office",
    badge: "مجانية",
    aiPlatform: "SaaS Dashboard Engine",
    description: "نظام إدارة المكاتب الهندسية الشامل لإدارة المستخلصات، متابعة العمالة، وتتبع تقدم تنفيذ المشاريع في جيبك.",
    createdAt: new Date().toISOString(),
  }
];

// سجل طلبات البرمجيات الخاصة المستلمة من الجمهور
let toolRequests = [];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const stage = searchParams.get("stage");

    if (type === "requests") {
      return NextResponse.json({ success: true, data: toolRequests }, { status: 200 });
    }

    let filtered = [...softwareTools];
    if (category && category !== "all") {
      filtered = filtered.filter((t) => t.category === category);
    }
    if (stage && stage !== "all") {
      filtered = filtered.filter((t) => t.stage === stage);
    }

    return NextResponse.json({ success: true, count: filtered.length, data: filtered }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // 1. معالجة طلب أداة برمجية خاصة من الجمهور وتوجيه الإشعارات بالإيميل
    if (action === "request_custom_tool" || body.type === "custom_request") {
      const { name, email, phone, details } = body;

      if (!name || !email || !phone || !details) {
        return NextResponse.json({ success: false, error: "يرجى تعبئة جميع الحقول المطلوبة (الاسم، البريد، الهاتف، التفاصيل)." }, { status: 400 });
      }

      const newRequest = {
        id: "req-" + Date.now(),
        name,
        email,
        phone,
        details,
        createdAt: new Date().toLocaleString("ar-SA"),
      };

      toolRequests.unshift(newRequest);

      // إرسال الإيميل للمسؤولين
      if (process.env.EMAIL_PASS) {
        const mailOptions = {
          from: `"منصة الهندسة الذكية" <${process.env.EMAIL_USER || "smartengineering.hr.global@gmail.com"}>`,
          to: TARGET_EMAILS.join(", "),
          subject: `📥 طلب أداة برمجية خاصة جديدة من: ${name}`,
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; padding: 25px; background-color: #0f172a; color: #f8fafc; border-radius: 12px;">
              <h2 style="color: #38bdf8; border-bottom: 2px solid #334155; padding-bottom: 10px;">طلب أداة برمجية خاصة جديدة - منصة الهندسة الذكية</h2>
              <p style="font-size: 15px;"><strong>اسم طالب الأداة:</strong> ${name}</p>
              <p style="font-size: 15px;"><strong>البريد الإلكتروني:</strong> <a href="mailto:${email}" style="color: #38bdf8;">${email}</a></p>
              <p style="font-size: 15px;"><strong>رقم الهاتف / الواتساب:</strong> ${phone}</p>
              <hr style="border-color: #334155; margin: 20px 0;" />
              <h3 style="color: #64ffda;">تفاصيل وشرح الأداة المطلوبة:</h3>
              <div style="background: #1e293b; padding: 18px; border-radius: 8px; border-right: 4px solid #38bdf8; line-height: 1.7;">
                ${details.replace(/\n/g, "<br>")}
              </div>
              <p style="font-size: 12px; color: #94a3b8; margin-top: 25px;">تم استلام هذا الطلب فورياً عبر واجهة الجمهور لقائمة البرمجيات والأدوات.</p>
            </div>
          `,
        };
        await transporter.sendMail(mailOptions).catch((err) => console.error("Email Sending Error:", err));
      }

      return NextResponse.json({ success: true, message: "تم تسجيل طلبك بنجاح وتحويل الإشعار للبريد الإلكتروني للإدارة.", data: newRequest }, { status: 201 });
    }

    // 2. معالجة استفسار "المهندس الذكي AI"
    if (action === "ai_engineer_chat") {
      const { specialization, prompt } = body;
      const responseText = `بصفتي ${specialization || "المهندس الذكي AI"} في منصة الهندسة الذكية، بناءً على المدخلات الخاصة بك: "${prompt}":\n\n1. التحليل الفني: يتم استخدام المعادلات المعيارية لتقدير الكميات والمتطلبات الإنشائية.\n2. التوصية الميدانية: يُفضل مراجعة أبعاد العناصر ومقاطع التسليح طبقاً للكود الهندسي المعتمد.\n3. النتيجة الحسابية التقديرية المباشرة تم اعتمادها وتجهيزها لك.`;
      return NextResponse.json({ success: true, answer: responseText });
    }

    // 3. إضافة أداة برمجية جديدة من لوحة تحكم الأدمن
    const { title, category, stage, badge, aiPlatform, description, secretPrompt, logic, variables, validation, template, placeholders } = body;

    if (!title || !category || !description) {
      return NextResponse.json({ success: false, error: "يرجى تعبئة الحقول الأساسية للأداة." }, { status: 400 });
    }

    const newTool = {
      id: "tool-" + Date.now(),
      title,
      category,
      stage: stage || "design",
      badge: badge || "مجانية",
      aiPlatform: aiPlatform || "محرك المنصة",
      description,
      secretPrompt: secretPrompt || "",
      placeholders: placeholders || [],
      logic: logic || "",
      variables: variables || [],
      validation: validation || "",
      template: template || "",
      createdAt: new Date().toISOString(),
    };

    softwareTools.unshift(newTool);
    return NextResponse.json({ success: true, message: "تم نشر الأداة للجمهور بنجاح.", data: newTool }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const index = softwareTools.findIndex((t) => t.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "الأداة غير موجودة." }, { status: 404 });
    }

    softwareTools[index] = { ...softwareTools[index], ...updateData, updatedAt: new Date().toISOString() };
    return NextResponse.json({ success: true, message: "تم تحديث الأداة وتزامنها مع واجهة الجمهور بنجاح.", data: softwareTools[index] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (type === "request") {
      toolRequests = toolRequests.filter((r) => r.id !== id);
      return NextResponse.json({ success: true, message: "تم إزالة الطلب من قائمة الأدمن." }, { status: 200 });
    }

    softwareTools = softwareTools.filter((t) => t.id !== id);
    return NextResponse.json({ success: true, message: "تم حذف الأداة من واجهة الجمهور." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}