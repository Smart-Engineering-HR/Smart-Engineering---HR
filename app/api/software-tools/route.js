import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// تهيئة خادم البريد
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

// الذاكرة المؤقتة للبيانات
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

// دالة مساعدة لضمان إرجاع JSON دائماً
function jsonResponse(data, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

// 1. GET: استرجاع البيانات
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");

    if (type === "requests") {
      return jsonResponse({ success: true, data: globalThis.__toolRequests || [] });
    }

    let filteredTools = [...(globalThis.__softwareTools || [])];
    if (category && category !== "all") {
      filteredTools = filteredTools.filter((t) => t.category === category);
    }

    return jsonResponse({
      success: true,
      count: filteredTools.length,
      data: filteredTools,
    });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// 2. POST: إدراج أداة جديدة أو استقبال طلب خاص
export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ success: false, error: "صيغة البيانات غير صحيحة (Invalid JSON)" }, 400);
    }

    const { action } = body;

    // A. طلب أداة خاصة من الجمهور
    if (action === "request_custom_tool" || body.type === "custom_request") {
      const { name, email, phone, details } = body;

      if (!name || !email || !phone || !details) {
        return jsonResponse({ success: false, error: "جميع الحقول مطلوبة." }, 400);
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

      // إرسال البريد في الخلفية دون تعطيل الاستجابة لتجنب Timeout Vercel
      if (process.env.EMAIL_PASS) {
        transporter.sendMail({
          from: `"منصة الهندسة الذكية" <${process.env.EMAIL_USER || "smartengineering.hr.global@gmail.com"}>`,
          to: TARGET_EMAILS.join(", "),
          subject: `📥 طلب أداة برمجية جديدة: ${name}`,
          html: `<div dir="rtl" style="padding:20px;background:#0f172a;color:#fff;">
            <h2 style="color:#38bdf8;">طلب جديد من: ${name}</h2>
            <p><strong>الإيميل:</strong> ${email}</p>
            <p><strong>الهاتف:</strong> ${phone}</p>
            <p><strong>التفاصيل:</strong> ${details}</p>
          </div>`,
        }).catch((err) => console.error("Email Error:", err));
      }

      return jsonResponse({
        success: true,
        message: "تم استقبال طلبك بنجاح وحفظه في النظام.",
        data: newRequest,
      }, 201);
    }

    // B. إدراج أداة برمجية جديدة من الأدمن
    const { title, category, badge, aiPlatform, description, secretPrompt, logic, variables, validation, template, placeholders } = body;

    if (!title || !category || !description) {
      return jsonResponse({ success: false, error: "العنوان والتصنيف والوصف حقول إجبارية." }, 400);
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

    return jsonResponse({
      success: true,
      message: "تم نشر الأداة بنجاح.",
      data: newTool,
    }, 201);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// 3. PUT: تعديل أداة
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) return jsonResponse({ success: false, error: "معرف الأداة (id) مطلوب." }, 400);

    const index = globalThis.__softwareTools.findIndex((t) => t.id === id);
    if (index === -1) return jsonResponse({ success: false, error: "الأداة غير موجودة." }, 404);

    globalThis.__softwareTools[index] = {
      ...globalThis.__softwareTools[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return jsonResponse({
      success: true,
      message: "تم تحديث الأداة بنجاح.",
      data: globalThis.__softwareTools[index],
    });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// 4. DELETE: حذف أداة أو طلب
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id) return jsonResponse({ success: false, error: "معرف العنصر مطلوب." }, 400);

    if (type === "request") {
      globalThis.__toolRequests = globalThis.__toolRequests.filter((r) => r.id !== id);
      return jsonResponse({ success: true, message: "تمت إزالة الطلب." });
    }

    globalThis.__softwareTools = globalThis.__softwareTools.filter((t) => t.id !== id);
    return jsonResponse({ success: true, message: "تم حذف الأداة." });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}