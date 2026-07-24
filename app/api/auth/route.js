import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'smartengineering.hr.global@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password-here'
  }
});

const adminEmails = [
  'Smart.Engineering.Global@proton.me',
  'smart.engineering.global@tuta.io',
  'smartengineering.hr.global@gmail.com'
];

// 1. جلب كافة الحسابات للوحة التحكم (GET)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. معالجة إنشاء حساب جديد من الجمهور (POST)
export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, password, role } = body;

    // فحص ما إذا كان الإيميل مسجلاً مسبقاً
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "هذا البريد الإلكتروني مسجل لدينا بالفعل!" }, { status: 400 });
    }

    // حفظ المستخدم في قاعدة البيانات
    const newUser = await prisma.user.create({
      data: { fullName, email, password, role }
    });

    // إرسال إشعار فوري للإدارة بالايميلات
    const mailOptions = {
      from: '"بوابة Smart Engineering" <smartengineering.hr.global@gmail.com>',
      to: adminEmails.join(','),
      subject: `👤 عضو جديد مسجل في المنصة: ${fullName}`,
      html: `
        <div dir="rtl" style="font-family: sans-serif; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
          <h2 style="color: #f59e0b;">تنبيه: انضمام عضو جديد للمنصة الذكية</h2>
          <p><strong>الاسم الكامل:</strong> ${fullName}</p>
          <p><strong>البريد الإلكتروني:</strong> ${email}</p>
          <p><strong>نوع الحساب:</strong> ${role === 'seeker' ? 'باحث عن عمل / مهندس' : 'شركة / مقاول / مورد'}</p>
          <p style="color: #64748b; font-size: 12px;">يمكنك التحكم في هذا الحساب وحظره أو حذفه في أي وقت من لوحة التحكم العليا.</p>
        </div>
      `
    };
    
    try { await transporter.sendMail(mailOptions); } catch (e) { console.error("Mail error:", e); }

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. تعديل حالة الحساب (حظر / إلغاء حظر) (PUT)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, isBanned } = body;
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { isBanned }
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 4. حذف حساب نهائياً من الكنترول (DELETE)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await prisma.user.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}