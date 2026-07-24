import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- 1. دالة التعديل (PUT) ---
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "المعرف مفقود" }, { status: 400 });
    }

    // جلب البيانات الحالية للإعلان قبل التحديث لمنع ضياع أي حقول أساسية
    const currentAd = await prisma.advertisement.findUnique({
      where: { id: String(id) }
    });

    if (!currentAd) {
      return NextResponse.json({ success: false, error: "الإعلان غير موجود بالتظام" }, { status: 404 });
    }

    // استخراج البيانات القادمة من الواجهة
    const title = body.title || currentAd.title;
    const category = body.category || currentAd.category;
    const location = body.location || currentAd.location;
    const status = body.status || currentAd.status;

    // توجيه ذكي للمسميات لضمان مطابقة الـ Schema (عدم فقدان البيانات)
    const company = body.company || body.companyName || currentAd.company;
    const type = body.type || body.advertiseType || currentAd.type;
    const description = body.description || body.moreInfo || currentAd.description;

    // تجميع حقول الاتصال المرنة لضمان عدم ضياعها إذا لم تكن موجودة كأعمدة مستقلة
    let contact = body.contact;
    if (!contact && (body.phone || body.email || body.contactPerson)) {
      contact = `المسؤول: ${body.contactPerson || '-'} | هاتف: ${body.phone || '-'} | إيميل: ${body.email || '-'} | موقع: ${body.website || '-'}`;
    }
    contact = contact || currentAd.contact;

    // معالجة التاريخ بدقة لتجنب أخطاء صيغ التاريخ
    const expiryDate = body.deadline ? new Date(body.deadline).toISOString() : currentAd.expiryDate;

    // تنفيذ التحديث الفعلي الحافظ للبيانات
    const updatedAd = await prisma.advertisement.update({
      where: { 
        id: String(id) // تم الإصلاح قطعا إلى String
      },
      data: {
        title,
        company,
        type,
        category,
        location,
        description,
        contact,
        expiryDate,
        status
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "تم تحديث البيانات بنجاح وبأمان كامل",
      data: updatedAd 
    }, { status: 200 });

  } catch (error) {
    console.error("خطأ التحديث (PUT):", error);
    return NextResponse.json(
      { success: false, error: "فشل تحديث البيانات في النظام", details: error.message }, 
      { status: 500 }
    );
  }
}

// --- 2. دالة الحذف (DELETE) ---
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: "المعرف مطلوب للحذف" }, { status: 400 });
    }

    await prisma.advertisement.delete({
      where: { 
        id: String(id) // تم الإصلاح قطعا إلى String
      },
    });

    return NextResponse.json({ success: true, message: "تم الحذف النهائي بنجاح من قاعدة البيانات" }, { status: 200 });
  } catch (error) {
    console.error("خطأ الحذف (DELETE):", error);
    return NextResponse.json(
      { success: false, error: "فشل في تنفيذ عملية الحذف", details: error.message }, 
      { status: 500 }
    );
  }
}

// --- 3. دالة جلب إعلان واحد (GET) ---
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "المعرف مطلوب لجلب البيانات" }, { status: 400 });
    }

    const ad = await prisma.advertisement.findUnique({
      where: { 
        id: String(id) // تم الإصلاح قطعا إلى String
      }
    });

    if (!ad) {
      return NextResponse.json({ error: "الإعلان المطلوب غير موجود" }, { status: 404 });
    }

    return NextResponse.json(ad, { status: 200 });
  } catch (error) {
    console.error("خطأ جلب العنصر المحدد (GET):", error);
    return NextResponse.json({ error: "فشل في جلب تفاصيل الإعلان", details: error.message }, { status: 500 });
  }
}