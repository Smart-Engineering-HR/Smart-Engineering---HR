import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 🛑 منع التخزين المؤقت (Caching) نهائياً لضمان ظهور التحديثات والحذف فوراً
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 1️⃣ جلب كافة الوظائف والمناقصات المباشرة من قاعدة البيانات
export async function GET() {
  try {
    const items = await prisma.posting.findMany({
      orderBy: {
        createdAt: 'desc', // ترتيب من الأحدث للأقدم
      },
    });

    return NextResponse.json(items, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching jobs and tenders:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب البيانات من الخادم' },
      { status: 500 }
    );
  }
}

// 2️⃣ إضافة وظيفة أو مناقصة جديدة (من لوحة الأدمن)
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title || !body.company || !body.itemType) {
      return NextResponse.json(
        { error: 'يرجى استكمال الحقول الأساسية: العنوان، الجهة، والنوع' },
        { status: 400 }
      );
    }

    const newItem = await prisma.posting.create({
      data: {
        itemType: body.itemType, // "job" أو "tender"
        title: body.title,
        company: body.company,
        category: body.category || 'عام',
        type: body.type || 'دوام كامل',
        location: body.location || '',
        publishDate: body.publishDate || new Date().toISOString().split('T')[0],
        endDate: body.endDate || '',
        duties: body.duties || '',
        qualifications: body.qualifications || '',
        tenderNumber: body.tenderNumber || '',
        projectName: body.projectName || '',
        applyMethod: body.applyMethod || '',
        applyEmail: body.applyEmail || '',
        applyUrl: body.applyUrl || '',
        documentsLink: body.documentsLink || '',
        notes: body.notes || '',
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating new item:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حفظ البيانات في قاعدة البيانات' },
      { status: 500 }
    );
  }
}

// 3️⃣ تعديل وظيفة أو مناقصة حالية (من لوحة الأدمن)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'معرّف العنصر (id) مطلوب للتعديل' }, { status: 400 });
    }

    const updatedItem = await prisma.posting.update({
      where: { id: String(id) },
      data: updateData,
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تعديل البيانات' },
      { status: 500 }
    );
  }
}

// 4️⃣ حذف وظيفة أو مناقصة (من لوحة الأدمن)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch (e) {
        // تجاهل تحليل الجسم إذا كان خالياً
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'معرّف العنصر (id) مطلوب للحذف' }, { status: 400 });
    }

    await prisma.posting.delete({
      where: { id: String(id) },
    });

    return NextResponse.json({ message: 'تم الحذف بنجاح من قاعدة البيانات' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء الحذف من قاعدة البيانات' },
      { status: 500 }
    );
  }
}