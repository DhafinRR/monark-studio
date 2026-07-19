import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/public/ketentuan
 * Get all active ketentuan for public display
 */
export async function GET(request: NextRequest) {
  try {
    const ketentuan = await prisma.ketentuan.findMany({
      where: { is_active: true },
      orderBy: { order_number: "asc" },
      select: {
        id: true,
        order_number: true,
        title: true,
        content: true,
        icon: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: ketentuan,
      count: ketentuan.length,
    });
  } catch (error) {
    console.error("Error fetching public ketentuan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ketentuan" },
      { status: 500 }
    );
  }
}
