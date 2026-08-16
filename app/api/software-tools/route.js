import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// تحديد بيئة التشغيل والإعدادات لضمان التوافق التام مع Vercel Serverless
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// إعداد خادم البريد بشكل آمن لمنع انهيار الـ API في حال غياب بيانات الاعتماد
const createTransporter = () => {
  try {
    const user = process.env.EMAIL_USER || "smartengineering.hr.global@gmail.com";
    const pass = process.env.EMAIL_PASS;
    if (!pass) return null;

    return nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  } catch (err) {
    console.error("Transporter init error:", err);
    return null;
  }
};

const TARGET_EMAILS = [
  "Smart.Engineering.Global@proton.me",
  "smart.engineering.global@tuta.io",
  "smartengineering.hr.global@gmail.com",
];

// الذاكرة المؤقتة العالمية
if (!globalThis.__softwareTools) {
  globalThis.__softwareTools = [
    {
      id: "tool-1",
      title: "النظام الذكي لهندسة الأوامر وإعداد برومبت الخرسانة والمواد",
      category: "prompt-engineering",
      aiPlatform: "ChatGPT / Claude 3",
      badge: "أداة حصرية معتمدة",
      description: "توليد أوامر برمجية صارمة لصياغة تقارير فحص ومطابقة المواد الإنشائية وفق SBC و ACI.",
      secretPrompt: "أنت مهندس مواد خبير، قم بتحليل مادة [المادة] المستخدمة في [العنصر الإنشائي] وفق كود [الكود المعتمد].",
      placeholders: ["المادة", "العنصر الإنشائي", "الكود المعتمد"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "tool-2",
      title: "حاسبة التحمل القصي والميكانيكي للأعمدة الخرسانية",
      category: "live-web-apps",
      aiPlatform: "محرك معادلات المنصة",
      badge: "حساب فوري مباشر",
      description: "حساب التحمل الاسمي للأعمدة الخرسانية الخاضعة لأحمال مركزية وفق معادلات ACI 318.",
      variables: [
        { name: "Ac", label: "مساحة المقطع الخرساني الإجمالي (mm²)", type: "number", unit: "mm²" },
        { name: "fc", label: "المقاومة المميزة للخرسانة fc' (MPa)", type: "number", unit: "MPa" }
      ],
      logic: "(0.85 * fc * Ac) / 1000",
      validation: "المساحة والمقاومة يجب أن تكون قيماً موجبة أكبر من الصفر",
      template: "قوة تحمل العمود الاسمية هي: {Result} kN",
      createdAt: new Date().toISOString(),
    }
  ];
}

if (!globalThis.__toolRequests) {
  globalThis.__toolRequests = [];
}

// =========================================================================
// 1. GET: استرجاع البيانات
// =========================================================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");

    if (type === "requests") {
      return NextResponse.json(
        { success: true, data: globalThis.__toolRequests || [] },
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    let filteredTools = [...(globalThis.__softwareTools || [])];
    if (category && category !== "all") {
      filteredTools = filteredTools.filter((t) => t.category === category);
    }

    return NextResponse.json(
      { success: true, count: filteredTools.length, data: filteredTools },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "فشل جلب البيانات: " + error.message },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// =========================================================================
// 2. POST: إضافة أداة أو استقبال طلبات الجمهور
// =========================================================================
export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "صيغة البيانات غير صالحة" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { action } = body;

    // A. طلب أداة خاصة من الجمهور
    if (action === "request_custom_tool" || body.type === "custom_request") {
      const { name, email, phone, details } = body;

      if (!name || !email || !phone || !details) {
        return NextResponse.json(
          { success: false, error: "جميع الحقول مطلوبة" },
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const newRequest = {
        id: "req-" + Date.now(),
        name,
        email,
        phone,
        details,
        createdAt: new Date().toISOString(),
        date: new Date().toLocaleString("ar-SA"),
      };

      globalThis.__toolRequests.unshift(newRequest);

      // محاولة إرسال الإيميل دون تعطيل الاستجابة الرئيسية
      const transporter = createTransporter();
      if (transporter) {
        transporter.sendMail({
          from: `"منصة الهندسة الذكية" <${process.env.EMAIL_USER || "smartengineering.hr.global@gmail.com"}>`,
          to: TARGET_EMAILS.join(", "),
          subject: `📥 طلب أداة برمجية جديدة من: ${name}`,
          html: `
            <div dir="rtl" style="font-family: Arial; padding: 20px; background: #0f172a; color: #fff;">
              <h2 style="color: #38bdf8;">طلب أداة برمجية جديدة</h2>
              <p><strong>الاسم:</strong> ${name}</p>
              <p><strong>البريد:</strong> ${email}</p>
              <p><strong>الهاتف:</strong> ${phone}</p>
              <hr/>
              <p style="background: #1e293b; padding: 15px;">${details}</p>
            </div>
          `,
        }).catch(err => console.error("Mail dispatch error:", err));
      }

      return NextResponse.json(
        { success: true, message: "تم استقبال الطلب بنجاح", data: newRequest },
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    }

    // B. إضافة أداة جديدة بواسطة الأدمن
    const { title, category, badge, aiPlatform, description, secretPrompt, logic, variables, validation, template, placeholders } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "عنوان الأداة والوصف الفني حقول إجبارية" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newTool = {
      id: "tool-" + Date.now(),
      title,
      category: category || "prompt-engineering",
      badge: badge || "أداة حصرية",
      aiPlatform: aiPlatform || "ChatGPT / Claude 3",
      description,
      secretPrompt: secretPrompt || "",
      placeholders: Array.isArray(placeholders) ? placeholders : [],
      logic: logic || "",
      variables: Array.isArray(variables) ? variables : [],
      validation: validation || "",
      template: template || "",
      createdAt: new Date().toISOString(),
    };

    globalThis.__softwareTools.unshift(newTool);

    return NextResponse.json(
      { success: true, message: "تم نشر الأداة بنجاح", data: newTool },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطأ خادم داخلي: " + error.message },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// =========================================================================
// 3. PUT: تعديل أداة
// =========================================================================
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف الأداة مطلوب" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const index = globalThis.__softwareTools.findIndex((t) => t.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "الأداة غير موجودة" },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    globalThis.__softwareTools[index] = {
      ...globalThis.__softwareTools[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, message: "تم التعديل بنجاح", data: globalThis.__softwareTools[index] },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "فشل التعديل: " + error.message },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// =========================================================================
// 4. DELETE: حذف أداة أو طلب
// =========================================================================
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "المعرف مطلوب للحذف" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (type === "request") {
      globalThis.__toolRequests = globalThis.__toolRequests.filter((r) => r.id !== id);
      return NextResponse.json(
        { success: true, message: "تم حذف الطلب" },
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    globalThis.__softwareTools = globalThis.__softwareTools.filter((t) => t.id !== id);
    return NextResponse.json(
      { success: true, message: "تم حذف الأداة" },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "فشل الحذف: " + error.message },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}