import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب الطلبات" }, { status: 500 });
  }
}