"use client";

import {
  Container,
  Typography,
  Box,
  Card,
  Stack,
  CircularProgress,
  Alert,
  Avatar,
  Button,
  TextField,
  Divider,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface User {
  id: string;
  username: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender: User;
}

interface Chat {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  messages: Message[];
  user1: User;
  user2: User;
}

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const { user } = useUser();

  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (chatId) {
      loadChat();
    }
  }, [chatId]);

  const loadChat = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/chats/${chatId}`);

      if (!response.ok) {
        throw new Error("Failed to load chat");
      }

      const chatData = await response.json();
      setChat(chatData);
      setMessages(chatData.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chat || sending) return;

    try {
      setSending(true);
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chat.id,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        const messageData = await response.json();
        setMessages((prev) => [...prev, messageData]);
        setNewMessage("");
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = () => {
    if (!chat || !user) return null;
    const currentUserId = user.unsafeMetadata?.supabase_user_id;
    return chat.user1_id === currentUserId ? chat.user2 : chat.user1;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!chat) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Chat not found</Alert>
      </Container>
    );
  }

  const otherUser = getOtherUser();

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {otherUser?.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
              Chat with {otherUser?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Started {new Date(chat.created_at).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Messages */}
      <Card sx={{ height: "60vh", display: "flex", flexDirection: "column" }}>
        {messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              p: 4,
            }}
          >
            <PersonIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No messages yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start the conversation!
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {messages.map((message) => {
              const isCurrentUser =
                user?.unsafeMetadata?.supabase_user_id === message.sender_id;

              return (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: isCurrentUser
                        ? "primary.main"
                        : "grey.300",
                      color: isCurrentUser ? "white" : "text.primary",
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {message.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        opacity: 0.7,
                        fontSize: "0.7rem",
                      }}
                    >
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Message Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              size="small"
              disabled={sending}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              sx={{ minWidth: "auto", px: 2 }}
            >
              {sending ? <CircularProgress size={20} /> : <SendIcon />}
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}
