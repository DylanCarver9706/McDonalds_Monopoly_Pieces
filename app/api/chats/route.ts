import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET - Get all chats for the current user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkUserId = searchParams.get("clerk_user_id");

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Clerk user ID is required" },
        { status: 400 }
      );
    }

    // Get the current user's Supabase ID
    const { data: currentUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_user_id", clerkUserId)
      .single();

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all chats for the current user with user info and last message
    const { data: chats, error: chatsError } = await supabaseAdmin
      .from("chats")
      .select(
        `
        *,
        user1:users!chats_user1_id_fkey(id, username),
        user2:users!chats_user2_id_fkey(id, username),
        messages!messages_chat_id_fkey(
          id,
          content,
          sender_id,
          created_at,
          sender:users!messages_sender_id_fkey(id, username)
        )
      `
      )
      .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
      .order("updated_at", { ascending: false });

    if (chatsError) {
      console.error("Error fetching chats:", chatsError);
      return NextResponse.json(
        { error: "Failed to load chats" },
        { status: 500 }
      );
    }

    // Transform the data to include last message and other user info
    const transformedChats =
      chats?.map((chat: any) => {
        // Get the last message
        const lastMessage =
          chat.messages && chat.messages.length > 0
            ? chat.messages.sort(
                (a: any, b: any) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )[0]
            : null;

        return {
          id: chat.id,
          user1_id: chat.user1_id,
          user2_id: chat.user2_id,
          created_at: chat.created_at,
          updated_at: chat.updated_at,
          user1: chat.user1,
          user2: chat.user2,
          last_message: lastMessage
            ? {
                id: lastMessage.id,
                content: lastMessage.content,
                sender_id: lastMessage.sender_id,
                created_at: lastMessage.created_at,
                sender: lastMessage.sender,
              }
            : null,
          unread_count: 0, // TODO: Implement unread count logic
        };
      }) || [];

    return NextResponse.json(transformedChats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or get existing chat
export async function POST(request: NextRequest) {
  try {
    const { clerk_user_id, target_user_id } = await request.json();

    if (!clerk_user_id) {
      return NextResponse.json(
        { error: "Clerk user ID is required" },
        { status: 400 }
      );
    }

    if (!target_user_id) {
      return NextResponse.json(
        { error: "Target user ID is required" },
        { status: 400 }
      );
    }

    // Get current user's Supabase ID
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_user_id", clerk_user_id)
      .single();

    if (userError || !currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if chat already exists
    const { data: existingChat, error: chatError } = await supabaseAdmin
      .from("chats")
      .select(
        `
        *,
        messages(
          id,
          content,
          sender_id,
          created_at,
          users!messages_sender_id_fkey(username)
        )
      `
      )
      .or(
        `and(user1_id.eq.${currentUser.id},user2_id.eq.${target_user_id}),and(user1_id.eq.${target_user_id},user2_id.eq.${currentUser.id})`
      )
      .single();

    if (existingChat) {
      // Transform messages for easier use
      const transformedMessages =
        existingChat.messages?.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender_id: msg.sender_id,
          created_at: msg.created_at,
          sender: {
            id: msg.sender_id,
            username: msg.users.username,
          },
        })) || [];

      return NextResponse.json({
        ...existingChat,
        messages: transformedMessages,
      });
    }

    // Create new chat
    const { data: newChat, error: createError } = await supabaseAdmin
      .from("chats")
      .insert({
        user1_id: currentUser.id,
        user2_id: target_user_id,
      })
      .select(
        `
        *,
        messages(
          id,
          content,
          sender_id,
          created_at,
          users!messages_sender_id_fkey(username)
        )
      `
      )
      .single();

    if (createError) {
      console.error("Error creating chat:", createError);
      return NextResponse.json(
        { error: "Failed to create chat" },
        { status: 500 }
      );
    }

    // Transform messages for easier use
    const transformedMessages =
      newChat.messages?.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        created_at: msg.created_at,
        sender: {
          id: msg.sender_id,
          username: msg.users.username,
        },
      })) || [];

    return NextResponse.json({
      ...newChat,
      messages: transformedMessages,
    });
  } catch (error) {
    console.error("Error in chats POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
