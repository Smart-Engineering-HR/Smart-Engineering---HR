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

// جلب جميع الطلبات للوحة تحكم الأدمن
export async function GET() {
  try {
    const apps = await prisma.academyApplication.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(apps, { status: 200 });
  } catch (error) {
    console.error("GET Applications Error:", error);
    return NextResponse.json({ error: "فشل جلب طلبات التقديم" }, { status: 500 });
  }
}

// استقبال طلب جديد وحفظه وإرساله فورياً بريدياً مع المرفقات
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

    const nameVal = bodyData.fullName || bodyData.applicantName || bodyData.name || 'متقدم جديد';
    const emailVal = bodyData.email || 'غير محدد';
    const phoneVal = bodyData.phone || 'غير محدد';
    const titleVal = bodyData.itemTitle || bodyData.scholarshipTitle || 'طلب منحة / برنامج أكاديمي';
    const idVal = bodyData.itemId || '';

    // 1. الحفظ في قاعدة البيانات (تضمين fullName لمنع خطأ Prisma)
    const savedApp = await prisma.academyApplication.create({
      data: {
        fullName: String(nameVal),         // الحقل المطلوب في Prisma Schema
        applicantName: String(nameVal),
        itemId: String(idVal),
        itemTitle: String(titleVal),
        email: String(emailVal),
        phone: String(phoneVal),
        passportUrl: String(bodyData.passportUrl || bodyData.passport || ''),
        cvUrl: String(bodyData.cvUrl || bodyData.cv || ''),
        motivationUrl: String(bodyData.motivationUrl || bodyData.motivation || ''),
        recommendationUrl: String(bodyData.recommendationUrl || bodyData.recommendation || ''),
        languageCertUrl: String(bodyData.languageCertUrl || bodyData.languageCert || ''),
        photoUrl: String(bodyData.photoUrl || bodyData.photo || ''),
        files: typeof bodyData.files === 'object' ? JSON.stringify(bodyData.files) : String(bodyData.files || ''),
        status: 'PENDING'
      }
    });

    // 2. إرسال البريد الإلكتروني الفوري للأدمن مع الملفات المرفقة
    if (process.env.EMAIL_PASS) {
      const emailHtml = `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #0d9488; border-radius: 8px; background-color: #f9fafb;">
          <h2 style="color: #0d9488;">🎓 طلب تقديم جديد: ${titleVal}</h2>
          <hr />
          <p><strong>👤 اسم المتقدم:</strong> ${nameVal}</p>
          <p><strong>📧 البريد الإلكتروني:</strong> ${emailVal}</p>
          <p><strong>📱 رقم الهاتف:</strong> ${phoneVal}</p>
          <br />
          <h3 style="color: #0d9488;">📂 المستندات والروابط:</h3>
          <ul>
            ${bodyData.passportUrl ? `<li><strong>جواز السفر:</strong> <a href="${bodyData.passportUrl}">رابط الجواز</a></li>` : ''}
            ${bodyData.cvUrl ? `<li><strong>السيرة الذاتية:</strong> <a href="${bodyData.cvUrl}">رابط السيرة الذاتية</a></li>` : ''}
            ${bodyData.motivationUrl ? `<li><strong>خطاب الدافع:</strong> <a href="${bodyData.motivationUrl}">رابط الخطاب</a></li>` : ''}
            ${bodyData.recommendationUrl ? `<li><strong>خطابات التوصية:</strong> <a href="${bodyData.recommendationUrl}">رابط التوصية</a></li>` : ''}
            ${bodyData.languageCertUrl ? `<li><strong>شهادة اللغة:</strong> <a href="${bodyData.languageCertUrl}">رابط الشهادة</a></li>` : ''}
            ${bodyData.photoUrl ? `<li><strong>الصورة الشخصية:</strong> <a href="${bodyData.photoUrl}">رابط الصورة</a></li>` : ''}
          </ul>
          <p style="font-size: 12px; color: #6b7280;">ملاحظة: تم إرفاق الملفات المرفوعة مباشرة مع هذا البريد الإلكتروني إن وجدت.</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"منصة الهندسة الذكية 🚀" <${process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com'}>`,
        to: adminEmails.join(','),
        subject: `🎓 طلب منحة جديد: ${nameVal} - ${titleVal}`,
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