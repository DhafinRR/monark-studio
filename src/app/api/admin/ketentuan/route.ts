import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/ketentuan
 * List all ketentuan with optional pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get("includeInactive") === "true";

    const ketentuan = await prisma.ketentuan.findMany({
      where: includeInactive ? {} : { is_active: true },
      orderBy: { order_number: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: ketentuan,
      count: ketentuan.length,
    });
  } catch (error) {
    console.error("Error fetching ketentuan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ketentuan" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/ketentuan
 * Create new ketentuan item
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_number, title, content, icon, is_active } = body;

    // Validation
    if (!order_number || !title || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if order_number already exists
    const existing = await prisma.ketentuan.findUnique({
      where: { order_number: parseInt(order_number) },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Order number already exists" },
        { status: 409 }
      );
    }

    const ketentuan = await prisma.ketentuan.create({
      data: {
        order_number: parseInt(order_number),
        title,
        content,
        icon: icon || null,
        is_active: is_active !== undefined ? is_active : true,
      },
    });

    return NextResponse.json({
      success: true,
      data: ketentuan,
      message: "Ketentuan created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating ketentuan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create ketentuan" },
      { status: 500 }
    );
  }
}
