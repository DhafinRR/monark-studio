import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/quote
 * Get about quote (singleton - only one record)
 */
export async function GET(request: NextRequest) {
  try {
    const quote = await prisma.aboutQuote.findUnique({
      where: { id: "default" },
    });

    if (!quote) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch quote" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/quote
 * Update about quote (singleton - always updates id="default")
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, author, position } = body;

    // Validation - at least one field should be provided
    if (!text && author === undefined && position === undefined) {
      return NextResponse.json(
        { success: false, error: "No fields provided to update" },
        { status: 400 }
      );
    }

    const quote = await prisma.aboutQuote.update({
      where: { id: "default" },
      data: {
        ...(text && { text }),
        ...(author !== undefined && { author }),
        ...(position !== undefined && { position }),
      },
    });

    return NextResponse.json({
      success: true,
      data: quote,
      message: "Quote updated successfully",
    });
  } catch (error) {
    console.error("Error updating quote:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update quote" },
      { status: 500 }
    );
  }
}
