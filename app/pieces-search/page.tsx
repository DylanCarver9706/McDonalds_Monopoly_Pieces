"use client";

import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  TextField,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCachedData } from "@/lib/useCachedData";

interface Piece {
  id: string;
  name: string;
  section: string;
  color: string;
}

interface PropertySet {
  section: string;
  color: string;
  pieces: Piece[];
}

export default function PiecesSearchPage() {
  const [error, setError] = useState<string | null>(null);

  // Use cached data for pieces
  const { data: pieces, loading } = useCachedData<Piece[]>({
    cacheKey: "pieces",
    fetchFunction: async () => {
      const response = await fetch("/api/pieces");
      if (!response.ok) throw new Error("Failed to load pieces");
      return response.json();
    },
  });

  // Group pieces by section when data is loaded
  const propertySets = pieces ? groupPiecesBySection(pieces) : [];

  function groupPiecesBySection(pieces: Piece[]): PropertySet[] {
    const groupedPieces = pieces.reduce((acc, piece) => {
      const section = piece.section || "Other";
      if (!acc[section]) {
        acc[section] = {
          section,
          color: piece.color || "#666666",
          pieces: [],
        };
      }
      acc[section].pieces.push(piece);
      return acc;
    }, {} as Record<string, PropertySet>);

    return Object.values(groupedPieces);
  }

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

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #667eea 0%, rgb(71, 94, 194) 100%)",
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
            Find Your Missing Monopoly Pieces
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ mb: 4, opacity: 0.9 }}
          >
            Search for specific pieces or browse by property set to complete
            your collection
          </Typography>
        </Container>
      </Box>

      {/* Property Sets Section */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ color: "#1e293b", mb: 4 }}
          >
            Browse by Property Set
          </Typography>

          <Grid container spacing={3}>
            {propertySets.map((set, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    border: "2px solid #000",
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <Grid container spacing={1}>
                    {set.pieces.map((piece, pieceIndex) => (
                      <Grid item xs={10} sm={6} md={5.5} key={piece.id}>
                        <Card
                          component={Link}
                          href={`/piece/${piece.id}`}
                          sx={{
                            textDecoration: "none",
                            color: "inherit",
                            height: 200,
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            border: `2px solid ${set.color}`,
                            borderRadius: 0,
                            overflow: "hidden",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: 3,
                            },
                          }}
                        >
                          {/* Color bar at top */}
                          <Box
                            sx={{
                              height: 32,
                              backgroundColor: set.color,
                              width: "100%",
                            }}
                          />
                          {/* Property name */}
                          <Box
                            sx={{
                              p: 1.5,
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
                                fontSize: "0.875rem",
                              }}
                            >
                              {piece.name}
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
