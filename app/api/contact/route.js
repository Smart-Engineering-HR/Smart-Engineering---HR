import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// إعداد خدمة الإرسال مع دعومات إضافية لتأكيد الوصول للإيميلات
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com',
    pass: process.env.EMAIL_PASS || '' // App Password الخاص بـ Gmail
  }
});

export async function POST(req) {
  try {
    const data = await req.json();
    const { type, contactName, email, adCategory, message, requestedDate, fileName, fileData } = data;

    // 1. التوثيق في قاعدة البيانات
    try {
      await prisma.contactRequest.create({
        data: {
          type: type || 'GENERAL_INQUIRY',
          data: JSON.stringify({ contactName, email, adCategory, message, requestedDate, fileName }),
          status: 'PENDING'
        }
      });
    } catch (dbErr) {
      console.warn("تنبيه: تعذر الحفظ في Prisma DB وسيطبق الإرسال المباشر للبريد:", dbErr.message);
    }

    // 2. قائمة الإيميلات الثلاثة المعتمدة للاستقبال
    const adminEmails = [
      "Smart.Engineering.Global@proton.me",
      "smart.engineering.global@tuta.io",
      "smartengineering.hr.global@gmail.com"
    ];

    // إعداد المرفق البرمجي إن وجد
    let attachmentsArr = [];
    if (fileData && fileData.includes(',')) {
      const base64Content = fileData.split(',')[1];
      attachmentsArr.push({
        filename: fileName || 'attached_document',
        content: Buffer.from(base64Content, 'base64')
      });
    }

    const mailSubject = `[رسالة تواصل جديد] ${adCategory || type || 'استفسار جديد'}`;
    const htmlBody = `
      <div style="direction: rtl; font-family: sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px;">
        <h2 style="color: #38bdf8; border-bottom: 1px solid #334155; padding-bottom: 10px;">إشعار استلام مراسلة ومرفقات - منصة الهندسة الذكية</h2>
        <p><strong>نوع الطلب:</strong> ${type === 'CONSULTATION_BOOKING' ? 'حجز استشارة هندسية [FORM-C]' : 'نموذج مراسلة ذكي [FORM-B]'}</p>
        <p><strong>اسم المرسل / العميل:</strong> ${contactName || 'غير محدد'}</p>
        <p><strong>البريد الإلكتروني للعميل:</strong> ${email || 'غير محدد'}</p>
        <p><strong>الموضوع / التصنيف:</strong> ${adCategory || 'عام'}</p>
        ${requestedDate ? `<p style="color: #818cf8;"><strong>الموعد المطلوب للاستشارة:</strong> ${requestedDate}</p>` : ''}
        <p><strong>اسم الملف المرفق:</strong> ${fileName || 'لا يوجد ملف مرفق'}</p>
        <div style="background-color: #1e293b; padding: 15px; border-radius: 8px; margin-top: 15px; border-right: 4px solid #38bdf8;">
          <strong>نص الرسالة وشرح الاستفسار:</strong>
          <p style="white-space: pre-line; color: #e2e8f0;">${message || 'لا يوجد نص'}</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8;">تم إرسال هذا الإشعار تلقائياً من منصة الهندسة الذكية والموارد البشرية.</p>
      </div>
    `;

    // 3. البث الفوري للإيميلات الثلاثة
    if (process.env.EMAIL_PASS) {
      for (const recipient of adminEmails) {
        try {
          await transporter.sendMail({
            from: '"منصة الهندسة الذكية" <smartengineering.hr.global@gmail.com>',
            to: recipient,
            subject: mailSubject,
            html: htmlBody,
            attachments: attachmentsArr
          });
        } catch (mailErr) {
          console.error(`خطأ أثناء إرسال البريد لـ ${recipient}:`, mailErr.message);
        }
      }
    }

    return NextResponse.json(
      { success: true, message: "تم إرسال الرسالة والمرفق بنجاح وتوجيه البيانات للوحة الأدمن" }, 
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