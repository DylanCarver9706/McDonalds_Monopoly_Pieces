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
  AttachMoney as AttachMoneyIcon,
  ViewModule as ViewModuleIcon,
} from "@mui/icons-material";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  const benefits = [
    {
      icon: <SearchIcon sx={{ fontSize: 40, color: "#db080f" }} />,
      title: "Find Missing Pieces",
      description:
        "Search for the specific Monopoly pieces you need to complete your sets and win prizes",
    },
    {
      icon: <ViewModuleIcon sx={{ fontSize: 40, color: "#db080f" }} />,
      title: "List Your Pieces",
      description:
        "List your available pieces to have others in the community contact you to complete their sets",
    },
    {
      icon: <ChatIcon sx={{ fontSize: 40, color: "#db080f" }} />,
      title: "Connect & Negotiate",
      description:
        "Chat directly with other players to negotiate trades, splits, or sales of your pieces",
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
          background: "linear-gradient(135deg, #d82f28 0%, #b8070d 100%)",
          color: "white",
          py: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} md={8} sx={{ textAlign: "center" }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Monopoly McTrade
              </Typography>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ mb: 3, opacity: 0.9 }}
              >
                Connect with other players to trade McDonald's Monopoly property
                pieces and win prizes together!
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                sx={{ mb: 4, justifyContent: "center" }}
              >
                <SignInButton mode="modal">
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: "white",
                      color: "#db080f",
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      px: 4,
                      py: 1.5,
                    }}
                    // If the user is signed in already, navigate the user to /pieces-search
                    onClick={() => {
                      if (window.location.pathname !== "/sign-in") {
                        window.location.href = "/pieces-search";
                      }
                    }}
                  >
                    Start Trading Pieces!
                  </Button>
                </SignInButton>
                {/* <Button
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
                </Button> */}
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
          background: "linear-gradient(135deg, #d82f28 0%, #b8070d 100%)",
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
            Join the community of players who have completed their sets and won
            prizes
          </Typography>
          <SignInButton mode="modal">
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: "white",
                color: "#db080f",
                px: 4,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#f8fafc",
                },
              }}
              // If the user is signed in already, navigate the user to /pieces-search
              onClick={() => {
                if (window.location.pathname !== "/sign-in") {
                  window.location.href = "/pieces-search";
                }
              }}
            >
              Start Trading Now
            </Button>
          </SignInButton>
        </Container>
      </Box>
    </Box>
  );
}
