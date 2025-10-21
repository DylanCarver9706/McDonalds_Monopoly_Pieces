import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pieceId } = await params;

    const { data: piece, error } = await supabaseAdmin
      .from("pieces")
      .select("*")
      .eq("id", pieceId)
      .single();

    if (error) {
      console.error("Error fetching piece:", error);
      return NextResponse.json({ error: "Piece not found" }, { status: 404 });
    }

    return NextResponse.json(piece);
  } catch (error) {
    console.error("Error in pieces/[id] GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
