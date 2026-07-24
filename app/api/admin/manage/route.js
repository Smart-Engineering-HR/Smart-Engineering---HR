import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req) {
    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: "بيانات المعرف أو الحالة مفقودة" }, { status: 400 });
        }

        const updatedAd = await prisma.advertisement.update({
            where: { id: parseInt(id) },
            data: { status: status }
        });

        return NextResponse.json({ success: true, updatedAd }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "فشل التحديث: " + error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "المعرف مفقود" }, { status: 400 });
        }

        await prisma.advertisement.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true, message: "تم الحذف بنجاح" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "فشل الحذف: " + error.message }, { status: 500 });
    }
}