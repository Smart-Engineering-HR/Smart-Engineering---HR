// app/api/academy-apply/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { processNotifications } from '@/lib/notificationEngine';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password-here'
  }
});

const externalAdminEmails = ['Smart.Engineering.Global@proton.me', 'smart.engineering.global@tuta.io'];
const gmailAdminEmail = 'smartengineering.hr.global@gmail.com';

// 1. دالة جلب طلبات التقديم (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const application = await prisma.academyApplication.findUnique({ where: { id: id } });
      return application ? NextResponse.json(application, { status: 200 }) : NextResponse.json({ error: "غير موجود" }, { status: 404 });
    }

    const allApplications = await prisma.academyApplication.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(allApplications, { status: 200 });
  } catch (error) {
    console.error("Error in Academy Apply GET API:", error);
    return NextResponse.json({ error: "فشل الجلب" }, { status: 500 });
  }
}

// 2. دالة إرسال طلب جديد (POST)
export async function POST(req) {
  try {
    const body = await req.json();

    const dataToSave = {
      fullName: body.fullName || "غير محدد",
      email: body.email || "no-email@provided.com",
      phone: body.phone || "000000000",
      scholarshipName: body.scholarshipName || body.courseName || "غير محدد",
      degree: body.degree || "",
      gpa: body.gpa || "",
      university: body.university || "",
      major: body.major || "",
      languageLevel: body.languageLevel || "",
      status: body.status || "PENDING"
    };

    let newApplication;
    try {
      newApplication = await prisma.academyApplication.create({ data: dataToSave });
    } catch (e) {
      console.warn("تعذر التخزين في قاعدة البيانات، سيتم الاكتفاء بالإرسال للبريد:", e);
      newApplication = { id: Date.now().toString(), ...dataToSave };
    }

    const mailOptions = {
      from: `"منصة الهندسة الذكية 🚀" <${gmailAdminEmail}>`,
      to: [gmailAdminEmail, ...externalAdminEmails].join(','),
      subject: `طلب تقديم أكاديمي جديد: ${dataToSave.scholarshipName} - ${dataToSave.fullName}`,
      html: `
        <div dir="rtl" style="font-family: sans-serif; line-height: 1.6;">
          <h2 style="color: #d97706;">طلب تقديم أكاديمي جديد</h2>
          <p><strong>الاسم الكامل:</strong> ${dataToSave.fullName}</p>
          <p><strong>البريد الإلكتروني:</strong> ${dataToSave.email}</p>
          <p><strong>رقم الهاتف:</strong> ${dataToSave.phone}</p>
          <hr/>
          <h3 style="color: #059669;">تفاصيل التقديم:</h3>
          <p><strong>البرنامج / المنحة:</strong> ${dataToSave.scholarshipName}</p>
          <p><strong>الدرجة العلمية:</strong> ${dataToSave.degree}</p>
          <p><strong>المعدل التراكمي:</strong> ${dataToSave.gpa}</p>
          <p><strong>الجامعة:</strong> ${dataToSave.university}</p>
          <p><strong>التخصص:</strong> ${dataToSave.major}</p>
          <p><strong>مستوى اللغة:</strong> ${dataToSave.languageLevel}</p>
        </div>
      `
    };

    try { await transporter.sendMail(mailOptions); } catch (e) { console.error("Email error:", e); }

    if (newApplication.status === 'APPROVED' && newApplication.id) {
      processNotifications(newApplication.id).catch(err => console.error("خطأ في معالجة الإشعارات:", err));
    }

    return NextResponse.json({ success: true, item: newApplication }, { status: 201 });
  } catch (error) {
    console.error("Error in Academy Apply POST API:", error);
    return NextResponse.json({ error: "فشل الحفظ: تأكد من صحة البيانات" }, { status: 500 });
  }
}

// 3. دالة التحديث وتغيير حالة الطلب (PUT)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, status, ...updateData } = body;
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });

    const allowedFields = {
      fullName: updateData.fullName,
      email: updateData.email,
      phone: updateData.phone,
      scholarshipName: updateData.scholarshipName,
      degree: updateData.degree,
      gpa: updateData.gpa,
      university: updateData.university,
      major: updateData.major,
      languageLevel: updateData.languageLevel,
      status: status || updateData.status
    };

    Object.keys(allowedFields).forEach(key => allowedFields[key] === undefined && delete allowedFields[key]);

    const updated = await prisma.academyApplication.update({
      where: { id: id },
      data: allowedFields
    });

    if (updated.status === 'APPROVED') {
      processNotifications(id).catch(err => console.error("خطأ في معالجة الإشعارات:", err));
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error in Academy Apply PUT API:", error);
    return NextResponse.json({ error: "فشل التعديل" }, { status: 500 });
  }
}

// 4. دالة الحذف (DELETE)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });

    await prisma.academyApplication.delete({ where: { id: id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in Academy Apply DELETE API:", error);
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}