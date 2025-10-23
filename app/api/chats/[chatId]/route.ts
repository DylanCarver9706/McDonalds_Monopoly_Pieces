import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkUserId = searchParams.get("clerk_user_id");

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Clerk user ID is required" },
        { status: 400 }
      );
    }

    const { chatId } = await params;

    // Get the current user's Supabase ID
    const { data: currentUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_user_id", clerkUserId)
      .single();

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the chat with user information
    const { data: chat, error: chatError } = await supabaseAdmin
      .from("chats")
      .select(
        `
        *,
        user1:users!chats_user1_id_fkey(id, username),
        user2:users!chats_user2_id_fkey(id, username)
      `
      )
      .eq("id", chatId)
      .single();

    if (chatError || !chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Check if the current user is part of this chat
    if (chat.user1_id !== currentUser.id && chat.user2_id !== currentUser.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get messages for this chat
    const { data: messages, error: messagesError } = await supabaseAdmin
      .from("messages")
      .select(
        `
        *,
        sender:users!messages_sender_id_fkey(id, username)
      `
      )
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      return NextResponse.json(
        { error: "Failed to load messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...chat,
      messages: messages || [],
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
