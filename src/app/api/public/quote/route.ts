import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/public/quote
 * Get about quote for public display
 */
export async function GET(request: NextRequest) {
  try {
    const quote = await prisma.aboutQuote.findUnique({
      where: { id: "default" },
      select: {
        text: true,
        author: true,
        position: true,
      },
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
    console.error("Error fetching public quote:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch quote" },
      { status: 500 }
    );
  }
}
