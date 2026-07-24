import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. جلب البيانات (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // جلب عنصر معين بالـ ID
    if (id) {
      const item = await prisma.academyItem.findUnique({ where: { id } });
      if (!item) return NextResponse.json({ error: "العنصر غير موجود" }, { status: 404 });
      return NextResponse.json(item, { status: 200 });
    }

    // جلب كافة العناصر مرتبة من الأحدث للأقدم
    const items = await prisma.academyItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Academy GET Error:", error);
    return NextResponse.json({ error: "فشل الخادم في جلب البيانات" }, { status: 500 });
  }
}

// 2. إضافة عنصر جديد (POST)
export async function POST(req) {
  try {
    const data = await req.json();
    const { category, title, subCategory, details } = data;

    if (!title || !category) {
      return NextResponse.json({ error: "العنوان والتصنيف مطلوبان" }, { status: 400 });
    }

    const newItem = await prisma.academyItem.create({
      data: {
        category,
        title,
        subCategory: subCategory || null,
        details: details || {} // تخزين البيانات التفصيلية كـ JSON
      }
    });

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error) {
    console.error("Academy POST Error:", error);
    return NextResponse.json({ error: "فشل في إضافة العنصر للأكاديمية" }, { status: 500 });
  }
}

// 3. تعديل عنصر (PUT)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, category, title, subCategory, details } = body;

    if (!id) return NextResponse.json({ error: "معرف العنصر مطلوب للتعديل" }, { status: 400 });

    const updatedItem = await prisma.academyItem.update({
      where: { id },
      data: { category, title, subCategory, details }
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Academy PUT Error:", error);
    return NextResponse.json({ error: "فشل في حفظ التعديلات" }, { status: 500 });
  }
}

// 4. حذف عنصر (DELETE)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "المعرف الفريد مطلوب للحذف" }, { status: 400 });

    await prisma.academyItem.delete({ where: { id } });
    return NextResponse.json({ message: "تم حذف العنصر بنجاح" }, { status: 200 });
  } catch (error) {
    console.error("Academy DELETE Error:", error);
    return NextResponse.json({ error: "فشل في حذف العنصر من السجلات" }, { status: 500 });
  }
}