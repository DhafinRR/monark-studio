import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/timeline
 * List all timeline steps with optional pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get("includeInactive") === "true";

    const timeline = await prisma.orderTimeline.findMany({
      where: includeInactive ? {} : { is_active: true },
      orderBy: { step_number: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: timeline,
      count: timeline.length,
    });
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch timeline" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/timeline
 * Create new timeline step
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { step_number, title, description, duration, icon, is_active } = body;

    // Validation
    if (!step_number || !title || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if step_number already exists
    const existing = await prisma.orderTimeline.findUnique({
      where: { step_number: parseInt(step_number) },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Step number already exists" },
        { status: 409 }
      );
    }

    const timeline = await prisma.orderTimeline.create({
      data: {
        step_number: parseInt(step_number),
        title,
        description,
        duration: duration || null,
        icon: icon || null,
        is_active: is_active !== undefined ? is_active : true,
      },
    });

    return NextResponse.json({
      success: true,
      data: timeline,
      message: "Timeline step created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating timeline:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create timeline step" },
      { status: 500 }
    );
  }
}
