import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyJwt(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // List ALL notes for the tenant (assignment requirement)
    const notes = await prisma.note.findMany({
      where: { tenantId: payload.tenantId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (err) {
    console.error("GET /notes error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyJwt(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const titleFromClient = typeof body.title === "string" ? body.title.trim() : "";

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Default title if client didn't provide one
    const title = titleFromClient || (content.length ? content.slice(0, 50) : "Untitled Note");

    // Check tenant exists & plan limit
    const tenant = await prisma.tenant.findUnique({ where: { id: payload.tenantId } });
    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

    const totalNotes = await prisma.note.count({ where: { tenantId: tenant.id } });

    // FREE plan limit = 3 notes (you can change to 3 if your assignment requires 3)
    if (tenant.plan === "FREE" && totalNotes >= 3) {
      return NextResponse.json(
        { error: "Free plan limit reached (3 notes max)" },
        { status: 403 }
      );
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        authorId: payload.userId,
        tenantId: payload.tenantId,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (err) {
    console.error("POST /notes error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
