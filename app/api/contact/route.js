import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// إعداد خادم البريد المعتمد (Nodemailer)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.protonmail.ch',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: 'Smart.Engineering.Global@proton.me',
    pass: process.env.EMAIL_PASSWORD || ''
  }
});

export async function POST(req) {
  try {
    const data = await req.json();
    const { type, contactName, email, adCategory, message, requestedDate, fileName } = data;

    // 1. التوثيق والأرشفة في قاعدة البيانات (Prisma DB)
    try {
      await prisma.contactRequest.create({
        data: {
          type: type || 'GENERAL_INQUIRY',
          data: JSON.stringify(data),
          status: 'PENDING'
        }
      });
    } catch (dbErr) {
      console.warn("تنبيه: تعذر الحفظ في DB ولكن سيتم الاستمرار بإرسال الإشعارات البريدية:", dbErr.message);
    }

    // 2. قائمة الإيميلات الثلاثة المحددة استقبالها بدقة
    const adminEmails = [
      "Smart.Engineering.Global@proton.me",
      "smart.engineering.global@tuta.io",
      "smartengineering.hr.global@gmail.com"
    ];

    const mailSubject = `طلب جديد عبر قائمة تواصل معنا: ${adCategory || type || 'تواصل جديد'}`;
    const htmlBody = `
      <div style="direction: rtl; font-family: sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px;">
        <h2 style="color: #38bdf8; border-bottom: 1px solid #334155; padding-bottom: 10px;">إشعار استلام مراسلة جديدة - منصة الهندسة الذكية</h2>
        <p><strong>نوع الطلب:</strong> ${type === 'CONSULTATION_BOOKING' ? 'حجز استشارة هندسية [FORM-C]' : 'نموذج مراسلة ذكي [FORM-B]'}</p>
        <p><strong>اسم المرسل / المستشير:</strong> ${contactName || 'غير محدد'}</p>
        <p><strong>البريد الإلكتروني للمراسل:</strong> ${email || 'غير محدد'}</p>
        <p><strong>الموضوع / التصنيف:</strong> ${adCategory || 'عام'}</p>
        ${requestedDate ? `<p style="color: #818cf8;"><strong>الموعد المطلوب للاستشارة:</strong> ${requestedDate}</p>` : ''}
        <p><strong>الملف المرفق / المخطط:</strong> ${fileName || 'لا يوجد ملف مرفق'}</p>
        <div style="background-color: #1e293b; padding: 15px; border-radius: 8px; margin-top: 15px; border-right: 4px solid #38bdf8;">
          <strong>نص الرسالة وشرح المتطلبات:</strong>
          <p style="white-space: pre-line; color: #e2e8f0;">${message || 'لا يوجد نص'}</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8;">تم البث التلقائي عبر بوابة منصة الهندسة الذكية والموارد البشرية.</p>
      </div>
    `;

    // 3. إرسال النسخ البريدية للمشرفين والأدمن
    for (const recipient of adminEmails) {
      try {
        await transporter.sendMail({
          from: '"منصة الهندسة الذكية" <Smart.Engineering.Global@proton.me>',
          to: recipient,
          subject: mailSubject,
          html: htmlBody
        });
      } catch (e) {
        console.error(`خطأ في إرسال البريد إلى ${recipient}:`, e.message);
      }
    }

    // 4. إرسال رد تأكيدي تلقائي للعميل
    if (email) {
      try {
        await transporter.sendMail({
          from: '"منصة الهندسة الذكية" <Smart.Engineering.Global@proton.me>',
          to: email,
          subject: "تم استلام طلبكم - منصة الهندسة الذكية",
          html: `
            <div style="direction: rtl; font-family: sans-serif; padding: 20px;">
              <h3 style="color: #0284c7;">مرحباً ${contactName || ''}</h3>
              <p>شكراً لتواصلك مع منصة الهندسة الذكية والموارد البشرية. تم استقبال طلبك بنجاح وحفظه في لوحة التحكم الإدارية.</p>
              <p>سيقوم فريقنا المهندسي والمختص بمراجعة المرفقات والاستفسار والرد عليك قريباً.</p>
            </div>
          `
        });
      } catch (autoReplyErr) {
        console.warn("تنبيه الرد التلقائي للعميل:", autoReplyErr.message);
      }
    }

    return NextResponse.json(
      { success: true, message: "تم استقبال الطلب وحفظه وإشعار الإدارة بنجاح" }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("خطأ معالجة API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "حدث خطأ في الخادم" }, 
      { status: 500 }
    );
  }
}