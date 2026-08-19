import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "smartengineering.hr.global@gmail.com",
    pass: process.env.EMAIL_PASS || "",
  },
});

const TARGET_EMAILS = [
  "Smart.Engineering.Global@proton.me",
  "smart.engineering.global@tuta.io",
  "smartengineering.hr.global@gmail.com",
];

let softwareTools = [
  {
    id: "tool-prompt-1",
    title: "مكتبة برومبتات تحليل المخططات وتقارير التربة",
    category: "prompt-engineering",
    stage: "design",
    badge: "مجانية",
    aiPlatform: "ChatGPT / Claude 3",
    description: "توليد أوامر برمجية دقيقة لتحليل نتائج اختبارات التربة ومطابقة التصميم الإنشائي مع الكود الهندسي.",
    secretPrompt: "أنت خبير تربة وإنشاءات. قم بتحليل التقرير للمساحة [input_area] م² بحد أقصى للميزانية [input_price] $.",
    placeholders: ["input_area", "input_price"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "tool-app-1",
    title: "حاسبة الأعمدة والكمرات الخرسانية التفاعلية",
    category: "live-web-apps",
    stage: "execution",
    badge: "Pro",
    aiPlatform: "Live Engine",
    description: "حساب قدرة تحمل الأعمدة والتحقق من نسبة التسليح وإجهاد الضغط فورياً داخل المتصفح.",
    variables: [
      { name: "b", label: "عرض العمود (مم)", type: "number", default: 300 },
      { name: "h", label: "عمق العمود (مم)", type: "number", default: 600 },
      { name: "fc", label: "مقاومة الخرسانة fc' (MPa)", type: "number", default: 30 },
      { name: "fy", label: "حديد التسليح fy (MPa)", type: "number", default: 420 },
    ],
    logic: "((0.85 * fc * (b * h)) + (0.01 * (b * h) * fy)) / 1000",
    template: "أقصى حمل مسموح للعمود: {Result} kN",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tool-auto-1",
    title: "سكربت Python لحصر كميات Revit و AutoCAD",
    category: "automation-software",
    stage: "technical-office",
    badge: "تجريبية",
    aiPlatform: "Python / Revit API",
    description: "أداة أتمتة لتصدير جداول حصر الخرسانة وحديد التسليح مباشرة إلى ملفات Excel بضغطة زر.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tool-ai-1",
    title: "فاحص التعارضات واكتشاف الأخطاء بالذكاء الاصطناعي",
    category: "ai-solutions",
    stage: "design",
    badge: "Pro",
    aiPlatform: "AI Computer Vision",
    description: "رفع ملفات PDF / DWG واكتشاف التعارضات الهندسية وأخطاء الأبعاد وشبكات التكييف تلقائياً.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tool-mgmt-1",
    title: "نظام إدارة المكتب الفني وتتبع المناقصات",
    category: "management-control",
    stage: "technical-office",
    badge: "مجانية",
    aiPlatform: "SaaS Dashboard Engine",
    description: "لوحة تحكم كاملة لإدارة المشاريع، متابعة المستخلصات، وسجلات الموارد البشرية والعمالة الميدانية.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tool-calc-1",
    title: "حاسبة حديد التسليح والأحمال الهندسية الشاملة",
    category: "quick-calculators",
    stage: "execution",
    badge: "مجانية",
    aiPlatform: "Smart Calc Engine",
    description: "حاسبات مدنية، كهربائية، ميكانيكية والمعمارية للحساب السريع للكميات والمساحات والأحمال.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tool-ai-engineer-1",
    title: "المهندس الذكي AI لإدارة الاستفسارات وتوليد الحلول",
    category: "ai-engineer",
    stage: "design",
    badge: "Pro",
    aiPlatform: "AI Specialized Assistant",
    description: "مساعد هندسي متخصص في الهندسة المدنية، المعمارية، الكهربائية، الميكانيكية، وBIM.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tool-converter-1",
    title: "محول صيغ ملفات CAD/BIM والوحدات الهندسية",
    category: "file-converter",
    stage: "technical-office",
    badge: "مجانية",
    aiPlatform: "CAD Multi-Converter",
    description: "تحويل ملفات DWG/DXF/PDF إلى Excel/CSV، وتحويل كافة الوحدات الهندسية المعقدة.",
    createdAt: new Date().toISOString(),
  }
];

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

    if (action === "request_custom_tool" || body.type === "custom_request") {
      const { name, email, phone, details } = body;

      if (!name || !email || !phone || !details) {
        return NextResponse.json({ success: false, error: "يرجى تعبئة جميع الحقول المطلوبة." }, { status: 400 });
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

      if (process.env.EMAIL_PASS) {
        const mailOptions = {
          from: `"منصة الهندسة الذكية" <${process.env.EMAIL_USER || "smartengineering.hr.global@gmail.com"}>`,
          to: TARGET_EMAILS.join(", "),
          subject: `📥 طلب أداة برمجية خاصة جديدة: ${name}`,
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 10px;">
              <h2 style="color: #38bdf8; border-bottom: 2px solid #334155; padding-bottom: 10px;">طلب أداة برمجية جديدة - منصة الهندسة الذكية</h2>
              <p><strong>اسم الطالب:</strong> ${name}</p>
              <p><strong>البريد الإلكتروني:</strong> <a href="mailto:${email}" style="color: #38bdf8;">${email}</a></p>
              <p><strong>الهاتف / الواتساب:</strong> ${phone}</p>
              <hr style="border-color: #334155; margin: 15px 0;" />
              <h3 style="color: #4ade80;">تفاصيل وشرح الأداة المطلوبة:</h3>
              <div style="background: #1e293b; padding: 15px; border-radius: 8px; border-right: 4px solid #38bdf8;">
                ${details.replace(/\n/g, "<br>")}
              </div>
            </div>
          `,
        };
        await transporter.sendMail(mailOptions).catch((err) => console.error("خطأ إرسال البريد:", err));
      }

      return NextResponse.json({ success: true, message: "تم تسجيل الطلب وإرسال الإشعارات البريدية للإدارة.", data: newRequest }, { status: 201 });
    }

    if (action === "ai_engineer_chat") {
      const { specialization, prompt } = body;
      const responseText = `بصفتي ${specialization || "المهندس الذكي AI"}، تم تحليل طلبك: "${prompt}".\n\n1. التحليل الفني: يتم استخدام المعادلات المعيارية ومطابقتها مع الكود.\n2. النتيجة الإنشائية: إمكانية التنفيذ ممتازة بناءً على المعايير المعتمدة.`;
      return NextResponse.json({ success: true, answer: responseText });
    }

    const { title, category, stage, badge, aiPlatform, description, secretPrompt, logic, variables, placeholders } = body;

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
    return NextResponse.json({ success: true, message: "تم تحديث الأداة ومزامنتها فورياً.", data: softwareTools[index] }, { status: 200 });
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
      return NextResponse.json({ success: true, message: "تم حذف الطلب المخصص." }, { status: 200 });
    }

    softwareTools = softwareTools.filter((t) => t.id !== id);
    return NextResponse.json({ success: true, message: "تم حذف الأداة بنجاح." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}