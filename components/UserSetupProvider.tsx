"use client";

import { useUserSetup } from "@/lib/useUserSetup";
import { Box, CircularProgress, Typography } from "@mui/material";

interface UserSetupProviderProps {
  children: React.ReactNode;
}

export function UserSetupProvider({ children }: UserSetupProviderProps) {
  const { isSettingUp, setupComplete } = useUserSetup();

  // Show loading state while setting up user
  if (isSettingUp) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="h6" color="text.secondary">
          Setting up your account...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
