import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyJwt(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note || note.tenantId !== payload.tenantId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyJwt(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { title, content } = await req.json();

  const note = await prisma.note.findUnique({ where: { id } });
  if (!note || note.tenantId !== payload.tenantId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.note.update({
    where: { id },
    data: { title, content },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyJwt(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const note = await prisma.note.findUnique({ where: { id } });
  if (!note || note.tenantId !== payload.tenantId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.note.delete({ where: { id } });

  return NextResponse.json({ success: true });
}