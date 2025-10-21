"use client";

import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  Chat as ChatIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  const benefits = [
    {
      icon: <SearchIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
      title: "Find Missing Pieces",
      description:
        "Search for the specific Monopoly pieces you need to complete your sets and win prizes.",
    },
    {
      icon: <ChatIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
      title: "Connect & Negotiate",
      description:
        "Chat directly with other players to negotiate trades, splits, or sales of your pieces.",
    },
    {
      icon: <ShareIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
      title: "Share the Prize",
      description:
        "Work together to complete sets and split prizes fairly with your trading partners.",
    },
  ];

  const features = [
    "Search by piece name or number",
    "Real-time chat messaging",
    "Secure piece verification",
    "Prize value calculator",
    "Mobile-friendly interface",
    "Safe trading guidelines",
    "Piece rarity indicators",
    "Trading history tracking",
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
          color: "white",
          py: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                McDonald's Monopoly Piece Trader
              </Typography>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ mb: 3, opacity: 0.9 }}
              >
                Connect with other players to trade, sell, or split McDonald's
                Monopoly pieces and win prizes together.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                <SignInButton mode="modal">
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: "white",
                      color: "#2563eb",
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Start Trading Pieces
                  </Button>
                </SignInButton>
                <Button
                  component={Link}
                  href="/how-it-works"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  How Trading Works
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ backgroundColor: "#f8fafc", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ color: "#1e293b" }}
          >
            Why Trade Monopoly Pieces?
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ mb: 6, color: "#64748b" }}
          >
            Complete your sets faster by connecting with other players and
            working together
          </Typography>

          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    p: 3,
                    "&:hover": {
                      transform: "translateY(-4px)",
                      transition: "transform 0.3s ease-in-out",
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{benefit.icon}</Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#1e293b" }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography sx={{ color: "#64748b" }}>
                    {benefit.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
          textAlign: "center",
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ color: "white" }}
          >
            Ready to Find Your Missing Pieces?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, color: "white" }}>
            Join thousands of players who have completed their sets and won
            prizes through trading.
          </Typography>
          <SignInButton mode="modal">
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: "white",
                color: "#2563eb",
                px: 4,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              Start Trading Now
            </Button>
          </SignInButton>
        </Container>
      </Box>

      {/* Game Info Section */}
      <Box sx={{ backgroundColor: "#ffffff", py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ color: "#1e293b" }}
            >
              About McDonald's Monopoly
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: "#64748b" }}>
              Everything you need to know about the game and trading safely
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <SecurityIcon sx={{ color: "#2563eb" }} />
                  Safe Trading Guidelines
                </Typography>
                <Typography sx={{ color: "#64748b", mb: 2 }}>
                  • Always verify pieces before trading
                </Typography>
                <Typography sx={{ color: "#64748b", mb: 2 }}>
                  • Use our secure chat system for negotiations
                </Typography>
                <Typography sx={{ color: "#64748b", mb: 2 }}>
                  • Never share personal information
                </Typography>
                <Typography sx={{ color: "#64748b", mb: 2 }}>
                  • Report suspicious activity immediately
                </Typography>
                <Typography sx={{ color: "#64748b" }}>
                  • Meet in public places for physical trades
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <SpeedIcon sx={{ color: "#2563eb" }} />
                  Game Rules & Tips
                </Typography>
                <Typography sx={{ color: "#64748b", mb: 2 }}>
                  • Game runs for limited time each year
                </Typography>
                <Typography sx={{ color: "#64748b", mb: 2 }}>
                  • Some pieces are extremely rare
                </Typography>
                <Typography sx={{ color: "#64748b", mb: 2 }}>
                  • Complete sets to win prizes
                </Typography>
                <Typography sx={{ color: "#64748b", mb: 2 }}>
                  • Check official McDonald's terms
                </Typography>
                <Typography sx={{ color: "#64748b" }}>
                  • Keep your pieces safe and dry
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ backgroundColor: "#f8fafc", py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ color: "#1e293b" }}
            >
              Everything You Need to Trade Successfully
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: "#64748b" }}>
              Our platform provides all the tools you need to find pieces,
              connect with traders, and complete your Monopoly sets.
            </Typography>
          </Box>

          <Box sx={{ maxWidth: "sm", mx: "auto", mb: 2 }}>
            <Grid container spacing={2}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon sx={{ color: "#2563eb" }} />
                    <Typography sx={{ color: "#1e293b" }}>{feature}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Don't Miss Out on Prizes
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            The McDonald's Monopoly game has limited time. Start trading pieces
            today to complete your sets and win prizes.
          </Typography>
          <SignInButton mode="modal">
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "white",
                color: "#2563eb",
                px: 6,
                py: 2,
                fontSize: "1.1rem",
                "&:hover": {
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              Start Trading - It's Free
            </Button>
          </SignInButton>
        </Container>
      </Box>
    </Box>
  );
}
