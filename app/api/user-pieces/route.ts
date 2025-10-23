import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET - Fetch user's pieces
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkUserId = searchParams.get("clerk_user_id");

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Clerk user ID required" },
        { status: 400 }
      );
    }

    // Get user's Supabase ID from metadata
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_user_id", clerkUserId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user pieces with related data
    const { data: userPieces, error: piecesError } = await supabaseAdmin
      .from("user_pieces")
      .select(
        `
        *,
        pieces!inner(name, section, color),
        boards!inner(name, year)
      `
      )
      .eq("user_id", userData.id);

    if (piecesError) {
      console.error("Error fetching user pieces:", piecesError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Transform the data for easier use
    const transformedPieces =
      userPieces?.map((piece: any) => ({
        user_id: piece.user_id,
        board_id: piece.board_id,
        piece_id: piece.piece_id,
        city_acquired: piece.city_acquired,
        state_acquired: piece.state_acquired,
        created_at: piece.created_at,
        piece_name: piece.pieces.name,
        board_year: piece.boards.year,
        section: piece.pieces.section,
        color: piece.pieces.color,
      })) || [];

    return NextResponse.json(transformedPieces);
  } catch (error) {
    console.error("Error in user-pieces GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new user piece
export async function POST(request: NextRequest) {
  try {
    const { clerk_user_id, board_id, piece_id, city_acquired, state_acquired } =
      await request.json();

    if (!clerk_user_id) {
      return NextResponse.json(
        { error: "Clerk user ID required" },
        { status: 400 }
      );
    }

    if (!board_id || !piece_id) {
      return NextResponse.json(
        { error: "Board ID and Piece ID are required" },
        { status: 400 }
      );
    }

    // Get user's Supabase ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_user_id", clerk_user_id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if piece already exists for this user
    const { data: existingPiece, error: checkError } = await supabaseAdmin
      .from("user_pieces")
      .select("user_id")
      .eq("user_id", userData.id)
      .eq("board_id", board_id)
      .eq("piece_id", piece_id)
      .single();

    if (existingPiece) {
      return NextResponse.json(
        { error: "You already have this piece" },
        { status: 400 }
      );
    }

    // Create new user piece
    const { data: newPiece, error: createError } = await supabaseAdmin
      .from("user_pieces")
      .insert({
        user_id: userData.id,
        board_id,
        piece_id,
        city_acquired: city_acquired || null,
        state_acquired: state_acquired || null,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating user piece:", createError);
      return NextResponse.json(
        { error: "Failed to create piece" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Piece added successfully",
      data: newPiece,
    });
  } catch (error) {
    console.error("Error in user-pieces POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update user piece
export async function PUT(request: NextRequest) {
  try {
    const { clerk_user_id, board_id, piece_id, city_acquired, state_acquired } =
      await request.json();

    if (!clerk_user_id) {
      return NextResponse.json(
        { error: "Clerk user ID required" },
        { status: 400 }
      );
    }

    if (!board_id || !piece_id) {
      return NextResponse.json(
        { error: "Board ID and Piece ID are required" },
        { status: 400 }
      );
    }

    // Get user's Supabase ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_user_id", clerk_user_id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user piece
    const { data: updatedPiece, error: updateError } = await supabaseAdmin
      .from("user_pieces")
      .update({
        city_acquired: city_acquired || null,
        state_acquired: state_acquired || null,
      })
      .eq("user_id", userData.id)
      .eq("board_id", board_id)
      .eq("piece_id", piece_id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating user piece:", updateError);
      return NextResponse.json(
        { error: "Failed to update piece" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Piece updated successfully",
      data: updatedPiece,
    });
  } catch (error) {
    console.error("Error in user-pieces PUT:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove user piece
export async function DELETE(request: NextRequest) {
  try {
    const { clerk_user_id, board_id, piece_id } = await request.json();

    if (!clerk_user_id) {
      return NextResponse.json(
        { error: "Clerk user ID required" },
        { status: 400 }
      );
    }

    if (!board_id || !piece_id) {
      return NextResponse.json(
        { error: "Board ID and Piece ID are required" },
        { status: 400 }
      );
    }

    // Get user's Supabase ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_user_id", clerk_user_id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete user piece
    const { error: deleteError } = await supabaseAdmin
      .from("user_pieces")
      .delete()
      .eq("user_id", userData.id)
      .eq("board_id", board_id)
      .eq("piece_id", piece_id);

    if (deleteError) {
      console.error("Error deleting user piece:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete piece" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Piece deleted successfully" });
  } catch (error) {
    console.error("Error in user-pieces DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
