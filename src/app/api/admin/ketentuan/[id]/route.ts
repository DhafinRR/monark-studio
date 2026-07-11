import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/ketentuan/[id]
 * Get single ketentuan by ID
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const ketentuan = await prisma.ketentuan.findUnique({
      where: { id },
    });

    if (!ketentuan) {
      return NextResponse.json(
        { success: false, error: "Ketentuan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ketentuan,
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
 * PATCH /api/admin/ketentuan/[id]
 * Update ketentuan item
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { order_number, title, content, icon, is_active } = body;

    // Check if ketentuan exists
    const existing = await prisma.ketentuan.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Ketentuan not found" },
        { status: 404 }
      );
    }

    // If updating order_number, check for conflicts
    if (order_number && order_number !== existing.order_number) {
      const conflict = await prisma.ketentuan.findUnique({
        where: { order_number: parseInt(order_number) },
      });

      if (conflict) {
        return NextResponse.json(
          { success: false, error: "Order number already exists" },
          { status: 409 }
        );
      }
    }

    const ketentuan = await prisma.ketentuan.update({
      where: { id },
      data: {
        ...(order_number && { order_number: parseInt(order_number) }),
        ...(title && { title }),
        ...(content && { content }),
        ...(icon !== undefined && { icon }),
        ...(is_active !== undefined && { is_active }),
      },
    });

    return NextResponse.json({
      success: true,
      data: ketentuan,
      message: "Ketentuan updated successfully",
    });
  } catch (error) {
    console.error("Error updating ketentuan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update ketentuan" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/ketentuan/[id]
 * Delete ketentuan item
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Check if ketentuan exists
    const existing = await prisma.ketentuan.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Ketentuan not found" },
        { status: 404 }
      );
    }

    await prisma.ketentuan.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Ketentuan deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ketentuan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete ketentuan" },
      { status: 500 }
    );
  }
}
