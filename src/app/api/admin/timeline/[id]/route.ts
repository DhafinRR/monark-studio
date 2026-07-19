import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/timeline/[id]
 * Get single timeline step by ID
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const timeline = await prisma.orderTimeline.findUnique({
      where: { id },
    });

    if (!timeline) {
      return NextResponse.json(
        { success: false, error: "Timeline step not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: timeline,
    });
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch timeline step" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/timeline/[id]
 * Update timeline step
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { step_number, title, description, duration, icon, is_active } = body;

    // Check if timeline exists
    const existing = await prisma.orderTimeline.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Timeline step not found" },
        { status: 404 }
      );
    }

    // If updating step_number, check for conflicts
    if (step_number && step_number !== existing.step_number) {
      const conflict = await prisma.orderTimeline.findUnique({
        where: { step_number: parseInt(step_number) },
      });

      if (conflict) {
        return NextResponse.json(
          { success: false, error: "Step number already exists" },
          { status: 409 }
        );
      }
    }

    const timeline = await prisma.orderTimeline.update({
      where: { id },
      data: {
        ...(step_number && { step_number: parseInt(step_number) }),
        ...(title && { title }),
        ...(description && { description }),
        ...(duration !== undefined && { duration }),
        ...(icon !== undefined && { icon }),
        ...(is_active !== undefined && { is_active }),
      },
    });

    return NextResponse.json({
      success: true,
      data: timeline,
      message: "Timeline step updated successfully",
    });
  } catch (error) {
    console.error("Error updating timeline:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update timeline step" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/timeline/[id]
 * Delete timeline step
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Check if timeline exists
    const existing = await prisma.orderTimeline.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Timeline step not found" },
        { status: 404 }
      );
    }

    await prisma.orderTimeline.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Timeline step deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting timeline:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete timeline step" },
      { status: 500 }
    );
  }
}
