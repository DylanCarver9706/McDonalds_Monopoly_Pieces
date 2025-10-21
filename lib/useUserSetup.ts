import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function useUserSetup() {
  const { user, isLoaded } = useUser();
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    const setupUser = async () => {
      // Wait for Clerk to be fully loaded and user to be authenticated
      if (!isLoaded || !user || setupComplete) return;

      // Additional check to ensure user is fully authenticated
      if (!user.id) {
        return;
      }

      // Check if user already has our custom metadata
      const hasUserId = user.unsafeMetadata?.supabase_user_id;

      if (hasUserId) {
        setSetupComplete(true);
        return;
      }

      setIsSettingUp(true);

      try {
        // Get or generate username using first name and first letter of last name
        let username;
        if (user.firstName && user.lastName) {
          username = `${user.firstName} ${user.lastName.charAt(0)}`;
        } else if (user.firstName) {
          username = user.firstName;
        } else if (user.username) {
          username = user.username;
        } else {
          username = `user_${user.id.slice(-8)}`;
        }

        // Ensure username is unique by adding a suffix if needed
        let finalUsername = username;
        let counter = 1;
        let retryCount = 0;
        const maxRetries = 5;

        while (retryCount < maxRetries) {
          try {
            const response = await fetch("/api/create-user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username: finalUsername }),
            });

            const data = await response.json();

            if (response.ok) {
              // Update Clerk user metadata with Supabase user ID
              await user.update({
                unsafeMetadata: {
                  ...user.unsafeMetadata,
                  supabase_user_id: data.user_id,
                },
              });

              setSetupComplete(true);
              break;
            } else if (response.status === 401) {
              // User not authenticated yet, wait and retry with exponential backoff
              retryCount++;
              const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);
              await new Promise((resolve) => setTimeout(resolve, delay));
              continue;
            } else if (
              data.error === "Username already exists" &&
              counter < 10
            ) {
              // Try with a different username
              finalUsername = `${username}_${counter}`;
              counter++;
            } else {
              throw new Error(data.error || "Failed to create user");
            }
          } catch (error) {
            console.error("Error setting up user:", error);
            retryCount++;
            if (retryCount >= maxRetries) {
              console.error("Max retries reached, giving up");
              break;
            }
            const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      } catch (error) {
        console.error("Error in user setup:", error);
      } finally {
        setIsSettingUp(false);
      }
    };

    // Add a small delay to ensure Clerk is fully ready
    const timeoutId = setTimeout(setupUser, 100);

    return () => clearTimeout(timeoutId);
  }, [user, isLoaded, setupComplete]);

  return {
    isSettingUp,
    setupComplete,
    user,
  };
}
