import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCachedData, setCachedData } from "@/lib/cache";

export async function GET() {
  try {
    // Check cache first
    const cachedPieces = getCachedData("pieces");
    if (cachedPieces) {
      // console.log("Returning cached pieces data");
      return NextResponse.json(cachedPieces);
    }

    // console.log("Fetching fresh pieces data from database");
    const { data: pieces, error } = await supabaseAdmin
      .from("pieces")
      .select("*")
      .order("section");

    if (error) {
      console.error("Error fetching pieces:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Cache the data
    setCachedData("pieces", pieces || []);

    return NextResponse.json(pieces || []);
  } catch (error) {
    console.error("Error in pieces GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
