import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCachedData, setCachedData } from "@/lib/cache";

export async function GET() {
  try {
    // Check cache first
    const cachedBoards = getCachedData("boards");
    if (cachedBoards) {
      // console.log("Returning cached boards data");
      return NextResponse.json(cachedBoards);
    }

    // console.log("Fetching fresh boards data from database");
    const { data: boards, error } = await supabaseAdmin
      .from("boards")
      .select("*")
      .order("year", { ascending: false });

    if (error) {
      console.error("Error fetching boards:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Cache the data
    setCachedData("boards", boards || []);

    return NextResponse.json(boards || []);
  } catch (error) {
    console.error("Error in boards GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
