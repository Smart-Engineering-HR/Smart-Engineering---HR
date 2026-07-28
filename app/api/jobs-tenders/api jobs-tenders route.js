import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // التأكد من صحة مسار ملف prisma لديك

// 🛑 إيقاف الكاش تماماً لضمان ظهور التحديثات فور نشر الأدمن لها
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 1️⃣ جلب كافة الوظائف والمناقصات للجمهور
export async function GET() {
  try {
    const items = await prisma.posting.findMany({
      orderBy: {
        createdAt: 'desc', // ترتيب العناصر من الأحدث إلى الأقدم
      },
    });

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs and tenders:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب البيانات من الخادم' },
      { status: 500 }
    );
  }
}

// 2️⃣ استقبال وظيفة أو مناقصة جديدة من لوحة تحكم الأدمن وحفظها
export async function POST(request) {
  try {
    const body = await request.json();

    // التحقق من الحقول الأساسية
    if (!body.title || !body.company || !body.itemType) {
      return NextResponse.json(
        { error: 'يرجى استكمال الحقول الأساسية: العنوان، الجهة، والنوع' },
        { status: 400 }
      );
    }

    // إضافة البيانات إلى جدول Posting في قاعدة البيانات
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