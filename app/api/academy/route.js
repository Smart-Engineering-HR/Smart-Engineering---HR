import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

// إعداد مُرسل البريد الإلكتروني مع التحقق الآمن
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com',
    pass: process.env.EMAIL_PASS || ''
  }
});

const externalAdminEmails = ['Smart.Engineering.Global@proton.me', 'smart.engineering.global@tuta.io'];
const gmailAdminEmail = 'smartengineering.hr.global@gmail.com';

// 1. جلب البيانات (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const isPublicQuery = searchParams.get('public');

    if (id) {
      const item = await prisma.academyItem.findUnique({ where: { id: id } });
      return item 
        ? NextResponse.json(item, { status: 200 }) 
        : NextResponse.json({ error: "العنصر غير موجود" }, { status: 404 });
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
    return NextResponse.json({ error: error.message || "فشل الجلب من قاعدة البيانات" }, { status: 500 });
  }
}

// 2. الإضافة والنشر (POST)
export async function POST(req) {
  try {
    const body = await req.json();
    
    const title = body.title || body.name || "عنصر أكاديمي جديد";
    const category = body.category || "proCourses";

    if (!title || !category) {
      return NextResponse.json({ error: "العنوان والتصنيف مطلوبان" }, { status: 400 });
    }

    // تجهيز وتنظيف البيانات للـ Prisma
    const dataToSave = {
      category: String(category),
      title: String(title),
      subCategory: body.subCategory ? String(body.subCategory) : null,
      details: typeof body.details === 'string' ? body.details : JSON.stringify(body.details || {}),
      status: body.status || "APPROVED"
    };

    // الحفظ في قاعدة البيانات عبر Prisma
    let newItem;
    try {
      newItem = await prisma.academyItem.create({ data: dataToSave });
    } catch (dbError) {
      console.error("Prisma Creation Error:", dbError);
      return NextResponse.json(
        { error: `فشل الحفظ في قاعدة البيانات: ${dbError.message}` }, 
        { status: 500 }
      );
    }

    // إرسال البريد الإلكتروني كإشعار إداري (معزول لكي لا يوقف النشر في حال تعثره)
    try {
      if (process.env.EMAIL_PASS) {
        const mailOptions = {
          from: `"منصة الهندسة الذكية 🚀" <${gmailAdminEmail}>`,
          to: [gmailAdminEmail, ...externalAdminEmails].join(','),
          subject: `إضافة أكاديمية جديدة: ${dataToSave.title}`,
          html: `
            <div dir="rtl" style="font-family: sans-serif; line-height: 1.6;">
              <h3>تم إضافة عنصر أكاديمي جديد بنجاح</h3>
              <p><strong>العنوان:</strong> ${dataToSave.title}</p>
              <p><strong>التصنيف:</strong> ${dataToSave.category}</p>
              <pre>${JSON.stringify(body, null, 2)}</pre>
            </div>
          `
        };
        await transporter.sendMail(mailOptions);
      }
    } catch (emailErr) {
      console.warn("تعذر إرسال بريد الإشعار، لكن تم النشر والحفظ بنجاح:", emailErr);
    }

    // استدعاء محرك الإشعارات بأمان
    try {
      const notificationEngine = await import('@/lib/notificationEngine').catch(() => null);
      if (notificationEngine && typeof notificationEngine.processNotifications === 'function') {
        notificationEngine.processNotifications(newItem.id).catch(err => console.error("خطأ في معالجة الإشعارات:", err));
      }
    } catch (notifErr) {
      console.warn("تخطّي محرك الإشعارات:", notifErr);
    }

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error in Academy POST API:", error);
    return NextResponse.json({ error: error.message || "فشل الحفظ في قاعدة البيانات" }, { status: 500 });
  }
}

// 3. التحديث (PUT)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, status, ...updateData } = body;
    if (!id) return NextResponse.json({ error: "المعرف (id) مطلوب" }, { status: 400 });

    const allowedFields = {
      category: updateData.category ? String(updateData.category) : undefined,
      title: updateData.title ? String(updateData.title) : undefined,
      subCategory: updateData.subCategory !== undefined ? (updateData.subCategory ? String(updateData.subCategory) : null) : undefined,
      details: updateData.details !== undefined ? (typeof updateData.details === 'string' ? updateData.details : JSON.stringify(updateData.details || {})) : undefined,
      status: status || updateData.status
    };

    Object.keys(allowedFields).forEach(key => allowedFields[key] === undefined && delete allowedFields[key]);

    const updated = await prisma.academyItem.update({
      where: { id: id },
      data: allowedFields
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error in Academy PUT API:", error);
    return NextResponse.json({ error: error.message || "فشل التعديل في قاعدة البيانات" }, { status: 500 });
  }
}

// 4. الحذف (DELETE)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "المعرف (id) مطلوب" }, { status: 400 });

    await prisma.academyItem.delete({ where: { id: id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in Academy DELETE API:", error);
    return NextResponse.json({ error: error.message || "فشل الحذف من قاعدة البيانات" }, { status: 500 });
  }
}