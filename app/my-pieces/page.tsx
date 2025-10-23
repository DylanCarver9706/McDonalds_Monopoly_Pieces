"use client";

import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useCachedData } from "@/lib/useCachedData";

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
];

interface Board {
  id: string;
  name: string;
  year: number;
}

interface Piece {
  id: string;
  name: string;
  section: string;
  board_order: number;
  color: string;
}

interface UserPiece {
  user_id: string;
  board_id: string;
  piece_id: string;
  city_acquired: string;
  state_acquired: string;
  created_at: string;
  piece_name?: string;
  board_year?: number;
  section?: string;
  color?: string;
}

export default function MyPiecesPage() {
  const { user, isLoaded } = useUser();
  const [userPieces, setUserPieces] = useState<UserPiece[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingPieces, setLoadingPieces] = useState(false);

  // Use cached data for boards and pieces
  const { data: boards, loading: boardsLoading } = useCachedData<Board[]>({
    cacheKey: "boards",
    fetchFunction: async () => {
      const response = await fetch("/api/boards");
      if (!response.ok) throw new Error("Failed to load boards");
      return response.json();
    },
  });

  const { data: pieces, loading: piecesLoading } = useCachedData<Piece[]>({
    cacheKey: "pieces",
    fetchFunction: async () => {
      const response = await fetch("/api/pieces");
      if (!response.ok) throw new Error("Failed to load pieces");
      return response.json();
    },
  });

  const loading = boardsLoading || piecesLoading;

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    board_id: "",
    piece_id: "",
    city_acquired: "",
    state_acquired: "",
  });

  // Load user pieces when user is loaded and authenticated
  useEffect(() => {
    if (isLoaded && user) {
      loadUserPieces();
    } else if (isLoaded && !user) {
      setError("Please sign in to view your pieces");
    }
  }, [isLoaded, user]);

  const loadUserPieces = async () => {
    if (!user || !isLoaded) {
      return;
    }

    setLoadingPieces(true);
    setError(null);

    try {
      const response = await fetch(`/api/user-pieces?clerk_user_id=${user.id}`);

      if (!response.ok) {
        if (response.status === 401) {
          setError("Please sign in to view your pieces");
          return;
        }
        throw new Error(`Failed to load user pieces: ${response.status}`);
      }

      const userPiecesData = await response.json();
      setUserPieces(userPiecesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingPieces(false);
    }
  };

  const handleAddPiece = () => {
    setFormData({
      board_id: boards?.[0]?.id || "",
      piece_id: "",
      city_acquired: "",
      state_acquired: "",
    });
    setOpenDialog(true);
  };

  const handleDeletePiece = async (piece: UserPiece) => {
    if (!confirm("Are you sure you want to delete this piece?")) return;
    if (!user) return;

    try {
      const response = await fetch("/api/user-pieces", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board_id: piece.board_id,
          piece_id: piece.piece_id,
          clerk_user_id: user.id,
        }),
      });

      if (response.ok) {
        loadUserPieces(); // Reload the list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete piece");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete piece");
    }
  };

  const handleSavePiece = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/user-pieces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          clerk_user_id: user.id,
        }),
      });

      if (response.ok) {
        setOpenDialog(false);
        loadUserPieces(); // Reload the list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save piece");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save piece");
    }
  };

  // Group pieces by section and sort by board_order
  const groupedPieces =
    pieces?.reduce((acc, piece) => {
      const section = piece.section || "Other";
      if (!acc[section]) acc[section] = [];
      acc[section].push(piece);
      return acc;
    }, {} as Record<string, Piece[]>) || {};

  // Sort pieces within each section by board_order
  Object.keys(groupedPieces).forEach((section) => {
    groupedPieces[section].sort((a, b) => a.board_order - b.board_order);
  });

  // Define section order: regular sections by board_order, then utilities and railroads at bottom
  const sectionOrder = [
    "Brown",
    "Light Blue",
    "Pink",
    "Orange",
    "Red",
    "Yellow",
    "Green",
    "Dark Blue",
    "Utility",
    "Railroad",
  ];

  // Get section colors from actual piece data
  const getSectionColor = (section: string) => {
    const sectionPieces = groupedPieces[section];
    if (sectionPieces && sectionPieces.length > 0) {
      return sectionPieces[0].color;
    }
    return "#666666"; // fallback color
  };

  if (!isLoaded || loading || loadingPieces) {
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
            Loading your pieces...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 4,
              backgroundColor: "#d82f28",
              borderRadius: 3,
              color: "white",
              boxShadow: 3,
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
              Please Sign In
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              You need to be signed in to view your Monopoly pieces collection.
            </Typography>
            <SignInButton mode="modal">
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "white",
                  color: "#d82f28",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                }}
              >
                Sign In
              </Button>
            </SignInButton>
          </Box>
        </Container>
      </Box>
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
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h1"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            My Monopoly Pieces
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ mb: 4, opacity: 0.9 }}
          >
            Manage your collection of McDonald's Monopoly pieces
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddPiece}
              size="large"
              sx={{
                backgroundColor: "white",
                color: "#d82f28",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              Add New Piece
            </Button>
          </Box>
        </Container>
      </Box>

      {/* My Pieces Section */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {userPieces.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No pieces in your collection yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start building your collection by adding your first piece!
              </Typography>
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
                {userPieces.length} Monopoly piece
                {userPieces.length === 1 ? "" : "s"} collected in{" "}
                {userPieces[0].board_year}
              </Typography>
              <Grid container spacing={2}>
                {userPieces.map((piece, index) => (
                  <Grid item xs={6} sm={3} md={2.4} key={index}>
                    <Card
                      sx={{
                        height: 200,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        border: `2px solid ${piece.color || "#666666"}`,
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
                          backgroundColor: piece.color || "#666666",
                          width: "100%",
                        }}
                      />
                      {/* Property name */}
                      <Box
                        sx={{
                          p: 1,
                          flexGrow: 1,
                          display: "flex",
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
                            fontSize: "1rem",
                            mb: 7.5,
                          }}
                        >
                          {piece.piece_name}
                        </Typography>
                      </Box>

                      {/* Acquired location - bottom left */}
                      {(piece.city_acquired || piece.state_acquired) && (
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
                            {[piece.city_acquired, piece.state_acquired]
                              .filter(Boolean)
                              .join(", ")}
                          </Typography>
                        </Box>
                      )}

                      {/* Delete button - bottom right */}
                      <IconButton
                        size="small"
                        onClick={() => handleDeletePiece(piece)}
                        color="error"
                        sx={{
                          position: "absolute",
                          bottom: 4,
                          right: 4,
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 0, 0, 0.1)",
                          },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 22 }} />
                      </IconButton>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </Box>

      {/* Add Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Piece</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={formData.board_id}
                onChange={(e) =>
                  setFormData({ ...formData, board_id: e.target.value })
                }
                label="Year"
              >
                {boards?.map((board) => (
                  <MenuItem key={board.id} value={board.id}>
                    {board.year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Piece</InputLabel>
              <Select
                value={formData.piece_id}
                onChange={(e) =>
                  setFormData({ ...formData, piece_id: e.target.value })
                }
                label="Piece"
              >
                {sectionOrder
                  .filter(
                    (section) =>
                      groupedPieces[section] &&
                      groupedPieces[section].length > 0
                  )
                  .flatMap((section) => [
                    // Section header with color bar only
                    <MenuItem key={`header-${section}`}>
                      <Box
                        sx={{
                          height: 30,
                          backgroundColor: getSectionColor(section),
                          width: "100%",
                        }}
                      />
                    </MenuItem>,
                    // Section pieces with property card styling
                    ...groupedPieces[section].map((piece) => (
                      <MenuItem
                        key={piece.id}
                        value={piece.id}
                        sx={{
                          p: 1,
                          margin: "0 8px",
                          borderRadius: 0.5,
                          // borderLeft: `4px solid ${getSectionColor(section)}`,
                          backgroundColor: "#f8f9fa",
                          "&:hover": {
                            backgroundColor: `${getSectionColor(section)}20`,
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: "bold",
                            color: "text.primary",
                            fontSize: "0.875rem",
                          }}
                        >
                          {piece.name}
                        </Typography>
                      </MenuItem>
                    )),
                  ])}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="City Acquired (Optional)"
              value={formData.city_acquired}
              onChange={(e) =>
                setFormData({ ...formData, city_acquired: e.target.value })
              }
              placeholder="e.g., New York"
            />

            <FormControl fullWidth>
              <InputLabel>State Acquired (Optional)</InputLabel>
              <Select
                value={formData.state_acquired}
                onChange={(e) =>
                  setFormData({ ...formData, state_acquired: e.target.value })
                }
                label="State Acquired (Optional)"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {US_STATES.map((state) => (
                  <MenuItem key={state.code} value={state.code}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              color: "#d82f28",
              "&:hover": {
                backgroundColor: "#d82f2820",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSavePiece}
            variant="contained"
            sx={{
              backgroundColor: "#d82f28",
              "&:hover": {
                backgroundColor: "#b8070d",
              },
            }}
          >
            Add Piece
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
