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

// قاعدة البيانات المؤقتة على مستوى الخادم
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

// 1. GET: جلب الأدوات أو الطلبات
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");

    if (type === "requests") {
      return NextResponse.json({ success: true, data: toolRequests }, { status: 200 });
    }

    let filteredTools = [...softwareTools];
    if (category && category !== "all") {
      filteredTools = filteredTools.filter((t) => t.category === category);
    }

    return NextResponse.json({ success: true, count: filteredTools.length, data: filteredTools }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء جلب البيانات: " + error.message }, { status: 500 });
  }
}

// 2. POST: إضافة أداة جديدة أو تقديم طلب أداة خاصة
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // A. تقديم طلب أداة خاصة من الجمهور
    if (action === "request_custom_tool" || body.type === "custom_request") {
      const { name, email, phone, details } = body;

      if (!name || !email || !phone || !details) {
        return NextResponse.json({ success: false, error: "جميع الحقول مطلوبة." }, { status: 400 });
      }

      const newRequest = {
        id: "req-" + Date.now(),
        name,
        email,
        phone,
        details,
        date: new Date().toLocaleString("ar-SA"),
        createdAt: new Date().toISOString(),
      };

      toolRequests.push(newRequest);

      // إرسال البريد الإلكتروني للإدارة
      if (process.env.EMAIL_PASS) {
        const mailOptions = {
          from: `"منصة الهندسة الذكية" <${process.env.EMAIL_USER || "smartengineering.hr.global@gmail.com"}>`,
          to: TARGET_EMAILS.join(", "),
          subject: `📥 طلب أداة برمجية خاصة جديدة من: ${name}`,
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc;">
              <h2 style="color: #38bdf8;">طلب أداة برمجية جديدة - منصة الهندسة الذكية</h2>
              <p><strong>الاسم:</strong> ${name}</p>
              <p><strong>البريد الإلكتروني:</strong> ${email}</p>
              <p><strong>الهاتف:</strong> ${phone}</p>
              <hr style="border-color: #334155;" />
              <h3>التفاصيل الفنية:</h3>
              <p style="background: #1e293b; padding: 15px; border-radius: 8px;">${details}</p>
            </div>
          `,
        };
        await transporter.sendMail(mailOptions).catch((err) => console.error("خطأ إرسال البريد:", err));
      }

      return NextResponse.json({ success: true, message: "تم إرسال الطلب بنجاح.", data: newRequest }, { status: 201 });
    }

    // B. نشر أداة جديدة من لوحة التحكم
    const { title, category, badge, aiPlatform, description, secretPrompt, logic, variables, validation, template, placeholders } = body;

    if (!title || !category || !description) {
      return NextResponse.json({ success: false, error: "الحقول الأساسية مطلوبة." }, { status: 400 });
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

    softwareTools.push(newTool);

    return NextResponse.json({ success: true, message: "تم نشر الأداة بنجاح.", data: newTool }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "فشل معالجة الطلب: " + error.message }, { status: 500 });
  }
}

// 3. PUT: تحديث أداة برمجية
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف الأداة مطلوب." }, { status: 400 });
    }

    const index = softwareTools.findIndex((t) => t.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "الأداة غير موجودة." }, { status: 404 });
    }

    softwareTools[index] = {
      ...softwareTools[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, message: "تم تحديث الأداة بنجاح.", data: softwareTools[index] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء التحديث: " + error.message }, { status: 500 });
  }
}

// 4. DELETE: حذف أداة أو طلب
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id) {
      return NextResponse.json({ success: false, error: "المعرف مطلوب." }, { status: 400 });
    }

    if (type === "request") {
      toolRequests = toolRequests.filter((r) => r.id !== id);
      return NextResponse.json({ success: true, message: "تم حذف الطلب بنجاح." }, { status: 200 });
    }

    softwareTools = softwareTools.filter((t) => t.id !== id);
    return NextResponse.json({ success: true, message: "تم حذف الأداة بنجاح." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء الحذف: " + error.message }, { status: 500 });
  }
}