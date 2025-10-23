"use client";

import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Button,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface Piece {
  id: string;
  name: string;
  section: string;
  color: string;
}

interface User {
  id: string;
  username: string;
}

interface UserPiece {
  user_id: string;
  board_id: string;
  piece_id: string;
  city_acquired: string;
  state_acquired: string;
  created_at: string;
  user: User;
  board_name: string;
}

export default function PiecePage() {
  const params = useParams();
  const router = useRouter();
  const pieceId = params.id as string;
  const { user } = useUser();

  const [piece, setPiece] = useState<Piece | null>(null);
  const [userPieces, setUserPieces] = useState<UserPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (pieceId && !hasLoaded) {
      loadPieceData();
    }
  }, [pieceId, hasLoaded]);

  // Reset when pieceId changes
  useEffect(() => {
    setHasLoaded(false);
    setPiece(null);
    setUserPieces([]);
    setError(null);
  }, [pieceId]);

  // Note: Real-time updates removed for simplicity
  // Messages will be fetched when chat is opened

  const loadPieceData = async () => {
    if (hasLoaded) return; // Prevent duplicate requests

    try {
      setLoading(true);
      setHasLoaded(true);

      const [pieceRes, usersRes] = await Promise.all([
        fetch(`/api/pieces/${pieceId}`),
        fetch(`/api/pieces/${pieceId}/users`),
      ]);

      if (!pieceRes.ok || !usersRes.ok) {
        throw new Error("Failed to load piece data");
      }

      const [pieceData, usersData] = await Promise.all([
        pieceRes.json(),
        usersRes.json(),
      ]);

      setPiece(pieceData);
      setUserPieces(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setHasLoaded(false); // Allow retry on error
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (targetUser: User) => {
    if (!user) return;

    try {
      setChatLoading(true);
      // Get or create chat
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_user_id: user.id,
          target_user_id: targetUser.id,
        }),
      });

      if (response.ok) {
        const chatData = await response.json();
        // Navigate to the chat page
        router.push(`/chat/${chatData.id}`);
      } else {
        throw new Error("Failed to start chat");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start chat");
    } finally {
      setChatLoading(false);
    }
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
            Do not pass GO. Just don't do it...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!piece) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Piece not found</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${piece.color} 0%, ${piece.color}dd 100%)`,
          color: "black",
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
              {piece.name}
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Users that have this piece: {userPieces.length}
          </Typography>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Users List */}
        {userPieces.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              border: "2px solid #000",
              borderRadius: 2,
              padding: 2,
              backgroundColor: "#f8f9fa",
            }}
          >
            <PersonIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No users have this piece yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to add this piece to your collection!
            </Typography>
            <Link href="/my-pieces">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#d82f28",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#b8070d",
                    color: "white",
                  },
                  mt: 2,
                }}
              >
                My Pieces
              </Button>
            </Link>
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
              Users with this piece:
            </Typography>
            <Grid container spacing={2}>
              {userPieces.map((userPiece, index) => (
                <Grid item xs={6} sm={3} md={2.4} key={index}>
                  <Card
                    sx={{
                      height: 200,
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      border: `2px solid ${piece.color}`,
                      borderRadius: 0,
                      overflow: "hidden",
                      transition: "all 0.2s ease-in-out",
                      position: "relative",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 3,
                      },
                    }}
                  >
                    {/* Color bar at top */}
                    <Box
                      sx={{
                        height: 36,
                        backgroundColor: piece.color,
                        width: "100%",
                      }}
                    />
                    {/* User name */}
                    <Box
                      sx={{
                        p: 1,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "bold",
                          textAlign: "center",
                          width: "100%",
                          lineHeight: 1.2,
                          fontSize: "1.25rem",
                          mb: 1,
                        }}
                      >
                        {userPiece.user.username}
                      </Typography>

                      {/* Chat button */}
                      {user && (
                        <Button
                          size="small"
                          onClick={() => handleStartChat(userPiece.user)}
                          disabled={
                            userPiece.user.id ===
                            user.unsafeMetadata?.supabase_user_id
                          }
                          sx={{
                            backgroundColor:
                              userPiece.user.id ===
                              user.unsafeMetadata?.supabase_user_id
                                ? "rgba(158, 158, 158, 0.2)"
                                : "#d82f28",
                            color:
                              userPiece.user.id ===
                              user.unsafeMetadata?.supabase_user_id
                                ? "#9e9e9e"
                                : "white",
                            minWidth: "auto",
                            px: 2,
                            py: 0.5,
                            fontSize: "0.875rem",
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor:
                                userPiece.user.id ===
                                user.unsafeMetadata?.supabase_user_id
                                  ? "rgba(158, 158, 158, 0.2)"
                                  : "#b8070d",
                              color:
                                userPiece.user.id ===
                                user.unsafeMetadata?.supabase_user_id
                                  ? "#9e9e9e"
                                  : "white",
                            },
                            "&.Mui-disabled": {
                              backgroundColor: "rgba(158, 158, 158, 0.2)",
                              color: "#9e9e9e",
                            },
                            mb: 4,
                          }}
                        >
                          Chat
                        </Button>
                      )}
                    </Box>

                    {/* Acquired location - bottom left */}
                    {(userPiece.city_acquired || userPiece.state_acquired) && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 4,
                          left: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderRadius: 1,
                          px: 0.5,
                          py: 0.25,
                        }}
                      >
                        <LocationIcon sx={{ fontSize: 24 }} />
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "0.75rem",
                            color: "text.secondary",
                            lineHeight: 1,
                          }}
                        >
                          {[userPiece.city_acquired, userPiece.state_acquired]
                            .filter(Boolean)
                            .join(", ")}
                        </Typography>
                      </Box>
                    )}

                    {/* Created date - bottom right */}
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        bottom: 4,
                        right: 4,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: 1,
                        px: 0.5,
                        py: 0.25,
                      }}
                    >
                      {new Date(userPiece.created_at).toLocaleDateString()}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}
