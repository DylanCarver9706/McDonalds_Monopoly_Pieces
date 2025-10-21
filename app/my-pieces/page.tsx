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
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
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
}

interface UserPiece {
  user_id: string;
  board_id: string;
  piece_id: string;
  city_acquired: string;
  state_acquired: string;
  created_at: string;
  piece_name?: string;
  board_name?: string;
  section?: string;
}

export default function MyPiecesPage() {
  const { user } = useUser();
  const [userPieces, setUserPieces] = useState<UserPiece[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  // Load user pieces on component mount
  useEffect(() => {
    loadUserPieces();
  }, []);

  const loadUserPieces = async () => {
    try {
      const response = await fetch("/api/user-pieces");
      if (!response.ok) {
        throw new Error("Failed to load user pieces");
      }
      const userPiecesData = await response.json();
      setUserPieces(userPiecesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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

    try {
      const response = await fetch("/api/user-pieces", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board_id: piece.board_id,
          piece_id: piece.piece_id,
        }),
      });

      if (response.ok) {
        loadUserPieces();
      } else {
        throw new Error("Failed to delete piece");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete piece");
    }
  };

  const handleSavePiece = async () => {
    try {
      const response = await fetch("/api/user-pieces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setOpenDialog(false);
        loadUserPieces();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save piece");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save piece");
    }
  };

  const groupedPieces =
    pieces?.reduce((acc, piece) => {
      const section = piece.section || "Other";
      if (!acc[section]) acc[section] = [];
      acc[section].push(piece);
      return acc;
    }, {} as Record<string, Piece[]>) || {};

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading your pieces...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Monopoly Pieces
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage your collection of McDonald's Monopoly pieces
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPiece}
          sx={{ mb: 3 }}
        >
          Add New Piece
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {userPieces.map((piece, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ p: 3, height: "100%" }}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {piece.piece_name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleDeletePiece(piece)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Chip
                  label={piece.board_name}
                  size="small"
                  color="primary"
                  variant="outlined"
                />

                {piece.section && (
                  <Chip
                    label={piece.section}
                    size="small"
                    sx={{
                      backgroundColor: `${piece.section}20`,
                      color: piece.section,
                      border: `1px solid ${piece.section}`,
                    }}
                  />
                )}

                {(piece.city_acquired || piece.state_acquired) && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {[piece.city_acquired, piece.state_acquired]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {userPieces.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No pieces in your collection yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start building your collection by adding your first piece!
          </Typography>
        </Box>
      )}

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
                {Object.entries(groupedPieces)
                  .map(([section, sectionPieces]) => [
                    // Section header
                    <MenuItem key={`header-${section}`} disabled>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: "bold",
                          color: "primary.main",
                          textTransform: "uppercase",
                          fontSize: "0.75rem",
                        }}
                      >
                        {section}
                      </Typography>
                    </MenuItem>,
                    // Section pieces
                    ...sectionPieces.map((piece) => (
                      <MenuItem key={piece.id} value={piece.id} sx={{ pl: 3 }}>
                        {piece.name}
                      </MenuItem>
                    )),
                  ])
                  .flat()}
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
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSavePiece} variant="contained">
            Add Piece
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
