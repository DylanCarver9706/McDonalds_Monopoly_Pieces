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
  const { user, isLoaded } = useUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      loadChats();
    } else if (isLoaded && !user) {
      setError("Please sign in to view your chats");
    }
  }, [isLoaded, user]);

  const loadChats = async () => {
    if (!user) return;

    try {
      setLoadingChats(true);
      setError(null);
      const response = await fetch(`/api/chats?clerk_user_id=${user.id}`);

      if (!response.ok) {
        throw new Error("Failed to load chats");
      }

      const chatsData = await response.json();
      setChats(chatsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingChats(false);
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

  if (loadingChats) {
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
            Loading your chats...
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

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #d82f28 0%, #b8070d 100%)",
          color: "white",
          py: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h1"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            My Chats
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ mb: 4, opacity: 0.9 }}
          >
            Connect with the community to trade pieces!
          </Typography>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Chats List */}
        {chats.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              border: "2px solid #000",
              borderRadius: 2,
              p: 2,
              backgroundColor: "#f8f9fa",
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
              sx={{
                backgroundColor: "#d82f28",
                color: "white",
                "&:hover": {
                  backgroundColor: "#b8070d",
                },
              }}
            >
              Find Players
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              border: "2px solid #000",
              borderRadius: 2,
              p: 2,
              backgroundColor: "#f8f9fa",
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              sx={{ color: "#1e293b", mb: 2 }}
            >
              Your Conversations
            </Typography>
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
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar sx={{ bgcolor: "#d82f28" }}>
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
                                  chat.last_message?.created_at ||
                                    chat.created_at
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
          </Box>
        )}
      </Container>
    </Box>
  );
}
