// app/api/academy/route.js
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
      const item = await prisma.academyItem.findUnique({ where: { id: id } });
      return item ? NextResponse.json(item, { status: 200 }) : NextResponse.json({ error: "العنصر غير موجود" }, { status: 404 });
    }

    if (isPublicQuery === 'true') {
      const publicItems = await prisma.academyItem.findMany({
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(publicItems, { status: 200 });
    }

    const allItems = await prisma.academyItem.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(allItems, { status: 200 });
  } catch (error) {
    console.error("Error in Academy GET API:", error);
    return NextResponse.json({ error: "فشل الجلب" }, { status: 500 });
  }
}

// 2. دالة الإضافة (POST)
export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.title || !body.category) {
      return NextResponse.json({ error: "العنوان والتصنيف مطلوبان" }, { status: 400 });
    }

    const dataToSave = {
      category: body.category,
      title: body.title,
      subCategory: body.subCategory || null,
      details: typeof body.details === 'string' ? body.details : JSON.stringify(body.details || {}),
      status: body.status || "APPROVED"
    };

    const newItem = await prisma.academyItem.create({ data: dataToSave });

    const mailOptions = {
      from: `"منصة الهندسة الذكية 🚀" <${gmailAdminEmail}>`,
      to: [gmailAdminEmail, ...externalAdminEmails].join(','),
      subject: `إضافة أكاديمية جديدة: ${dataToSave.title}`,
      html: `
        <div dir="rtl" style="font-family: sans-serif; line-height: 1.6;">
          <h3>تم إضافة عنصر أكاديمي جديد</h3>
          <p><strong>العنوان:</strong> ${dataToSave.title}</p>
          <p><strong>التصنيف:</strong> ${dataToSave.category}</p>
          <pre>${JSON.stringify(body, null, 2)}</pre>
        </div>
      `
    };

    try { await transporter.sendMail(mailOptions); } catch (e) { console.error("Email error:", e); }

    if (newItem.status === 'APPROVED') {
      processNotifications(newItem.id).catch(err => console.error("خطأ في معالجة الإشعارات:", err));
    }

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error in Academy POST API:", error);
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
      category: updateData.category,
      title: updateData.title,
      subCategory: updateData.subCategory,
      details: typeof updateData.details === 'string' ? updateData.details : JSON.stringify(updateData.details || {}),
      status: status || updateData.status
    };

    Object.keys(allowedFields).forEach(key => allowedFields[key] === undefined && delete allowedFields[key]);

    const updated = await prisma.academyItem.update({
      where: { id: id },
      data: allowedFields
    });

    if (updated.status === 'APPROVED') {
      processNotifications(id).catch(err => console.error("خطأ في معالجة الإشعارات:", err));
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error in Academy PUT API:", error);
    return NextResponse.json({ error: "فشل التعديل: البيانات غير متطابقة" }, { status: 500 });
  }
}

// 4. دالة الحذف (DELETE)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });

    await prisma.academyItem.delete({ where: { id: id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in Academy DELETE API:", error);
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}