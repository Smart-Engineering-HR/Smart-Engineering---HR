import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
  const { token, password } = await req.json();

  // 1. البحث عن المستخدم الذي يملك هذا التوكن وبشرط ألا يكون التوكن منتهي الصلاحية
  const user = await prisma.user.findFirst({
    where: { 
      resetToken: token, 
      resetTokenExpiry: { gt: new Date() } 
    }
  });

  if (!user) return NextResponse.json({ error: 'التوكن غير صالح أو انتهت صلاحيته' }, { status: 400 });

  // 2. تشفير كلمة السر الجديدة
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. تحديث كلمة السر ومسح التوكن
  await prisma.user.update({
    where: { id: user.id },
    data: { 
      password: hashedPassword, 
      resetToken: null, 
      resetTokenExpiry: null 
    }
  });

  return NextResponse.json({ success: true });
}