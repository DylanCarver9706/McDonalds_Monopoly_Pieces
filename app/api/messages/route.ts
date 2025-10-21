import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

// POST - Send a message
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chat_id, content } = await request.json();

    if (!chat_id || !content) {
      return NextResponse.json(
        { error: "Chat ID and content are required" },
        { status: 400 }
      );
    }

    // Get current user's Supabase ID
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (userError || !currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify user is part of this chat
    const { data: chat, error: chatError } = await supabaseAdmin
      .from("chats")
      .select("id, user1_id, user2_id")
      .eq("id", chat_id)
      .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
      .single();

    if (chatError || !chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Create message
    const { data: newMessage, error: messageError } = await supabaseAdmin
      .from("messages")
      .insert({
        chat_id,
        sender_id: currentUser.id,
        content: content.trim(),
      })
      .select(
        `
        id,
        content,
        sender_id,
        created_at,
        users!messages_sender_id_fkey(username)
      `
      )
      .single();

    if (messageError) {
      console.error("Error creating message:", messageError);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    // Transform message for easier use
    const transformedMessage = {
      id: newMessage.id,
      content: newMessage.content,
      sender_id: newMessage.sender_id,
      created_at: newMessage.created_at,
      sender: {
        id: newMessage.sender_id,
        username: newMessage.users.username,
      },
    };

    return NextResponse.json(transformedMessage);
  } catch (error) {
    console.error("Error in messages POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
