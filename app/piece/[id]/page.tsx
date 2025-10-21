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
      // Get or create chat
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_user_id: targetUser.id }),
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Link href="/pieces-search" style={{ textDecoration: "none" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
              color: "primary.main",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <ArrowBackIcon />
            <Typography variant="body2">Back to Pieces Search</Typography>
          </Box>
        </Link>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Chip
            label={piece.section}
            sx={{
              backgroundColor: `${piece.color}20`,
              color: piece.color,
              border: `1px solid ${piece.color}`,
              fontWeight: "bold",
            }}
          />
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            {piece.name}
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary">
          {userPieces.length} user{userPieces.length !== 1 ? "s" : ""} have this
          piece
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Users List */}
      {userPieces.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <PersonIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No users have this piece yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Be the first to add this piece to your collection!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {userPieces.map((userPiece, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {userPiece.user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {userPiece.user.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {userPiece.board_name}
                      </Typography>
                    </Box>
                    {user &&
                      userPiece.user.id !==
                        user.unsafeMetadata?.supabase_user_id && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ChatIcon />}
                          onClick={() => handleStartChat(userPiece.user)}
                          sx={{ minWidth: "auto" }}
                        >
                          Chat
                        </Button>
                      )}
                  </Box>

                  {(userPiece.city_acquired || userPiece.state_acquired) && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {[userPiece.city_acquired, userPiece.state_acquired]
                          .filter(Boolean)
                          .join(", ")}
                      </Typography>
                    </Box>
                  )}

                  <Typography variant="caption" color="text.secondary">
                    Added {new Date(userPiece.created_at).toLocaleDateString()}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
