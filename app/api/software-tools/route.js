import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ذاكرة مؤقتة لضمان استمرارية العمل في حال عدم وجود قاعدة بيانات موصلة
let memoryTools: any[] = [];
let memoryRequests: any[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    if (type === "requests") {
      try {
        const requests = await (prisma as any).softwareToolRequest.findMany({
          orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ success: true, data: requests });
      } catch {
        return NextResponse.json({ success: true, data: memoryRequests });
      }
    }

    try {
      const tools = await (prisma as any).softwareTool.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, data: tools });
    } catch {
      return NextResponse.json({ success: true, data: memoryTools });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // التعامل مع طلبات الجمهور الخاصة
    if (body.action === "request_custom_tool") {
      const newRequest = {
        id: "req-" + Date.now(),
        name: body.name,
        email: body.email,
        phone: body.phone,
        details: body.details,
        createdAt: new Date().toISOString(),
      };
      try {
        const created = await (prisma as any).softwareToolRequest.create({ data: newRequest });
        return NextResponse.json({ success: true, data: created });
      } catch {
        memoryRequests.unshift(newRequest);
        return NextResponse.json({ success: true, data: newRequest });
      }
    }

    // التعامل مع إضافة أداة جديدة من الأدمن
    const newTool = {
      id: body.id || "tool-" + Date.now(),
      title: body.title,
      category: body.category,
      badge: body.badge,
      aiPlatform: body.aiPlatform,
      description: body.description,
      secretPrompt: body.secretPrompt || "",
      placeholders: body.placeholders || [],
      logic: body.logic || "",
      variables: body.variables || [],
      validation: body.validation || "",
      template: body.template || "",
      createdAt: new Date().toISOString(),
    };

    try {
      const created = await (prisma as any).softwareTool.create({ data: newTool });
      return NextResponse.json({ success: true, data: created });
    } catch {
      memoryTools.unshift(newTool);
      return NextResponse.json({ success: true, data: newTool });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    try {
      const updated = await (prisma as any).softwareTool.update({
        where: { id },
        data,
      });
      return NextResponse.json({ success: true, data: updated });
    } catch {
      const idx = memoryTools.findIndex((t) => t.id === id);
      if (idx !== -1) {
        memoryTools[idx] = { ...memoryTools[idx], ...data };
      }
      return NextResponse.json({ success: true, data: memoryTools[idx] });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  if (!id) {
    return NextResponse.json({ success: false, error: "المعرف ID مطلوب" }, { status: 400 });
  }

  try {
    if (type === "request") {
      try {
        await (prisma as any).softwareToolRequest.delete({ where: { id } });
      } catch {
        memoryRequests = memoryRequests.filter((r) => r.id !== id);
      }
      return NextResponse.json({ success: true });
    }

    try {
      await (prisma as any).softwareTool.delete({ where: { id } });
    } catch {
      memoryTools = memoryTools.filter((t) => t.id !== id);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}