import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// إعداد خادم البريد الإلكتروني الرسمي
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

// قاعدة بيانات البرمجيات
let softwareTools = [
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
  {
    id: "tool-app-1",
    title: "حاسبة التحمل القصي وتقوية الأعمدة الخرسانية",
    category: "live-web-apps",
    stage: "execution",
    badge: "Pro",
    aiPlatform: "محرك معادلات المنصة",
    description: "حساب فوري للتحمل الاسمي للأعمدة الخرسانية والتحقق من نسبة التسليح وإجهادات الضغط مع الترسيم البياني.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tool-auto-1",
    title: "سكربت Python لحصر كميات Revit و AutoCAD الفوري",
    category: "automation-software",
    stage: "technical-office",
    badge: "تجريبية",
    aiPlatform: "Python / Revit API",
    description: "إضافة برمجية متقدمة لتصدير جدولة الحصر التلقائية للخرسانة وحديد التسليح مباشرة إلى ملفات Excel.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tool-ai-1",
    title: "فاحص المخططات والتحقق من الأخطاء في PDF / DWG",
    category: "ai-solutions",
    stage: "design",
    badge: "Pro",
    aiPlatform: "AI Vision Engine",
    description: "رفع مخططات CAD أو PDF واكتشاف التعارضات الهندسية وأخطاء الأبعاد وتداخل الشبكات تلقائياً.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tool-mgmt-1",
    title: "لوحة تتبع المناقصات وإدارة المهام الميدانية",
    category: "management-control",
    stage: "technical-office",
    badge: "مجانية",
    aiPlatform: "SaaS Dashboard Engine",
    description: "نظام إدارة المكاتب الهندسية الشامل لإدارة المستخلصات، متابعة العمالة، وتتبع تقدم تنفيذ المشاريع.",
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

    // 1. طلب أداة خاصة
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

      // إرسال الإشعار
      if (process.env.EMAIL_PASS) {
        const mailOptions = {
          from: `"منصة الهندسة الذكية" <${process.env.EMAIL_USER || "smartengineering.hr.global@gmail.com"}>`,
          to: TARGET_EMAILS.join(", "),
          subject: `📥 طلب أداة برمجية جديدة من: ${name}`,
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 10px;">
              <h2 style="color: #38bdf8;">طلب أداة برمجية خاصة جديدة</h2>
              <p><strong>اسم الطالب:</strong> ${name}</p>
              <p><strong>البريد الإلكتروني:</strong> ${email}</p>
              <p><strong>الهاتف:</strong> ${phone}</p>
              <p><strong>التفاصيل:</strong> ${details}</p>
            </div>
          `,
        };
        await transporter.sendMail(mailOptions).catch((err) => console.error("Email Error:", err));
      }

      return NextResponse.json({ success: true, message: "تم تسجيل طلبك بنجاح.", data: newRequest }, { status: 201 });
    }

    // 2. محاكاة رد المهندس الذكي
    if (action === "ai_engineer_chat") {
      const { specialization, prompt } = body;
      const responseText = `بصفتي ${specialization || "المهندس الذكي AI"} في منصة الهندسة الذكية، بناءً على المدخلات الخاصة بك: "${prompt}":\n\n1. التحليل الفني: تم فحص البيانات وفق الاشتراطات المعيارية والكود المعتمد.\n2. التوصية الميدانية: يُفضل مراعاة نسب الأمان وإجهادات العناصر المحددة.\n3. النتيجة الحسابية التقديرية جاهزة ومطابقة للمواصفات الهندسية.`;
      return NextResponse.json({ success: true, answer: responseText });
    }

    // 3. إضافة أداة جديدة من الأدمن
    const { title, category, stage, badge, aiPlatform, description, secretPrompt, placeholders } = body;

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
    return NextResponse.json({ success: true, message: "تم تحديث الأداة وتزامنها مع الواجهة بنجاح.", data: softwareTools[index] }, { status: 200 });
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