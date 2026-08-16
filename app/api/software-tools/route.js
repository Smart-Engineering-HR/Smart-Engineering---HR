import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// إعداد خادم البريد الإلكتروني
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

// ذاكرة استمرار البيانات العامة
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
    },
    {
      id: "tool-3",
      title: "برمجية المعالجة الآلية للمخططات الهندسية وحصر الكميات الذكي",
      category: "automation-software",
      aiPlatform: "Python SaaS Engine",
      badge: "أتمتة ذكية",
      description: "رفع المخططات بمختلف الامتدادات (RVT, IFC, DWG, DXF, PDF) لمعالجتها وتوليد سجلات الحصر والمطابقة الفنية الفورية تلقائياً.",
      requiredOutputs: ["transmittal-log", "excel-sheet", "gantt-chart", "marked-up-file"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "tool-4",
      title: "روبوت تشخيص العيوب الإنشائية والتحليل المرئي للشروخ الخرسانية",
      category: "ai-solutions",
      aiPlatform: "Computer Vision & Deep Learning",
      badge: "ذكاء اصطناعي موجه",
      description: "تحليل صور الشروخ والعيوب البصرية وتوليد الخرائط الحرارية (Heatmaps) لتحديد العمق ونسبة الخطورة الفورية.",
      requiredOutputs: ["heatmap", "status-report", "audit-report"],
      createdAt: new Date().toISOString(),
    }
  ];
}

if (!globalThis.__toolRequests) {
  globalThis.__toolRequests = [];
}

// =========================================================================
// 1. GET: جلب البيانات
// =========================================================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");

    if (type === "requests") {
      return NextResponse.json({ success: true, data: globalThis.__toolRequests || [] }, { status: 200 });
    }

    let filteredTools = [...globalThis.__softwareTools];
    if (category && category !== "all") {
      filteredTools = filteredTools.filter((t) => t.category === category);
    }

    return NextResponse.json({ success: true, count: filteredTools.length, data: filteredTools }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء جلب البيانات: " + error.message }, { status: 500 });
  }
}

// =========================================================================
// 2. POST: إدراج أداة أو طلب مخصص
// =========================================================================
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action } = body;

    // A. معالجة طلب أداة مخصصة من الجمهور
    if (action === "request_custom_tool" || body.type === "custom_request") {
      const { name, email, phone, details } = body;

      if (!name || !email || !phone || !details) {
        return NextResponse.json(
          { success: false, error: "جميع الحقول (الاسم، البريد، الهاتف، التفاصيل) مطلوبة." },
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

      // إرسال البريد في الخلفية بدون حظر الاستجابة لتجنب الـ Timeout
      if (process.env.EMAIL_PASS) {
        Promise.resolve().then(async () => {
          try {
            await transporter.sendMail({
              from: `"منصة الهندسة الذكية" <${process.env.EMAIL_USER || "smartengineering.hr.global@gmail.com"}>`,
              to: TARGET_EMAILS.join(", "),
              subject: `📥 طلب أداة برمجية خاصة جديدة من: ${name}`,
              html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc;">
                  <h2 style="color: #38bdf8;">طلب أداة برمجية جديدة - منصة الهندسة الذكية</h2>
                  <p><strong>اسم المهندس/الجهة:</strong> ${name}</p>
                  <p><strong>البريد الإلكتروني:</strong> ${email}</p>
                  <p><strong>رقم الهاتف:</strong> ${phone}</p>
                  <hr style="border-color: #334155;" />
                  <h3>الشرح والتفاصيل الفنية:</h3>
                  <p style="background: #1e293b; padding: 15px; border-radius: 8px;">${details}</p>
                  <p style="font-size: 11px; color: #94a3b8;">التاريخ: ${newRequest.date}</p>
                </div>
              `,
            });
          } catch (err) {
            console.error("خطأ خلفي في إرسال البريد:", err.message);
          }
        });
      }

      return NextResponse.json(
        { success: true, message: "تم تسجيل طلبك بنجاح وحفظه في لوحة التحكم.", data: newRequest },
        { status: 201 }
      );
    }

    // B. معالجة إضافة أداة جديدة من الأدمن
    const { title, category, badge, aiPlatform, description, secretPrompt, logic, variables, validation, template, placeholders } = body;

    if (!title || !category || !description) {
      return NextResponse.json(
        { success: false, error: "حقول (العنوان، التصنيف، الوصف) مطلوبة لإتمام عملية النشر." },
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
      placeholders: placeholders || [],
      logic: logic || "",
      variables: variables || [],
      validation: validation || "",
      template: template || "",
      createdAt: new Date().toISOString(),
    };

    globalThis.__softwareTools.unshift(newTool);

    return NextResponse.json(
      { success: true, message: "تم نشر الأداة البرمجية بنجاح وعكسها للجمهور.", data: newTool },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "حدث خطأ في معالجة الطلب: " + error.message },
      { status: 500 }
    );
  }
}

// =========================================================================
// 3. PUT: تحديل أداة
// =========================================================================
export async function PUT(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف الأداة (id) مطلوب للتعديل." }, { status: 400 });
    }

    const index = globalThis.__softwareTools.findIndex((t) => t.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "الأداة البرمجية غير موجودة." }, { status: 404 });
    }

    globalThis.__softwareTools[index] = {
      ...globalThis.__softwareTools[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, message: "تم تحديث الأداة بنجاح.", data: globalThis.__softwareTools[index] },
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
      return NextResponse.json({ success: false, error: "معرف العنصر مطلوب للحذف." }, { status: 400 });
    }

    if (type === "request") {
      globalThis.__toolRequests = globalThis.__toolRequests.filter((r) => r.id !== id);
      return NextResponse.json({ success: true, message: "تمت إزالة الطلب من لوحة الإدارة." }, { status: 200 });
    }

    globalThis.__softwareTools = globalThis.__softwareTools.filter((t) => t.id !== id);
    return NextResponse.json({ success: true, message: "تم حذف الأداة نهائياً." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء الحذف: " + error.message }, { status: 500 });
  }
}