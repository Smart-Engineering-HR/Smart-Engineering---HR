import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({ where: { email } });

    // المقارنة المباشرة (لأن كلمة المرور في قاعدة البيانات ليست مشفرة حالياً)
    if (user && password === user.password) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 });
  }
}