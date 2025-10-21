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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useState, useEffect } from "react";
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
  user1: User;
  user2: User;
  last_message?: Message;
}

export default function ChatsPage() {
  const { user } = useUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/chats");

      if (!response.ok) {
        throw new Error("Failed to load chats");
      }

      const chatsData = await response.json();
      setChats(chatsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getOtherUser = (chat: Chat) => {
    if (!user) return null;
    const currentUserId = user.unsafeMetadata?.supabase_user_id;
    return chat.user1_id === currentUserId ? chat.user2 : chat.user1;
  };

  const formatLastMessage = (message: Message) => {
    const maxLength = 50;
    if (message.content.length > maxLength) {
      return message.content.substring(0, maxLength) + "...";
    }
    return message.content;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          My Chats
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {chats.length} conversation{chats.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Chats List */}
      {chats.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
          }}
        >
          <ChatIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No conversations yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start chatting with other players to trade pieces!
          </Typography>
          <Button
            variant="contained"
            component={Link}
            href="/pieces-search"
            startIcon={<ChatIcon />}
          >
            Find Players
          </Button>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {chats.map((chat, index) => {
            const otherUser = getOtherUser(chat);
            return (
              <ListItem
                key={chat.id}
                sx={{
                  p: 0,
                  mb: 1,
                }}
              >
                <Card
                  sx={{
                    width: "100%",
                    p: 2,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <Link
                    href={`/chat/${chat.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {otherUser?.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {otherUser?.username}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ flexShrink: 0, ml: 1 }}
                          >
                            {formatDate(
                              chat.last_message?.created_at || chat.created_at
                            )}
                          </Typography>
                        </Box>
                        {chat.last_message ? (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatLastMessage(chat.last_message)}
                          </Typography>
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontStyle="italic"
                          >
                            No messages yet
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Link>
                </Card>
              </ListItem>
            );
          })}
        </List>
      )}
    </Container>
  );
}
