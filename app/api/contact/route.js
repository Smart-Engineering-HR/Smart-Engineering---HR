import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

// تهيئة Prisma Client
const prisma = new PrismaClient();

// إعداد عامل إرسال البريد الإلكتروني (Nodemailer - ProtonMail)
const transporter = nodemailer.createTransport({
  host: 'smtp.protonmail.ch',
  port: 587,
  secure: false,
  auth: {
    user: 'Smart.Engineering.Global@proton.me',
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function POST(req) {
  try {
    const data = await req.json();
    const { type, company, companyName, contactName, phone, email, adCategory, message } = data;

    // 1. حفظ الطلب في قاعدة البيانات (للأرشفة والتوثيق)
    await prisma.contactRequest.create({
      data: {
        type: type || adCategory || 'GENERAL_INQUIRY',
        data: JSON.stringify(data),
        status: 'PENDING'
      }
    });

    // 2. إرسال إشعار للمسؤولين (من الكود الأول)
    const adminEmails = [
      "Smart.Engineering.Global@proton.me",
      "smart.engineering.global@tuta.io",
      "smartengineering.hr.global@gmail.com"
    ];

    for (const recipient of adminEmails) {
      await transporter.sendMail({
        from: '"بوابة الهندسة الذكية" <web@smart-engineering.com>',
        to: recipient,
        subject: `طلب جديد عبر المنصة: ${adCategory || type || 'تواصل'}`,
        html: `
          <h1>تفاصيل طلب الإعلان الجديد</h1>
          <p><strong>الشركة:</strong> ${companyName || company || 'غير محدد'}</p>
          <p><strong>المسؤول:</strong> ${contactName || 'غير محدد'}</p>
          <p><strong>الهاتف:</strong> ${phone || 'غير محدد'}</p>
          <p><strong>البريد الإلكتروني:</strong> ${email || 'غير محدد'}</p>
          <p><strong>النوع/الفئة:</strong> ${adCategory || type || 'غير محدد'}</p>
          <p><strong>ملاحظات:</strong> ${message || 'لا يوجد'}</p>
          <hr />
          <p><small>تم استلام هذا الطلب عبر بوابة الهندسة الذكية.</small></p>
        `
      });
    }

    // 3. إرسال رد تلقائي ذكي للعميل (من الكود الثاني)
    if (email) {
      const isComplaint = (type === 'complaint' || adCategory === 'complaint');
      const subject = isComplaint ? "شكواكم قيد المعالجة" : "تم استلام استفساركم";
      const content = isComplaint 
        ? "نعتذر عما واجهته، تم تحويل شكواك للإدارة وستتم متابعتها."
        : "شكراً لتواصلك، فريقنا التقني يراجع استفسارك وسنرد عليك قريباً.";

      await transporter.sendMail({
        from: '"بوابة الهندسة الذكية" <web@smart-engineering.com>',
        to: email,
        subject: subject,
        text: content
      });
    }

    // 4. الرد بنجاح
    return NextResponse.json(
      { success: true, message: "تم حفظ الطلب وإرسال الإشعارات والرد التلقائي بنجاح" }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("خطأ في معالجة طلب الاتصال:", error);
    return NextResponse.json(
      { success: false, error: error.message || "حدث خطأ أثناء معالجة طلبك" }, 
      { status: 500 }
    );
  }
}