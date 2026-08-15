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

// جلب الطلبات للوحة تحكم الأدمن
export async function GET() {
  try {
    const apps = await prisma.academyApplication.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(apps, { status: 200 });
  } catch (error) {
    console.error("GET Applications Error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// استقبال طلب التقديم وحفظه وإرساله فورياً بريدياً مع المرفقات
export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let bodyData = {};
    let attachmentsList = [];

    // معالجة البيانات والملفات المرفوعة سواء كانت FormData أو JSON
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
    const scholarshipName = bodyData.itemTitle || bodyData.scholarshipTitle || bodyData.scholarshipName || 'طلب منحة / برنامج أكاديمي';

    // حفظ كل التفاصيل والروابط المرفقة في حقل details لتجنب أي تعارض في حقول Schema
    const detailsObj = {
      itemId: bodyData.itemId || '',
      passportUrl: bodyData.passportUrl || bodyData.passport || '',
      cvUrl: bodyData.cvUrl || bodyData.cv || '',
      motivationUrl: bodyData.motivationUrl || bodyData.motivation || '',
      recommendationUrl: bodyData.recommendationUrl || bodyData.recommendation || '',
      languageCertUrl: bodyData.languageCertUrl || bodyData.languageCert || '',
      photoUrl: bodyData.photoUrl || bodyData.photo || '',
      files: bodyData.files || ''
    };

    // 1. الحفظ في قاعدة البيانات مع مطابقة حقول Prisma المتوافقة
    let savedApp = null;
    try {
      savedApp = await prisma.academyApplication.create({
        data: {
          fullName: String(fullName),
          email: String(email),
          phone: String(phone),
          scholarshipName: String(scholarshipName),
          details: JSON.stringify(detailsObj)
        }
      });
    } catch (dbError) {
      console.error("Prisma Save Notice:", dbError.message);
    }

    // 2. إرسال البريد الإلكتروني الفوري للإدارة مع الملفات المرفقة
    if (process.env.EMAIL_PASS) {
      const emailHtml = `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #0d9488; border-radius: 8px; background-color: #f9fafb;">
          <h2 style="color: #0d9488;">🎓 طلب تقديم جديد: ${scholarshipName}</h2>
          <hr />
          <p><strong>👤 اسم المتقدم:</strong> ${fullName}</p>
          <p><strong>📧 البريد الإلكتروني:</strong> ${email}</p>
          <p><strong>📱 رقم الهاتف:</strong> ${phone}</p>
          <br />
          <h3 style="color: #0d9488;">📂 المستندات والروابط:</h3>
          <ul>
            ${detailsObj.passportUrl ? `<li><strong>جواز السفر:</strong> <a href="${detailsObj.passportUrl}">رابط الجواز</a></li>` : ''}
            ${detailsObj.cvUrl ? `<li><strong>السيرة الذاتية:</strong> <a href="${detailsObj.cvUrl}">رابط السيرة الذاتية</a></li>` : ''}
            ${detailsObj.motivationUrl ? `<li><strong>خطاب الدافع:</strong> <a href="${detailsObj.motivationUrl}">رابط الخطاب</a></li>` : ''}
            ${detailsObj.recommendationUrl ? `<li><strong>خطابات التوصية:</strong> <a href="${detailsObj.recommendationUrl}">رابط التوصية</a></li>` : ''}
            ${detailsObj.languageCertUrl ? `<li><strong>شهادة اللغة:</strong> <a href="${detailsObj.languageCertUrl}">رابط الشهادة</a></li>` : ''}
            ${detailsObj.photoUrl ? `<li><strong>الصورة الشخصية:</strong> <a href="${detailsObj.photoUrl}">رابط الصورة</a></li>` : ''}
          </ul>
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
    console.error("Academy Application Error:", error);
    return NextResponse.json({ error: error.message || "حدث خطأ أثناء معالجة الطلب" }, { status: 500 });
  }
}