import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";

export async function POST(req: NextRequest, context: { params: { slug: string } }) {
  try {
    const { slug } = context.params;

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyJwt(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

    if (tenant.plan === "PRO") return NextResponse.json({ message: "Already on Pro plan" });

    const updated = await prisma.tenant.update({
      where: { slug },
      data: { plan: "PRO" },
    });

    return NextResponse.json({ message: `Tenant ${slug} upgraded to PRO`, tenant: updated });
  } catch (err) {
    console.error("Upgrade error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
