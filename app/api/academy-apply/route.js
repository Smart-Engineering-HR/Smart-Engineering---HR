import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com',
    pass: process.env.EMAIL_PASS || ''
  }
});

const adminEmails = [
  'smartengineering.hr.global@gmail.com',
  'Smart.Engineering.Global@proton.me',
  'smart.engineering.global@tuta.io'
];

// 1. GET: جلب جميع الطلبات وتفكيك حقل details لصفحة الأدمن
export async function GET() {
  try {
    const applications = await prisma.academyApplication.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const formattedApps = applications.map(app => {
      let extra = {};
      if (app.details) {
        try {
          extra = typeof app.details === 'string' ? JSON.parse(app.details) : app.details;
        } catch (e) {
          extra = {};
        }
      }
      return {
        ...app,
        ...extra
      };
    });

    return NextResponse.json(formattedApps, { status: 200 });
  } catch (error) {
    console.error("GET Applications Error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// 2. POST: استقبال الطلب والحفظ وإرسال البريد والمرفقات
export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let bodyData = {};
    let attachmentsList = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      for (const [key, value] of formData.entries()) {
        if (value && typeof value === 'object' && value.name) {
          const buffer = Buffer.from(await value.arrayBuffer());
          attachmentsList.push({
            filename: value.name,
            content: buffer
          });
          bodyData[key] = value.name;
        } else {
          bodyData[key] = value;
        }
      }
    } else {
      bodyData = await req.json();
    }

    const fullName = bodyData.fullName || bodyData.applicantName || bodyData.name || 'متقدم جديد';
    const email = bodyData.email || 'غير محدد';
    const phone = bodyData.phone || 'غير محدد';
    const scholarshipName = bodyData.scholarshipName || bodyData.itemTitle || bodyData.scholarshipTitle || 'منحة / برنامج أكاديمي';

    const extraDetails = {
      itemId: bodyData.itemId || '',
      passportUrl: bodyData.passportUrl || bodyData.passport || '',
      cvUrl: bodyData.cvUrl || bodyData.cv || '',
      motivationUrl: bodyData.motivationUrl || bodyData.motivation || '',
      recommendationUrl: bodyData.recommendationUrl || bodyData.recommendation || '',
      languageCertUrl: bodyData.languageCertUrl || bodyData.languageCert || '',
      photoUrl: bodyData.photoUrl || bodyData.photo || ''
    };

    // أ) الحفظ في قاعدة البيانات
    let savedApp = null;
    try {
      savedApp = await prisma.academyApplication.create({
        data: {
          fullName: String(fullName),
          email: String(email),
          phone: String(phone),
          scholarshipName: String(scholarshipName),
          details: JSON.stringify(extraDetails)
        }
      });
    } catch (dbError) {
      console.error("Prisma Save Error:", dbError.message);
    }

    // ب) إرسال البريد الإلكتروني مع المرفقات إلى الإدارة
    if (process.env.EMAIL_PASS) {
      const emailHtml = `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #0d9488; border-radius: 8px; background-color: #f9fafb;">
          <h2 style="color: #0d9488;">🎓 طلب تقديم جديد على منحة: ${scholarshipName}</h2>
          <hr />
          <p><strong>👤 اسم المتقدم:</strong> ${fullName}</p>
          <p><strong>📧 البريد الإلكتروني:</strong> ${email}</p>
          <p><strong>📱 رقم الهاتف:</strong> ${phone}</p>
          <br />
          <h3 style="color: #0d9488;">📂 المستندات والروابط:</h3>
          <ul>
            ${extraDetails.passportUrl ? `<li><strong>جواز السفر:</strong> <a href="${extraDetails.passportUrl}">رابط الجواز</a></li>` : ''}
            ${extraDetails.cvUrl ? `<li><strong>السيرة الذاتية:</strong> <a href="${extraDetails.cvUrl}">رابط السيرة الذاتية</a></li>` : ''}
            ${extraDetails.motivationUrl ? `<li><strong>خطاب الدافع:</strong> <a href="${extraDetails.motivationUrl}">رابط الخطاب</a></li>` : ''}
            ${extraDetails.recommendationUrl ? `<li><strong>خطابات التوصية:</strong> <a href="${extraDetails.recommendationUrl}">رابط التوصية</a></li>` : ''}
            ${extraDetails.languageCertUrl ? `<li><strong>شهادة اللغة:</strong> <a href="${extraDetails.languageCertUrl}">رابط الشهادة</a></li>` : ''}
            ${extraDetails.photoUrl ? `<li><strong>الصورة الشخصية:</strong> <a href="${extraDetails.photoUrl}">رابط الصورة</a></li>` : ''}
          </ul>
          <p style="font-size: 12px; color: #6b7280; margin-top: 15px;">تم إرفاق الملفات المرفوعة مباشرة مع هذا البريد.</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"منصة الهندسة الذكية 🚀" <${process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com'}>`,
        to: adminEmails.join(','),
        subject: `🎓 طلب منحة جديد: ${fullName} - ${scholarshipName}`,
        html: emailHtml,
        attachments: attachmentsList
      });
    }

    return NextResponse.json({ success: true, data: savedApp }, { status: 201 });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || "حدث خطأ أثناء معالجة الطلب" }, { status: 500 });
  }
}