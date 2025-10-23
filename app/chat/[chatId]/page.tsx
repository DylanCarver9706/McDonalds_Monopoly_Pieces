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
import { useState, useEffect, useRef } from "react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatId) {
      loadChat();
    }
  }, [chatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/chats/${chatId}?clerk_user_id=${user.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to load chat");
      }

      const chatData = await response.json();
      setChat(chatData);
      setMessages(chatData.messages || []);
      // Scroll to bottom after loading chat
      setTimeout(scrollToBottom, 200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chat || sending || !user) return;

    try {
      setSending(true);
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_user_id: user.id,
          chat_id: chat.id,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        const messageData = await response.json();
        setMessages((prev) => [...prev, messageData]);
        setNewMessage("");
        // Scroll to bottom after sending message
        setTimeout(scrollToBottom, 100);
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
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "33vh",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress
            size={80}
            thickness={4}
            sx={{
              color: "#d82f28",
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "#1e293b",
              fontWeight: "bold",
            }}
          >
            Loading chat...
          </Typography>
        </Box>
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
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #d82f28 0%, #b8070d 100%)",
          color: "white",
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.2)" }}>
              {otherUser?.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{ fontWeight: "bold" }}
              >
                Chat with {otherUser?.username}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Started {new Date(chat.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="sm" sx={{ py: 4 }}>
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
              <PersonIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
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
                // Hide scrollbar
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                // Firefox
                scrollbarWidth: "none",
                // IE and Edge
                msOverflowStyle: "none",
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
                        backgroundColor: isCurrentUser ? "#d82f28" : "grey.300",
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
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                sx={{
                  minWidth: "auto",
                  px: 2,
                  backgroundColor: "#d82f28",
                  "&:hover": {
                    backgroundColor: "#b8070d",
                  },
                }}
              >
                {sending ? (
                  <CircularProgress size={20} sx={{ color: "#b8070d" }} />
                ) : (
                  <SendIcon sx={{ color: "white" }} />
                )}
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
