import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/public/about
 * Get about content for public display
 */
export async function GET(request: NextRequest) {
  try {
    const about = await prisma.aboutContent.findUnique({
      where: { id: "default" },
      select: {
        title: true,
        subtitle: true,
        content: true,
        logo_url: true,
      },
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
    console.error("Error fetching public about:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch about content" },
      { status: 500 }
    );
  }
}
