import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// إنشاء الكائن مباشرة هنا ليعتمد الملف على نفسه كلياً
const prisma = new PrismaClient();

// 1. جلب كل البيانات لوجهات الأكاديمية ولوحة التحكم
export async function GET() {
  try {
    const scholarships = await prisma.scholarship.findMany({ orderBy: { createdAt: 'desc' } });
    const codes = await prisma.structuralCode.findMany({ orderBy: { createdAt: 'desc' } });
    const trainingItems = await prisma.trainingItem.findMany({ orderBy: { createdAt: 'desc' } });
    const scholarshipApps = await prisma.scholarshipApplication.findMany({ include: { scholarship: true }, orderBy: { createdAt: 'desc' } });
    const trainingRegs = await prisma.trainingRegistration.findMany({ include: { trainingItem: true }, orderBy: { createdAt: 'desc' } });

    return NextResponse.json({ scholarships, codes, trainingItems, scholarshipApps, trainingRegs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "فشل في جلب بيانات الأكاديمية والمصادر" }, { status: 500 });
  }
}

// 2. إضافة عنصر جديد أو استقبال طلبات تقديم المستخدمين والمهندسين
export async function POST(request) {
  try {
    const body = await request.json();
    const { target, data } = body;

    if (!target || !data) {
      return NextResponse.json({ error: "البيانات المرسلة غير مكتملة" }, { status: 400 });
    }

    if (target === 'scholarship') {
      const item = await prisma.scholarship.create({
        data: {
          title: data.title,
          country: data.country,
          level: data.level,
          funding: data.funding,
          deadline: new Date(data.deadline),
          details: data.details,
        }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (target === 'code') {
      const item = await prisma.structuralCode.create({
        data: { title: data.title, category: data.category, fileUrl: data.fileUrl }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (target === 'training') {
      const item = await prisma.trainingItem.create({
        data: {
          title: data.title,
          type: data.type,
          category: data.category,
          price: data.price,
          requirements: data.requirements,
          fileUrl: data.fileUrl || null,
        }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (target === 'scholarshipApp') {
      const item = await prisma.scholarshipApplication.create({
        data: {
          scholarshipId: data.scholarshipId,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          cvUrl: data.cvUrl,
        }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (target === 'trainingReg') {
      const item = await prisma.trainingRegistration.create({
        data: {
          trainingItemId: data.trainingItemId,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          paymentStatus: "PENDING",
          status: "PENDING"
        }
      });
      return NextResponse.json(item, { status: 201 });
    }

    return NextResponse.json({ error: "الهدف المطلوب غير صحيح" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "فشل في معالجة الإضافة البرمجية" }, { status: 500 });
  }
}

// 3. تحديث العناصر أو تعديل حالات الاعتماد والموافقات المالية
export async function PUT(request) {
  try {
    const body = await request.json();
    const { target, id, data } = body;

    if (!target || !id || !data) {
      return NextResponse.json({ error: "بيانات التحديث ناقصة" }, { status: 400 });
    }

    if (target === 'scholarship') {
      const updated = await prisma.scholarship.update({
        where: { id },
        data: {
          title: data.title,
          country: data.country,
          level: data.level,
          funding: data.funding,
          deadline: new Date(data.deadline),
          details: data.details
        }
      });
      return NextResponse.json(updated, { status: 200 });
    }

    if (target === 'code') {
      const updated = await prisma.structuralCode.update({
        where: { id },
        data: { title: data.title, category: data.category, fileUrl: data.fileUrl }
      });
      return NextResponse.json(updated, { status: 200 });
    }

    if (target === 'training') {
      const updated = await prisma.trainingItem.update({
        where: { id },
        data: {
          title: data.title,
          type: data.type,
          category: data.category,
          price: data.price,
          requirements: data.requirements,
          fileUrl: data.fileUrl || null
        }
      });
      return NextResponse.json(updated, { status: 200 });
    }

    if (target === 'scholarshipApp') {
      const updated = await prisma.scholarshipApplication.update({
        where: { id },
        data: { status: data.status }
      });
      return NextResponse.json(updated, { status: 200 });
    }

    if (target === 'trainingReg') {
      const updated = await prisma.trainingRegistration.update({
        where: { id },
        data: {
          status: data.status !== undefined ? data.status : undefined,
          paymentStatus: data.paymentStatus !== undefined ? data.paymentStatus : undefined
        }
      });
      return NextResponse.json(updated, { status: 200 });
    }

    return NextResponse.json({ error: "الهدف غير صالح للتعديل الإداري" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "فشل في تحديث السجلات الحالية" }, { status: 500 });
  }
}

// 4. حذف عنصر نهائياً وبشكل قطعي من قاعدة البيانات
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const target = searchParams.get('target');

    if (!id || !target) {
      return NextResponse.json({ error: "المعرف أو الهدف مفقود" }, { status: 400 });
    }

    if (target === 'scholarship') {
      await prisma.scholarship.delete({ where: { id } });
    } else if (target === 'code') {
      await prisma.structuralCode.delete({ where: { id } });
    } else if (target === 'training') {
      await prisma.trainingItem.delete({ where: { id } });
    } else {
      return NextResponse.json({ error: "الهدف المختار للحذف غير مدعوم" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "تم الحذف بنجاح" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ أثناء محاولة الحذف الفعلي" }, { status: 500 });
  }
}