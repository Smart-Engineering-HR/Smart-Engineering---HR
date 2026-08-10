import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password-here'
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
      const posting = await prisma.advertisement.findUnique({ where: { id: id } });
      if (!posting) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
      
      let parsedInfo = {};
      try { parsedInfo = typeof posting.moreInfo === 'string' ? JSON.parse(posting.moreInfo) : (posting.moreInfo || {}); } catch (e) {}
      return NextResponse.json({ ...posting, ...parsedInfo });
    }

    let filterConditions = {};
    if (isPublicQuery === 'true') {
      filterConditions = { status: 'APPROVED' };
    }

    const postings = await prisma.advertisement.findMany({
      where: filterConditions,
      orderBy: { createdAt: 'desc' }
    });

    // تحويل عناصر Prisma إلى كائنات نصوص صافية وتجميع البيانات الملحقة (moreInfo)
    const formattedPostings = postings.map(item => {
      const rawItem = JSON.parse(JSON.stringify(item));
      let parsedInfo = {};
      try {
        if (rawItem.moreInfo) {
          parsedInfo = typeof rawItem.moreInfo === 'string' ? JSON.parse(rawItem.moreInfo) : rawItem.moreInfo;
        }
      } catch (e) {
        parsedInfo = {};
      }

      return {
        ...rawItem,
        ...parsedInfo,
        id: rawItem.id,
        advertiseType: rawItem.advertiseType || parsedInfo.category || parsedInfo.advertiseType,
        companyName: rawItem.companyName || parsedInfo.title || parsedInfo.name || "منصة الهندسة الذكية"
      };
    });

    return NextResponse.json(formattedPostings, { status: 200 });
  } catch (error) {
    console.error("Error in GET API:", error);
    return NextResponse.json({ error: "فشل جلب البيانات من القاعدة" }, { status: 500 });
  }
}

// 2. إضافة منشور جديد أو طلب تقديم (POST)
export async function POST(req) {
  try {
    const body = await req.json();
    
    const { companyName, contactPerson, phone, email, website, advertiseType, category, address, status, ...extraData } = body;

    const finalCategory = advertiseType || category || "GENERAL";
    const dataToSave = {
      companyName: companyName || body.title || body.name || "منصة الهندسة الذكية",
      contactPerson: contactPerson || body.trainer || body.provider || body.fullNameAr || "الإدارة",
      phone: phone || body.phone || "000000000",
      email: email || body.email || gmailAdminEmail,
      website: website || body.linkDirect || "",
      advertiseType: finalCategory,
      address: address || body.country || "Global",
      moreInfo: JSON.stringify({ ...extraData, category: finalCategory, advertiseType: finalCategory }),
      status: status || "APPROVED"
    };

    const newPosting = await prisma.advertisement.create({ data: dataToSave });

    // إرسال إشعار بريدي
    const mailOptions = {
      from: `"منصة الهندسة الذكية 🚀" <${gmailAdminEmail}>`,
      to: [gmailAdminEmail, ...externalAdminEmails].join(','),
      subject: `تحديث/إعلان جديد: ${dataToSave.advertiseType} - ${dataToSave.companyName}`,
      html: `<div dir="rtl">
        <h3>تم تسجيل منشور جديد في قاعدة البيانات</h3>
        <p><strong>النوع:</strong> ${dataToSave.advertiseType}</p>
        <p><strong>العنوان/الجهة:</strong> ${dataToSave.companyName}</p>
      </div>`
    };

    try { await transporter.sendMail(mailOptions); } catch (e) { console.error("Email warning:", e); }

    let parsedMore = {};
    try { parsedMore = JSON.parse(newPosting.moreInfo); } catch(e){}

    return NextResponse.json({ ...newPosting, ...parsedMore }, { status: 201 });
  } catch (error) {
    console.error("خطأ أثناء الحفظ:", error);
    return NextResponse.json({ error: "فشل الحفظ في قاعدة البيانات" }, { status: 500 });
  }
}

// 3. تحديث منشور حالي (PUT)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, status, companyName, contactPerson, phone, email, website, advertiseType, category, address, ...extraData } = body;
    
    if (!id) return NextResponse.json({ error: "المعرف مطلوب للتعديل" }, { status: 400 });

    const finalCategory = advertiseType || category;
    const updateData = {
      companyName: companyName || body.title || body.name,
      contactPerson: contactPerson || body.trainer || body.provider,
      phone,
      email,
      website,
      advertiseType: finalCategory,
      address: address || body.country,
      status: status || "APPROVED",
      moreInfo: JSON.stringify({ ...extraData, category: finalCategory, advertiseType: finalCategory })
    };

    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updated = await prisma.advertisement.update({
      where: { id: id },
      data: updateData
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error in PUT API:", error);
    return NextResponse.json({ error: "فشل التعديل في قاعدة البيانات" }, { status: 500 });
  }
}

// 4. حذف منشور (DELETE)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "المعرف مطلوب للحذف" }, { status: 400 });

    await prisma.advertisement.delete({ where: { id: id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE API:", error);
    return NextResponse.json({ error: "فشل الحذف من القاعدة" }, { status: 500 });
  }
}