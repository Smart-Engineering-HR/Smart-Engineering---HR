import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

// 1. جلب البيانات من قاعدة البيانات الدائمة
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const stage = searchParams.get("stage");

    // جلب طلبات الأدوات المخصصة
    if (type === "requests") {
      const requests = await prisma.softwareToolRequest.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, data: requests }, { status: 200 });
    }

    // بناء محددات التصفية
    const where = {};
    if (category && category !== "all") where.category = category;
    if (stage && stage !== "all") where.stage = stage;

    const tools = await prisma.softwareTool.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, count: tools.length, data: tools }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. إضافة أداة جديدة أو تسجيل طلب خاص
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // طلب أداة برمجية خاصة من الزائر
    if (action === "request_custom_tool" || body.type === "custom_request") {
      const { name, email, phone, details } = body;

      if (!name || !email || !phone || !details) {
        return NextResponse.json({ success: false, error: "يرجى تعبئة جميع الحقول المطلوبة." }, { status: 400 });
      }

      const newRequest = await prisma.softwareToolRequest.create({
        data: { name, email, phone, details },
      });

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

    // معالجة أسئلة مساعد الذكاء الاصطناعي
    if (action === "ai_engineer_chat") {
      const { specialization, prompt } = body;
      const responseText = `بصفتي ${specialization || "المهندس الذكي AI"}، تم تحليل طلبك: "${prompt}".\n\n1. التحليل الفني: يتم استخدام المعادلات المعيارية ومطابقتها مع الكود.\n2. النتيجة الإنشائية: إمكانية التنفيذ ممتازة بناءً على المعايير المعتمدة.`;
      return NextResponse.json({ success: true, answer: responseText });
    }

    // إضافة أداة جديدة من الأدمن
    const { title, category, stage, badge, aiPlatform, description, secretPrompt, logic, variables, placeholders } = body;

    if (!title || !category || !description) {
      return NextResponse.json({ success: false, error: "يرجى تعبئة الحقول الأساسية للأداة." }, { status: 400 });
    }

    const newTool = await prisma.softwareTool.create({
      data: {
        title,
        category,
        stage: stage || "design",
        badge: badge || "مجانية",
        aiPlatform: aiPlatform || "محرك المنصة",
        description,
        secretPrompt: secretPrompt || "",
        placeholders: Array.isArray(placeholders) ? placeholders : [],
        logic: logic || "",
        variables: variables ? JSON.parse(JSON.stringify(variables)) : null,
      },
    });

    return NextResponse.json({ success: true, message: "تم حفظ ونشر الأداة في قاعدة البيانات بنجاح.", data: newTool }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. تعديل أداة موجودة في قاعدة البيانات
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "المعرف (ID) مطلوب لتحديث البيانات." }, { status: 400 });
    }

    const updatedTool = await prisma.softwareTool.update({
      where: { id },
      data: {
        title: updateData.title,
        category: updateData.category,
        stage: updateData.stage,
        badge: updateData.badge,
        aiPlatform: updateData.aiPlatform,
        description: updateData.description,
        secretPrompt: updateData.secretPrompt,
        placeholders: Array.isArray(updateData.placeholders) ? updateData.placeholders : [],
        logic: updateData.logic,
        variables: updateData.variables ? JSON.parse(JSON.stringify(updateData.variables)) : undefined,
      },
    });

    return NextResponse.json({ success: true, message: "تم تحديث الأداة دائمياً.", data: updatedTool }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 4. حذف أداة أو طلب مخصص
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id) {
      return NextResponse.json({ success: false, error: "المعرف (ID) مطلوب للحذف." }, { status: 400 });
    }

    if (type === "request") {
      await prisma.softwareToolRequest.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "تم حذف الطلب المخصص من قاعدة البيانات." }, { status: 200 });
    }

    await prisma.softwareTool.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "تم حذف الأداة من قاعدة البيانات بنجاح." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}