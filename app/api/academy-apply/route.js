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

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let bodyData = {};
    let attachmentsList = [];

    // التعامل مع نوع البيانات سواء JSON أو Multipart Form Data
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      for (const [key, value] of formData.entries()) {
        if (value && typeof value === 'object' && value.name) {
          // التعامل مع الملفات المرفقة
          const buffer = Buffer.from(await value.arrayBuffer());
          attachmentsList.push({
            filename: `${key}_${value.name}`,
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

    const {
      itemId,
      itemTitle,
      applicantName,
      name,
      email,
      phone,
      passportUrl,
      cvUrl,
      motivationUrl,
      recommendationUrl,
      languageCertUrl,
      photoUrl,
      files
    } = bodyData;

    const finalName = applicantName || name || 'متقدم جديد';
    const finalEmail = email || 'غير محدد';
    const finalPhone = phone || 'غير محدد';
    const finalTitle = itemTitle || 'طلب تقديم أكاديمي / منحة';

    // 1. حفظ الطلب في قاعدة البيانات (Prisma / Supabase)
    let savedApplication = null;
    try {
      savedApplication = await prisma.academyApplication.create({
        data: {
          itemId: itemId ? String(itemId) : "",
          itemTitle: String(finalTitle),
          applicantName: String(finalName),
          email: String(finalEmail),
          phone: String(finalPhone),
          passportUrl: passportUrl ? String(passportUrl) : (bodyData.passport || ""),
          cvUrl: cvUrl ? String(cvUrl) : (bodyData.cv || ""),
          motivationUrl: motivationUrl ? String(motivationUrl) : (bodyData.motivation || ""),
          recommendationUrl: recommendationUrl ? String(recommendationUrl) : (bodyData.recommendation || ""),
          languageCertUrl: languageCertUrl ? String(languageCertUrl) : (bodyData.languageCert || ""),
          photoUrl: photoUrl ? String(photoUrl) : (bodyData.photo || ""),
          files: typeof files === 'object' ? JSON.stringify(files) : String(files || ""),
          status: 'PENDING'
        }
      });
    } catch (dbErr) {
      console.error("Warning: DB Save issue in Academy Application:", dbErr);
    }

    // 2. إرسال البريد الإلكتروني للأدمن بالملفات والبيانات
    try {
      if (process.env.EMAIL_PASS) {
        const htmlContent = `
          <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #0d9488;">🎓 طلب تقديم جديد على: ${finalTitle}</h2>
            <hr />
            <p><strong>اسم المتقدم:</strong> ${finalName}</p>
            <p><strong>البريد الإلكتروني:</strong> ${finalEmail}</p>
            <p><strong>رقم الهاتف:</strong> ${finalPhone}</p>
            <br />
            <h3>📄 المرفقات والروابط:</h3>
            <ul>
              ${passportUrl ? `<li><a href="${passportUrl}">نسخة جواز السفر</a></li>` : ''}
              ${cvUrl ? `<li><a href="${cvUrl}">السيرة الذاتية (CV)</a></li>` : ''}
              ${motivationUrl ? `<li><a href="${motivationUrl}">خطاب الدافع</a></li>` : ''}
              ${recommendationUrl ? `<li><a href="${recommendationUrl}">خطابات التوصية</a></li>` : ''}
              ${languageCertUrl ? `<li><a href="${languageCertUrl}">شهادة اللغة</a></li>` : ''}
              ${photoUrl ? `<li><a href="${photoUrl}">الصورة الشخصية</a></li>` : ''}
            </ul>
            <p style="font-size: 12px; color: #777;">تم إرسال هذا الطلب آلياً من منصة الهندسة الذكية.</p>
          </div>
        `;

        await transporter.sendMail({
          from: `"منصة الهندسة الذكية 🎓" <smartengineering.hr.global@gmail.com>`,
          to: adminEmails.join(','),
          subject: `طلب تقديم جديد: ${finalName} - ${finalTitle}`,
          html: htmlContent,
          attachments: attachmentsList
        });
      }
    } catch (emailErr) {
      console.error("Error sending admin application email:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'تم استلام طلبك بنجاح وإرساله إلى الإدارة.',
      data: savedApplication
    }, { status: 200 });

  } catch (error) {
    console.error("Error in academy-apply route:", error);
    return NextResponse.json({
      error: error.message || 'حدث خطأ أثناء معالجة الطلب.'
    }, { status: 500 });
  }
}