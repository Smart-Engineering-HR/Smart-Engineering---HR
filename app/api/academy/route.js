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

const externalAdminEmails = ['Smart.Engineering.Global@proton.me', 'smart.engineering.global@tuta.io'];
const gmailAdminEmail = 'smartengineering.hr.global@gmail.com';

// 1. GET - جلب البيانات
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

// 2. POST - إضافة عنصر جديد
export async function POST(req) {
  try {
    const body = await req.json();
    
    const title = body.title || body.name || "عنصر أكاديمي جديد";
    const category = body.category || "proCourses";

    if (!title || !category) {
      return NextResponse.json({ error: "العنوان والتصنيف مطلوبان" }, { status: 400 });
    }

    const detailsValue = typeof body.details === 'string' 
      ? body.details 
      : JSON.stringify(body.details || {});

    // تجهيز البيانات
    const dataToSave = {
      category: String(category),
      title: String(title),
      subCategory: body.subCategory ? String(body.subCategory) : null,
      details: detailsValue,
      status: body.status || "APPROVED"
    };

    let newItem;
    try {
      newItem = await prisma.academyItem.create({ data: dataToSave });
    } catch (dbError) {
      console.error("Prisma Creation Error:", dbError);
      
      // معالجة ذكية للأعمدة المفقودة في Supabase
      if (dbError.message.includes("does not exist in the current database")) {
        // محاولة الحفظ البسيط بدون الأعمدة المتقدمة في حال عدم مزامنتها بعد
        try {
          newItem = await prisma.academyItem.create({
            data: {
              category: String(category),
              title: String(title)
            }
          });
        } catch (fallbackErr) {
          return NextResponse.json(
            { error: `يرجى تشغيل أمرين SQL في Supabase لإضافة أعمدة status و details: ${dbError.message}` }, 
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: `خطأ Prisma: ${dbError.message}` }, 
          { status: 500 }
        );
      }
    }

    // إرسال البريد عند النجاح
    try {
      if (process.env.EMAIL_PASS) {
        const mailOptions = {
          from: `"منصة الهندسة الذكية 🚀" <${gmailAdminEmail}>`,
          to: [gmailAdminEmail, ...externalAdminEmails].join(','),
          subject: `إضافة أكاديمية جديدة: ${dataToSave.title}`,
          html: `<div dir="rtl"><h3>تم النشر بنجاح: ${dataToSave.title}</h3></div>`
        };
        await transporter.sendMail(mailOptions);
      }
    } catch (emailErr) {
      console.warn("تعذر إرسال البريد ولكن النشر تم بنجاح:", emailErr);
    }

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error in Academy POST API:", error);
    return NextResponse.json({ error: error.message || "فشل الحفظ في قاعدة البيانات" }, { status: 500 });
  }
}

// 3. PUT - التحديث
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

// 4. DELETE - الحذف
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