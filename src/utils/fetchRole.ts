export const fetchUserRole = async (): Promise<string | null> => {
    try {
      const response = await fetch("/api/auth/getUser");
      const data = await response.json();
      if (data.success) {
        return data.user.role;
      }
    } catch (error) {
      console.error("Failed to fetch user role:", error);
    }
    return null;
  };