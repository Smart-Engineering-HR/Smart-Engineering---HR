import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// إعداد خادم البريد الإلكتروني للربط مع إيميلات المنصة الرسمية
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "smartengineering.hr.global@gmail.com",
    pass: process.env.EMAIL_PASS || "", // كلمة مرور التطبيقات App Password
  },
});

// البريد الإلكتروني المعتمد لاستقبال الإشعارات والطلبات
const TARGET_EMAILS = [
  "Smart.Engineering.Global@proton.me",
  "smart.engineering.global@tuta.io",
  "smartengineering.hr.global@gmail.com",
];

// قاعدة بيانات مؤقتة متكاملة للأدوات والطلبات
let softwareTools = [
  {
    id: "tool-1",
    title: "النظام الذكي لهندسة الأوامر وإعداد برومبت الخرسانة والمواد",
    category: "prompt-engineering",
    aiPlatform: "ChatGPT / Claude 3",
    badge: "أداة حصرية معتمدة",
    description: "توليد أوامر برمجية صارمة لصياغة تقارير فحص ومطابقة المواد الإنشائية وفق SBC و ACI.",
    secretPrompt: "أنت مهندس مواد خبير، قم بتحليل [المادة] المستعملة في [العنصر الإنشائي] بمساحة [input_area] وبسعر [input_price].",
    input_area: "250",
    input_price: "1500",
    placeholders: ["المادة", "العنصر الإنشائي", "input_area", "input_price"],
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
];

let toolRequests = [];

// =========================================================================
// 1. GET: استرجاع الأدوات والطلبات حسب التصنيف أو النوع
// =========================================================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "tools" أو "requests"
    const category = searchParams.get("category");

    if (type === "requests") {
      return NextResponse.json({ success: true, data: toolRequests }, { status: 200 });
    }

    let filteredTools = [...softwareTools];
    if (category && category !== "all") {
      filteredTools = filteredTools.filter((t) => t.category === category);
    }

    return NextResponse.json(
      {
        success: true,
        count: filteredTools.length,
        data: filteredTools,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء جلب البيانات: " + error.message },
      { status: 500 }
    );
  }
}

// =========================================================================
// 2. POST: إضافة أداة جديدة أو استقبال طلب أداة برمجية خاصة
// =========================================================================
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // A. معالجة استمارة "اطلب أداتك البرمجية الخاصة"
    if (action === "request_custom_tool" || body.type === "custom_request") {
      const { name, email, phone, details } = body;

      // التحقق الصارم من الحقول
      if (!name || !email || !phone || !details) {
        return NextResponse.json(
          { success: false, error: "جميع الحقول (الاسم، الايميل، التلفون، الشرح والتفاصيل) مطلوبة." },
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
      };

      toolRequests.push(newRequest);

      // إرسال بريد إلكتروني تلقائي للإيميلات الثلاثة المعتمدة
      if (process.env.EMAIL_PASS) {
        const mailOptions = {
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
              <h3>الشرح والتفاصيل الفنية للأداة المطلوبة:</h3>
              <p style="background: #1e293b; padding: 15px; border-radius: 8px;">${details}</p>
              <p style="font-size: 11px; color: #94a3b8;">تاريخ الطلب: ${new Date().toLocaleString("ar-SA")}</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions).catch((err) => {
          console.error("خطأ في إرسال البريد:", err);
        });
      }

      return NextResponse.json(
        {
          success: true,
          message: "تم استقبال طلبك بنجاح وتحويله للإدارة عبر البريد الإلكتروني الرسمي.",
          data: newRequest,
        },
        { status: 201 }
      );
    }

    // B. معالجة إضافة/نشر أداة برمجية جديدة من لوحة التحكم
    const { title, category, badge, aiPlatform, description, secretPrompt, logic, variables, validation, template, input_area, input_price } = body;

    // التحقق الصارم من تعبئة جميع الحقول
    if (!title || !category || !description) {
      return NextResponse.json(
        { success: false, error: "يجب تعبئة جميع الحقول الأساسية للنشر (العنوان، التصنيف، الوصف)." },
        { status: 400 }
      );
    }

    // التحقق من صحة التصنيفات الخمسة
    const validCategories = [
      "prompt-engineering",
      "live-web-apps",
      "automation-software",
      "ai-solutions",
      "management-control",
    ];

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: "التصنيف المحدد غير متاح ضمن قائمة المنصة." },
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
      input_area: input_area || null,
      input_price: input_price || null,
      placeholders: body.placeholders || [],
      logic: logic || "",
      variables: variables || [],
      validation: validation || "",
      template: template || "",
      createdAt: new Date().toISOString(),
    };

    softwareTools.push(newTool);

    return NextResponse.json(
      {
        success: true,
        message: "تم نشر الإعلان/الأداة البرمجية بنجاح وحفظها للجمهور.",
        data: newTool,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "فشل معالجة الطلب: " + error.message },
      { status: 500 }
    );
  }
}

// =========================================================================
// 3. PUT: تعديل ومواءمة أداة برمجية قائمة
// =========================================================================
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف الأداة (id) مطلوب لإتمام عملية التعديل." },
        { status: 400 }
      );
    }

    const index = softwareTools.findIndex((t) => t.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "الأداة البرمجية المطلوبة غير موجودة." },
        { status: 404 }
      );
    }

    softwareTools[index] = {
      ...softwareTools[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "تم تحديث الأداة البرمجية وعكس التعديلات للجمهور بنجاح.",
        data: softwareTools[index],
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء التحديث: " + error.message },
      { status: 500 }
    );
  }
}

// =========================================================================
// 4. DELETE: حذف أداة أو طلب مخصص نهائياً
// =========================================================================
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type"); // "tool" أو "request"

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف العنصر مطلوب لإتمام الحذف." },
        { status: 400 }
      );
    }

    if (type === "request") {
      const initialLength = toolRequests.length;
      toolRequests = toolRequests.filter((r) => r.id !== id);
      
      if (toolRequests.length === initialLength) {
        return NextResponse.json({ success: false, error: "الطلب غير موجود." }, { status: 404 });
      }

      return NextResponse.json(
        { success: true, message: "تمت إزالة وأرشفة طلب الأداة الخاصة بنجاح." },
        { status: 200 }
      );
    }

    const initialLength = softwareTools.length;
    softwareTools = softwareTools.filter((t) => t.id !== id);

    if (softwareTools.length === initialLength) {
      return NextResponse.json({ success: false, error: "الأداة غير موجودة." }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "تم حذف الأداة البرمجية نهائياً من منصة الجمهور." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء عملية الحذف: " + error.message },
      { status: 500 }
    );
  }
}