// app/api/postings/route.js
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

// 1. دالة جلب البيانات (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const isPublicQuery = searchParams.get('public');

    if (id) {
      const posting = await prisma.advertisement.findUnique({ where: { id: id } });
      return posting ? NextResponse.json(posting) : NextResponse.json({ error: "غير موجود" }, { status: 404 });
    }

    if (isPublicQuery === 'true') {
      const publicPostings = await prisma.advertisement.findMany({
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(publicPostings, { status: 200 });
    }

    const allPostings = await prisma.advertisement.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(allPostings, { status: 200 });
  } catch (error) {
    console.error("Error in GET API:", error);
    return NextResponse.json({ error: "فشل الجلب" }, { status: 500 });
  }
}

// 2. دالة الإرسال (POST)
export async function POST(req) {
  try {
    const body = await req.json();
    const dataToSave = {
      companyName: body.companyName || body.company || "غير محدد",
      contactPerson: body.contactPerson || "غير محدد",
      phone: body.phone || "000000000",
      email: body.email || "no-email@provided.com",
      website: body.website || "",
      advertiseType: body.advertiseType || body.type || "وظيفة",
      address: body.address || body.location || "اليمن",
      moreInfo: typeof body.moreInfo === 'string' ? body.moreInfo : JSON.stringify(body),
      status: body.status || "PENDING"
    };

    const newPosting = await prisma.advertisement.create({ data: dataToSave });

    const mailOptions = {
      from: `"منصة الهندسة الذكية 🚀" <${gmailAdminEmail}>`,
      to: [gmailAdminEmail, ...externalAdminEmails].join(','),
      subject: `إعلان جديد: ${dataToSave.advertiseType} - ${dataToSave.companyName}`,
      html: `<div dir="rtl"><h3>طلب إعلان جديد</h3><p>تم استلام طلب جديد. يمكنك الاطلاع على كامل التفاصيل في لوحة التحكم.</p><pre>${JSON.stringify(body, null, 2)}</pre></div>`
    };

    try { await transporter.sendMail(mailOptions); } catch (e) { console.error("Email error:", e); }

    if (newPosting.status === 'APPROVED') {
      processNotifications(newPosting.id).catch(err => console.error("خطأ في معالجة الإشعارات:", err));
    }

    return NextResponse.json(newPosting, { status: 201 });
  } catch (error) {
    console.error("خطأ أثناء الحفظ:", error);
    return NextResponse.json({ error: "فشل الحفظ: تأكد من صحة البيانات" }, { status: 500 });
  }
}

// 3. دالة التحديث (PUT)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, status, ...updateData } = body;
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });

    const allowedFields = {
      companyName: updateData.companyName,
      contactPerson: updateData.contactPerson,
      phone: updateData.phone,
      email: updateData.email,
      website: updateData.website,
      advertiseType: updateData.advertiseType,
      address: updateData.address,
      moreInfo: typeof updateData.moreInfo === 'string' ? updateData.moreInfo : JSON.stringify(updateData),
      status: status || updateData.status
    };

    Object.keys(allowedFields).forEach(key => allowedFields[key] === undefined && delete allowedFields[key]);

    const updated = await prisma.advertisement.update({
      where: { id: id },
      data: allowedFields
    });

    if (updated.status === 'APPROVED') {
      processNotifications(id).catch(err => console.error("خطأ في معالجة الإشعارات:", err));
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error in PUT API:", error);
    return NextResponse.json({ error: "فشل التعديل: البيانات غير متطابقة مع المخطط" }, { status: 500 });
  }
}

// 4. دالة الحذف (DELETE)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });

    await prisma.advertisement.delete({ where: { id: id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE API:", error);
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}