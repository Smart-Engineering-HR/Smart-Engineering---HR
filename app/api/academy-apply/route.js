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

// جلب الطلبات للاستعراض في لوحة الأدمن
export async function GET() {
  try {
    const apps = await prisma.academyApplication.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(apps, { status: 200 });
  } catch (error) {
    console.error("GET Applications Error:", error);
    return NextResponse.json({ error: "فشل جلب الطلبات من قاعدة البيانات" }, { status: 500 });
  }
}

// استقبال طلب جديد وحفظه وإرساله بريدياً
export async function POST(req) {
  try {
    const body = await req.json();

    const applicantName = body.applicantName || body.name || body.fullName || 'متقدم جديد';
    const email = body.email || 'غير محدد';
    const phone = body.phone || 'غير محدد';
    const itemTitle = body.itemTitle || body.scholarshipTitle || 'طلب منحة / تدريب';
    const itemId = body.itemId || '';

    // حفظ الطلب في قاعدة البيانات
    const savedApp = await prisma.academyApplication.create({
      data: {
        itemId: String(itemId),
        itemTitle: String(itemTitle),
        applicantName: String(applicantName),
        email: String(email),
        phone: String(phone),
        passportUrl: String(body.passportUrl || body.passport || ''),
        cvUrl: String(body.cvUrl || body.cv || ''),
        motivationUrl: String(body.motivationUrl || body.motivation || ''),
        recommendationUrl: String(body.recommendationUrl || body.recommendation || ''),
        languageCertUrl: String(body.languageCertUrl || body.languageCert || ''),
        photoUrl: String(body.photoUrl || body.photo || ''),
        files: typeof body.files === 'object' ? JSON.stringify(body.files) : String(body.files || ''),
        status: 'PENDING'
      }
    });

    // إرسال الإشعار لبريد الإدارة
    if (process.env.EMAIL_PASS) {
      const emailHtml = `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #0d9488; border-radius: 8px;">
          <h2 style="color: #0d9488;">🎓 طلب تقديم جديد: ${itemTitle}</h2>
          <hr />
          <p><strong>اسم المتقدم:</strong> ${applicantName}</p>
          <p><strong>البريد الإلكتروني:</strong> ${email}</p>
          <p><strong>رقم الهاتف:</strong> ${phone}</p>
          <h3>📂 المستندات المرفوعة:</h3>
          <ul>
            ${body.passportUrl ? `<li><a href="${body.passportUrl}">نسخة جواز السفر</a></li>` : ''}
            ${body.cvUrl ? `<li><a href="${body.cvUrl}">السيرة الذاتية (CV)</a></li>` : ''}
            ${body.motivationUrl ? `<li><a href="${body.motivationUrl}">خطاب الدافع</a></li>` : ''}
            ${body.recommendationUrl ? `<li><a href="${body.recommendationUrl}">خطابات التوصية</a></li>` : ''}
            ${body.languageCertUrl ? `<li><a href="${body.languageCertUrl}">شهادة اللغة</a></li>` : ''}
            ${body.photoUrl ? `<li><a href="${body.photoUrl}">الصورة الشخصية</a></li>` : ''}
          </ul>
        </div>
      `;

      await transporter.sendMail({
        from: `"منصة الهندسة الذكية 🚀" <${process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com'}>`,
        to: adminEmails.join(','),
        subject: `🎓 طلب تقديم جديد من: ${applicantName} - ${itemTitle}`,
        html: emailHtml
      });
    }

    return NextResponse.json({ success: true, data: savedApp }, { status: 201 });

  } catch (error) {
    console.error("POST Application Error:", error);
    return NextResponse.json({ error: error.message || "حدث خطأ في معالجة الطلب" }, { status: 500 });
  }
}

// حذف طلب من الأدمن
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });

    await prisma.academyApplication.delete({ where: { id: id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}