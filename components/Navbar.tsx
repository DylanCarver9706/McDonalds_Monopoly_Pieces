"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Info as InfoIcon,
  Search,
  Collections as CollectionsIcon,
  Chat as ChatIcon,
  ViewModule as ViewModuleIcon,
} from "@mui/icons-material";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    {
      text: "Home",
      href: "/",
      icon: <InfoIcon />,
    },
    {
      text: "Pieces Search",
      href: "/pieces-search",
      icon: <Search />,
    },
    {
      text: "My Pieces",
      href: "/my-pieces",
      icon: <ViewModuleIcon />,
    },
    {
      text: "Chats",
      href: "/chats",
      icon: <ChatIcon />,
    },
    // { text: "How It Works", href: "/how-it-works", icon: <InfoIcon /> },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "left" }}>
      <Typography
        variant="h6"
        sx={{ my: 2, fontWeight: "bold", textAlign: "center" }}
      >
        Monopoly McTrade
      </Typography>
      <List>
        {navItems.map((item) => {
          const isActive =
            pathname.includes(item.href) ||
            (item.text === "Chats" && pathname.startsWith("/chat/"));
          return (
            <ListItem
              key={item.text}
              component={Link}
              href={item.href}
              sx={{
                color: isActive ? "#db080f" : "inherit",
                fontWeight: isActive ? "bold" : "normal",
                "&:hover": {
                  backgroundColor: "#d82f28",
                  color: "white",
                },
              }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "white", color: "text.primary" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Monopoly McTrade
          </Typography>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.text === "Chats" && pathname.startsWith("/chat/"));
                return (
                  <Button
                    key={item.text}
                    component={Link}
                    href={item.href}
                    color="inherit"
                    startIcon={item.icon}
                    sx={{
                      textTransform: "none",
                      color: isActive ? "#db080f" : "inherit",
                      fontWeight: isActive ? "bold" : "normal",
                      "&:hover": {
                        backgroundColor: "#d82f28",
                        color: "white",
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                );
              })}

              {isSignedIn ? (
                <UserButton />
              ) : (
                <SignInButton mode="modal">
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      textTransform: "none",
                      background:
                        "linear-gradient(135deg, #d82f28 0%, #b8070d 100%)",
                    }}
                  >
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
