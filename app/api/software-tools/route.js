import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

let memoryTools = [];
let memoryRequests = [];

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (body.action === "request_custom_tool") {
      const newRequest = {
        id: "req-" + Date.now(),
        name: body.name || "",
        email: body.email || "",
        phone: body.phone || "",
        details: body.details || "",
        createdAt: new Date().toISOString(),
      };
      try {
        if (prisma && prisma.softwareToolRequest) {
          const created = await prisma.softwareToolRequest.create({ data: newRequest });
          return NextResponse.json({ success: true, data: created });
        }
      } catch (dbErr) {
        console.error("DB Error:", dbErr);
      }
      memoryRequests.unshift(newRequest);
      return NextResponse.json({ success: true, data: newRequest });
    }

    const newTool = {
      id: body.id || "tool-" + Date.now(),
      title: body.title || "أداة جديدة",
      category: body.category || "prompt-engineering",
      badge: body.badge || "حصرية",
      aiPlatform: body.aiPlatform || "ChatGPT",
      description: body.description || "",
      secretPrompt: body.secretPrompt || "",
      placeholders: Array.isArray(body.placeholders) ? body.placeholders : [],
      logic: body.logic || "",
      variables: Array.isArray(body.variables) ? body.variables : [],
      validation: body.validation || "",
      template: body.template || "",
      createdAt: new Date().toISOString(),
    };

    try {
      if (prisma && prisma.softwareTool) {
        const created = await prisma.softwareTool.create({ data: newTool });
        return NextResponse.json({ success: true, data: created });
      }
    } catch (dbErr) {
      console.error("DB Error:", dbErr);
    }

    memoryTools.unshift(newTool);
    return NextResponse.json({ success: true, data: newTool });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "حدث خطأ غير متوقع" },
      { status: 200 } // إرجاع 200 لضمان قراءة الـ JSON بدون انهيار
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "requests") {
      try {
        if (prisma && prisma.softwareToolRequest) {
          const requests = await prisma.softwareToolRequest.findMany({ orderBy: { createdAt: "desc" } });
          return NextResponse.json({ success: true, data: requests });
        }
      } catch {}
      return NextResponse.json({ success: true, data: memoryRequests });
    }

    try {
      if (prisma && prisma.softwareTool) {
        const tools = await prisma.softwareTool.findMany({ orderBy: { createdAt: "desc" } });
        return NextResponse.json({ success: true, data: tools });
      }
    } catch {}
    return NextResponse.json({ success: true, data: memoryTools });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 200 });
  }
}