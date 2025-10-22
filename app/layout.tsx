import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { CssBaseline } from "@mui/material";
import PostHogProvider from "@/components/PostHogProvider";
import Navbar from "@/components/Navbar";
import ThemeRegistry from "@/components/ThemeRegistry";
import { UserSetupProvider } from "@/components/UserSetupProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monopoly McTrade - McDonald's Monopoly Piece Finder",
  description:
    "Trade McDonald's Monopoly pieces with other players. Find the best deals and win prizes together.",
  keywords:
    "Monopoly MC Trade, McDonald's Monopoly, Monopoly pieces, Trade pieces, Win prizes, McDonald's, Monopoly, Trade, Find pieces",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeRegistry>
            <CssBaseline />
            <PostHogProvider>
              <UserSetupProvider>
                <Navbar />
                <main className="min-h-screen">{children}</main>
              </UserSetupProvider>
            </PostHogProvider>
          </ThemeRegistry>
        </body>
      </html>
    </ClerkProvider>
  );
}
