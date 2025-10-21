import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pieceId } = await params;

    // Get all users who have this piece
    const { data: userPieces, error } = await supabaseAdmin
      .from("user_pieces")
      .select(
        `
        *,
        users!inner(username),
        boards!inner(name)
      `
      )
      .eq("piece_id", pieceId);

    if (error) {
      console.error("Error fetching piece users:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Transform the data for easier use
    const transformedUserPieces =
      userPieces?.map((userPiece: any) => ({
        user_id: userPiece.user_id,
        board_id: userPiece.board_id,
        piece_id: userPiece.piece_id,
        city_acquired: userPiece.city_acquired,
        state_acquired: userPiece.state_acquired,
        created_at: userPiece.created_at,
        user: {
          id: userPiece.user_id,
          username: userPiece.users.username,
        },
        board_name: userPiece.boards.name,
      })) || [];

    return NextResponse.json(transformedUserPieces);
  } catch (error) {
    console.error("Error in pieces/[id]/users GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
