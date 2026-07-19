import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/about
 * Get about content (singleton - only one record)
 */
export async function GET(request: NextRequest) {
  try {
    const about = await prisma.aboutContent.findUnique({
      where: { id: "default" },
    });

    if (!about) {
      return NextResponse.json(
        { success: false, error: "About content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Error fetching about:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch about content" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/about
 * Update about content (singleton - always updates id="default")
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, content, logo_url } = body;

    // Validation - at least one field should be provided
    if (!title && !subtitle && !content && logo_url === undefined) {
      return NextResponse.json(
        { success: false, error: "No fields provided to update" },
        { status: 400 }
      );
    }

    const about = await prisma.aboutContent.update({
      where: { id: "default" },
      data: {
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(content && { content }),
        ...(logo_url !== undefined && { logo_url }),
      },
    });

    return NextResponse.json({
      success: true,
      data: about,
      message: "About content updated successfully",
    });
  } catch (error) {
    console.error("Error updating about:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update about content" },
      { status: 500 }
    );
  }
}
