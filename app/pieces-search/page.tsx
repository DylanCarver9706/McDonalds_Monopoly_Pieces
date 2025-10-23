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
  board_order: number;
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

    // Sort pieces within each section by board_order
    Object.keys(groupedPieces).forEach((section) => {
      groupedPieces[section].pieces.sort(
        (a, b) => a.board_order - b.board_order
      );
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

    // Return sections in the specified order
    return sectionOrder
      .filter(
        (section) =>
          groupedPieces[section] && groupedPieces[section].pieces.length > 0
      )
      .map((section) => groupedPieces[section]);
  }

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
            Loading pieces...
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
            Monopoly Board Pieces
          </Typography>

          <Stack spacing={4}>
            {propertySets.map((set, index) => (
              <Box
                key={index}
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
                  {set.section} Properties
                </Typography>
                <Grid container spacing={1}>
                  {set.pieces.map((piece, pieceIndex) => (
                    <Grid item xs={6} sm={3} md={2.4} key={piece.id}>
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
                            height: 36,
                            backgroundColor: set.color,
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
            ))}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
