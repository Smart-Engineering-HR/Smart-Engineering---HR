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

// 1. GET - جلب جميع الطلبات للوحة تحكم الأدمن
export async function GET(req) {
  try {
    const applications = await prisma.academyApplication.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: "فشل جلب طلبات التقديم" }, { status: 500 });
  }
}

// 2. POST - حفظ طلب التقديم وإرسال الإيميلات
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

    const applicantName = bodyData.applicantName || bodyData.name || bodyData.fullName || 'متقدم جديد';
    const email = bodyData.email || 'غير محدد';
    const phone = bodyData.phone || 'غير محدد';
    const itemTitle = bodyData.itemTitle || bodyData.scholarshipTitle || 'منحة / برنامج أكاديمي';
    const itemId = bodyData.itemId || '';

    const passportUrl = bodyData.passportUrl || bodyData.passport || '';
    const cvUrl = bodyData.cvUrl || bodyData.cv || '';
    const motivationUrl = bodyData.motivationUrl || bodyData.motivation || '';
    const recommendationUrl = bodyData.recommendationUrl || bodyData.recommendation || '';
    const languageCertUrl = bodyData.languageCertUrl || bodyData.languageCert || '';
    const photoUrl = bodyData.photoUrl || bodyData.photo || '';
    const filesData = typeof bodyData.files === 'object' ? JSON.stringify(bodyData.files) : (bodyData.files || '');

    // أ) الحفظ في قاعدة البيانات
    let savedApp;
    try {
      savedApp = await prisma.academyApplication.create({
        data: {
          itemId: String(itemId),
          itemTitle: String(itemTitle),
          applicantName: String(applicantName),
          email: String(email),
          phone: String(phone),
          passportUrl: String(passportUrl),
          cvUrl: String(cvUrl),
          motivationUrl: String(motivationUrl),
          recommendationUrl: String(recommendationUrl),
          languageCertUrl: String(languageCertUrl),
          photoUrl: String(photoUrl),
          files: String(filesData),
          status: 'PENDING'
        }
      });
    } catch (dbErr) {
      console.error("DB Save Warning:", dbErr);
    }

    // ب) إرسال الإيميل للإدارة
    try {
      if (process.env.EMAIL_PASS) {
        const htmlTemplate = `
          <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #14b8a6; border-radius: 10px; background-color: #f9fafb;">
            <h2 style="color: #0f766e;">🎓 طلب تقديم جديد: ${itemTitle}</h2>
            <hr />
            <p><strong>👤 اسم المتقدم:</strong> ${applicantName}</p>
            <p><strong>📧 البريد الإلكتروني:</strong> ${email}</p>
            <p><strong>📱 رقم الهاتف:</strong> ${phone}</p>
            <br />
            <h3 style="color: #0f766e;">📂 المستندات والمرفقات:</h3>
            <ul>
              ${passportUrl ? `<li><strong>جواز السفر:</strong> <a href="${passportUrl}">رابط / ملف</a></li>` : ''}
              ${cvUrl ? `<li><strong>السيرة الذاتية:</strong> <a href="${cvUrl}">رابط / ملف</a></li>` : ''}
              ${motivationUrl ? `<li><strong>خطاب الدافع:</strong> <a href="${motivationUrl}">رابط / ملف</a></li>` : ''}
              ${recommendationUrl ? `<li><strong>خطابات التوصية:</strong> <a href="${recommendationUrl}">رابط / ملف</a></li>` : ''}
              ${languageCertUrl ? `<li><strong>شهادة اللغة:</strong> <a href="${languageCertUrl}">رابط / ملف</a></li>` : ''}
              ${photoUrl ? `<li><strong>الصورة الشخصية:</strong> <a href="${photoUrl}">رابط / ملف</a></li>` : ''}
            </ul>
            <p style="font-size: 12px; color: #6b7280;">تم إرسال هذا الطلب آلياً من منصة الهندسة الذكية HR & Academy.</p>
          </div>
        `;

        await transporter.sendMail({
          from: `"منصة الهندسة الذكية 🚀" <${process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com'}>`,
          to: adminEmails.join(','),
          subject: `🎓 طلب تقديم جديد: ${applicantName} - ${itemTitle}`,
          html: htmlTemplate,
          attachments: attachmentsList
        });
      } else {
        console.warn("EMAIL_PASS غير مفعّل في بيئة المتغيرات.");
      }
    } catch (emailErr) {
      console.error("Email Sending Error:", emailErr);
    }

    return NextResponse.json({ success: true, data: savedApp }, { status: 201 });

  } catch (error) {
    console.error("Error in POST academy-apply:", error);
    return NextResponse.json({ error: error.message || "حدث خطأ أثناء معالجة الطلب" }, { status: 500 });
  }
}

// 3. DELETE - حذف طلب من لوحة الأدمن
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "المعرف id مطلوب" }, { status: 400 });

    await prisma.academyApplication.delete({ where: { id: id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE academy-apply:", error);
    return NextResponse.json({ error: "فشل حذف الطلب" }, { status: 500 });
  }
}