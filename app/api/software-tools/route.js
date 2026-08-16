import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// إجبار Next.js على تشغيل الـ Route بشكل ديناميكي وعدم تخزينه مؤقتاً على Vercel
export const dynamic = "force-dynamic";

// إعداد خادم البريد الإلكتروني مع تجاوز قيود SSL للبيئات السحابية
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || "smartengineering.hr.global@gmail.com",
    pass: process.env.EMAIL_PASS || "", 
  },
  tls: {
    rejectUnauthorized: false,
  },
});

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
// 1. GET: استرجاع الأدوات أو الطلبات
// =========================================================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");

    if (type === "requests") {
      return NextResponse.json({ success: true, data: globalThis.__toolRequests || [] }, { status: 200 });
    }

    let filteredTools = [...(globalThis.__softwareTools || [])];
    if (category && category !== "all") {
      filteredTools = filteredTools.filter((t) => t.category === category);
    }

    return NextResponse.json({ success: true, count: filteredTools.length, data: filteredTools }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "فشل جلب البيانات: " + error.message }, { status: 500 });
  }
}

// =========================================================================
// 2. POST: إضافة أداة جديدة أو استقبال طلب أداة خاصة
// =========================================================================
export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ success: false, error: "صيغة البيانات المدخلة غير صالحة (Invalid JSON)" }, { status: 400 });
    }

    const { action } = body;

    // A. طلب أداة برمجية خاصة من الجمهور
    if (action === "request_custom_tool" || body.type === "custom_request") {
      const { name, email, phone, details } = body;

      if (!name || !email || !phone || !details) {
        return NextResponse.json(
          { success: false, error: "جميع الحقول (الاسم، الايميل، التلفون، التفاصيل) مطلوبة." },
          { status: 400 }
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

      // إرسال البريد إلكتروني في الخلفية بدون تعطيل الاستجابة
      if (process.env.EMAIL_PASS) {
        transporter.sendMail({
          from: `"منصة الهندسة الذكية" <${process.env.EMAIL_USER || "smartengineering.hr.global@gmail.com"}>`,
          to: TARGET_EMAILS.join(", "),
          subject: `📥 طلب أداة برمجية خاصة جديدة من: ${name}`,
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc;">
              <h2 style="color: #38bdf8;">طلب أداة برمجية جديدة - منصة الهندسة الذكية</h2>
              <p><strong>الاسم:</strong> ${name}</p>
              <p><strong>البريد الإلكتروني:</strong> ${email}</p>
              <p><strong>رقم الهاتف:</strong> ${phone}</p>
              <hr style="border-color: #334155;" />
              <h3>التفاصيل الفنية:</h3>
              <p style="background: #1e293b; padding: 15px; border-radius: 8px;">${details}</p>
              <p style="font-size: 11px; color: #94a3b8;">التاريخ: ${newRequest.date}</p>
            </div>
          `,
        }).catch(err => console.error("Email send error:", err));
      }

      return NextResponse.json(
        { success: true, message: "تم استقبال طلبك بنجاح وعكسه فوراً للوحة الإدارة.", data: newRequest },
        { status: 201 }
      );
    }

    // B. إضافة أداة جديدة من الأدمن
    const { title, category, badge, aiPlatform, description, secretPrompt, logic, variables, validation, template, placeholders } = body;

    if (!title || !category || !description) {
      return NextResponse.json(
        { success: false, error: "حقول (العنوان، التصنيف، الوصف) مطلوبة لإتمام النشر." },
        { status: 400 }
      );
    }

    const newTool = {
      id: "tool-" + Date.now(),
      title,
      category,
      badge: badge || "أداة حصرية",
      aiPlatform: aiPlatform || "محرك منصة الهندسة الذكية",
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
      { success: true, message: "تم نشر الأداة البرمجية بنجاح للجمهور.", data: newTool },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ غير متوقع بالخادم: " + error.message }, { status: 500 });
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
      return NextResponse.json({ success: false, error: "معرف الأداة (id) مطلوب للتعديل." }, { status: 400 });
    }

    const index = globalThis.__softwareTools.findIndex((t) => t.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "الأداة غير موجودة." }, { status: 404 });
    }

    globalThis.__softwareTools[index] = {
      ...globalThis.__softwareTools[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, message: "تم تعديل الأداة وعكس التحديثات فوراً.", data: globalThis.__softwareTools[index] },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: "فشل التحديث: " + error.message }, { status: 500 });
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
      return NextResponse.json({ success: false, error: "المعرف مطلوب للحذف." }, { status: 400 });
    }

    if (type === "request") {
      globalThis.__toolRequests = globalThis.__toolRequests.filter((r) => r.id !== id);
      return NextResponse.json({ success: true, message: "تم أرشفة وإزالة الطلب بنجاح." }, { status: 200 });
    }

    globalThis.__softwareTools = globalThis.__softwareTools.filter((t) => t.id !== id);
    return NextResponse.json({ success: true, message: "تم حذف الأداة نهائياً." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "فشل الحذف: " + error.message }, { status: 500 });
  }
}