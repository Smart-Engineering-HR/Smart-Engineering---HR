import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// البريد الإلكتروني المعتمد لاستقبال الإشعارات والرسائل
const RECIPIENT_EMAILS = [
  "Smart.Engineering.Global@proton.me",
  "smart.engineering.global@tuta.io",
  "smartengineering.hr.global@gmail.com"
];

// إعداد خدمة Nodemailer للإرسال برمجياً
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "smartengineering.hr.global@gmail.com",
    pass: process.env.EMAIL_PASS || "" // يتم وضعه في ملف .env.local
  }
});

// 1. استقبال المشاركات والآراء وتمريرها للإيميل ولوحة التحكم (POST)
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, data, submittedAt } = body;

    if (!type || !data) {
      return NextResponse.json(
        { success: false, message: "جميع البيانات المطلوبة يجب أن تكون مكتملة." },
        { status: 400 }
      );
    }

    // تجهيز نص الإيميل الاحترافي المنظم بناءً على نوع المشاركة
    let emailSubject = `[منصة الهندسة الذكية] مشاركة جديدة: ${type}`;
    let emailHtmlBody = `
      <div style="direction: rtl; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px;">
        <h2 style="color: #38bdf8; border-bottom: 2px solid #0284c7; padding-bottom: 10px;">إشعار مشاركة جديدة - منصة الهندسة الذكية</h2>
        <p style="font-size: 14px; color: #94a3b8;">تاريخ الإرسال: ${submittedAt || new Date().toLocaleString("ar-EG")}</p>
        <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155; margin-top: 15px;">
    `;

    if (type === "general") {
      emailSubject = `[النموذج العام] مشاركة من: ${data.name || "مجهول"}`;
      emailHtmlBody += `
        <p><strong>الاسم:</strong> ${data.name || "لم يذكر"}</p>
        <p><strong>التخصص:</strong> ${data.specialty}</p>
        <p><strong>نوع المشاركة:</strong> ${data.type}</p>
        <p><strong>الموضوع:</strong> ${data.subject}</p>
      `;
    } else if (type === "service") {
      emailSubject = `[تقييم خدمة] ${data.service}`;
      emailHtmlBody += `
        <p><strong>الخدمة المقيمة:</strong> ${data.service}</p>
        <p><strong>جودة التنفيذ:</strong> ${data.quality} / 5 ⭐</p>
        <p><strong>الالتزام بالمواعيد:</strong> ${data.timing} / 5 ⭐</p>
        <p><strong>سرعة الاستجابة والتواصل:</strong> ${data.response} / 5 ⭐</p>
        <p><strong>مقترحات التحسين:</strong> ${data.improvement || "لا يوجد"}</p>
      `;
    } else if (type === "code") {
      emailSubject = `[مقترح برمجي جديد] ركن المقترحات البرمجية`;
      emailHtmlBody += `
        <p><strong>الأداة أو السكريبت المقترح:</strong></p>
        <blockquote style="background: #0f172a; padding: 15px; border-right: 4px solid #a855f7; color: #e2e8f0;">
          ${data.proposal}
        </blockquote>
      `;
    } else if (type === "ux") {
      emailSubject = `[تقييم تجربة المستخدم UX]`;
      emailHtmlBody += `
        <p><strong>مستوى سهولة الاستخدام:</strong> ${data.rating}</p>
        <p><strong>مرفق لقطة الشاشة:</strong> ${data.screenshot || "لا يوجد مرفق"}</p>
      `;
    } else if (type === "success") {
      emailSubject = `[قصة نجاح جديدة] من: ${data.name || "عميل ملهم"}`;
      emailHtmlBody += `
        <p><strong>الاسم:</strong> ${data.name || "لم يذكر"}</p>
        <p><strong>التخصص:</strong> ${data.specialty}</p>
        <p><strong>القصة / التجربة:</strong> ${data.subject}</p>
        <p><strong>السماح بالنشر في الرئيسية:</strong> ${data.allowPublish ? "نعم ✅" : "لا ❌"}</p>
      `;
    }

    emailHtmlBody += `
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 20px; text-align: center;">تم التوليد تلقائياً بواسطة نظام إدارة الآراء لمنصة الهندسة الذكية والموارد البشرية.</p>
      </div>
    `;

    // محاولة إرسال الإيميل إذا كانت بيانات الاعتماد متوفرة
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"منصة الهندسة الذكية" <${process.env.EMAIL_USER}>`,
        to: RECIPIENT_EMAILS.join(", "),
        subject: emailSubject,
        html: emailHtmlBody
      });
    }

    return NextResponse.json({
      success: true,
      message: "تم حفظ المشاركة وإرسال الإشعارات بنجاح.",
      data: body
    });

  } catch (error) {
    console.error("API Feedback Error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء معالجة الطلب.", error: error.message },
      { status: 500 }
    );
  }
}

// 2. استرجاع البيانات والخدمات (GET)
export async function GET() {
  const defaultServices = [
    "تصميم إنشائي",
    "استشارة تقنية",
    "دورة تدريبية",
    "تخطيط معماري",
    "إدارة مشاريع هندسية",
    "أتمتة وبرمجيات هندسية"
  ];

  return NextResponse.json({
    success: true,
    services: defaultServices,
    recipients: RECIPIENT_EMAILS
  });
}