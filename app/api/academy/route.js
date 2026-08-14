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

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const isPublicQuery = searchParams.get('public');

    if (id) {
      const item = await prisma.academyItem.findUnique({ where: { id: id } });
      return item 
        ? NextResponse.json(item, { status: 200 }) 
        : NextResponse.json({ error: "العنصر غير موجود في قاعدة البيانات" }, { status: 404 });
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

export async function POST(req) {
  try {
    const body = await req.json();
    const title = body.title || body.name || "عنصر أكاديمي جديد";
    const category = body.category || "proCourses";

    if (!title || !category) {
      return NextResponse.json({ error: "العنوان والتصنيف مطلوبان بشكل أساسي" }, { status: 400 });
    }

    const detailsValue = typeof body.details === 'string' 
      ? body.details 
      : JSON.stringify(body.details || {});

    const dataToSave = {
      category: String(category),
      title: String(title),
      subCategory: body.subCategory ? String(body.subCategory) : "",
      details: detailsValue,
      status: body.status || "APPROVED"
    };

    const newItem = await prisma.academyItem.create({ data: dataToSave });

    try {
      if (process.env.EMAIL_PASS) {
        await transporter.sendMail({
          from: `"منصة الهندسة الذكية 🚀" <${gmailAdminEmail}>`,
          to: [gmailAdminEmail, ...externalAdminEmails].join(','),
          subject: `إضافة جديدة في الأكاديمية: ${dataToSave.title}`,
          html: `<div dir="rtl"><h3>تم نشر عنصر جديد: ${dataToSave.title}</h3></div>`
        });
      }
    } catch (e) {
      console.warn("إشعارات الإيميل تعثرت لكن النشر نجح:", e);
    }

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error in Academy POST API:", error);
    return NextResponse.json({ error: error.message || "فشل الحفظ في قاعدة البيانات" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, status, ...updateData } = body;
    if (!id) return NextResponse.json({ error: "المعرف (id) مطلوب" }, { status: 400 });

    const allowedFields = {
      category: updateData.category ? String(updateData.category) : undefined,
      title: updateData.title ? String(updateData.title) : undefined,
      subCategory: updateData.subCategory !== undefined ? String(updateData.subCategory || "") : undefined,
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
    return NextResponse.json({ error: error.message || "فشل التعديل" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "المعرف (id) مطلوب" }, { status: 400 });

    await prisma.academyItem.delete({ where: { id: id } });
    return NextResponse.json({ success: true, message: "تم الحذف بنجاح" }, { status: 200 });
  } catch (error) {
    console.error("Error in Academy DELETE API:", error);
    return NextResponse.json({ error: error.message || "فشل الحذف" }, { status: 500 });
  }
}