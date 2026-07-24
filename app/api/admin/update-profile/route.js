import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    
    // 1. تحديد بيانات التحديث (تحديث كلمة السر فقط إذا تم إدخالها)
    const updateData = {};
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    // 2. تحديث المستخدم (نستخدم ID الخاص بك كأدمن)
    // ملاحظة: تأكد من تمرير ID الأدمن الخاص بك بدلاً من 'ADMIN_ID'
    await prisma.user.update({
      where: { id: 'ADMIN_ID' }, 
      data: updateData
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 });
  }
}