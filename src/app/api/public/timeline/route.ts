import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/public/timeline
 * Get all active timeline steps for public display
 */
export async function GET(request: NextRequest) {
  try {
    const timeline = await prisma.orderTimeline.findMany({
      where: { is_active: true },
      orderBy: { step_number: "asc" },
      select: {
        id: true,
        step_number: true,
        title: true,
        description: true,
        duration: true,
        icon: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: timeline,
      count: timeline.length,
    });
  } catch (error) {
    console.error("Error fetching public timeline:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch timeline" },
      { status: 500 }
    );
  }
}
