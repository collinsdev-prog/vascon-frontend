"use client";

import { createContext, useState, useEffect, useContext, useRef } from "react";
import { useApiWithLoader } from "@/lib/makeApiRequestWithLoader";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "vending_machine_accesstoken",
  USER_DATA: "vending_machine_userdata",
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const fetchedUserRef = useRef(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = useApiWithLoader();

  useEffect(() => {
    const checkLoggedIn = async () => {
      if (fetchedUserRef.current) return; // already fetched
      fetchedUserRef.current = true;

      setLoading(true);
      try {
        // console.log('AUTH - Page Load/Refresh - Checking localStorage:');
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        // console.log('AUTH - Found token:', !!token);
        // console.log('AUTH - Found storedUser:', storedUser);

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // console.log('AUTH - Using user from localStorage:', parsedUser);
          // Check if the token is expired
          const isTokenExpired = checkTokenExpiry(token);
          if (isTokenExpired) {
            logout(); // Log the user out if token is expired
            return;
          }

          setUser(parsedUser);
        } else {
          // console.log('AUTH - Fetching user from API');
          const response = await api("/auth/user", "GET");
          const fetchedUser = response.data;
          // console.log('AUTH - API returned user:', fetchedUser);
          localStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(fetchedUser)
          );
          setUser(fetchedUser);
        }
      } catch (error) {
        console.warn("Auth validation failed:", error.message);
        logout(); // Log the user out if there's an error
      } finally {
        setLoading(false);
      }
    };

    const checkTokenExpiry = (token) => {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.exp < Date.now() / 1000;
      } catch (err) {
        console.error("JWT decode failed:", err);
        return true; // Assume expired if decoding fails
      }
    };

    checkLoggedIn();
  }, [api]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api("/auth/login", "POST", { email, password });
      const { access_token, user, active_sessions, decision_required } =
        response.data;
      if (decision_required) {
        // If there are active sessions, show the force login prompt
        // Return active session details and prompt for decision
        return { success: false, active_sessions, decision_required };
      }
      toast.success("Login successful");
      // If no active sessions, proceed with regular login
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      setUser(user);
      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const forceLogin = async (
    email,
    password,
    terminateOtherSessions = false
  ) => {
    setLoading(true);
    try {
      const response = await api("/auth/force-login", "POST", {
        email,
        password,
        terminateOtherSessions,
      });

      const { access_token, user, session_id, device_id } = response.data;

      if (access_token && user) {
        // Store the token and user data in localStorage
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

        // Update the user state in context
        setUser(user);

        toast.success("Force login successful.");
        return { success: true, user, session_id, device_id };
      }

      return {
        success: false,
        message: "Force login failed due to invalid data",
      };
    } catch (error) {
      console.error("Force Login error:", error);
      toast.error("Force login failed.");
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await api("/auth/signup", "POST", userData);
      const { access_token, user } = response.data;
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      setUser(user);
      toast.success("Account created successfully!");
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed.");
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const logoutAll = async () => {
    try {
      await api("/auth/logout/all", "POST");
      logout();
      toast.success("Logged out from all devices.");
      return { success: true };
    } catch (error) {
      console.error("LogoutAll failed:", error.message);
      toast.error("Logout from all devices failed.");
      return { success: false, message: error.message };
    }
  };

  // Function to update user data
  const updateUser = (updatedUser) => {
    console.log("AuthContext - Before Update:", {
      prevUser: user,
      updatedUser,
    });
    setUser((prevUser) => {
      const newUser = { ...prevUser, ...updatedUser };
      console.log("AuthContext - Writing to localStorage:", newUser);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser));
      return newUser;
    });

    // Log after state update is scheduled
    setTimeout(() => {
      console.log("AuthContext - After Update:", {
        user: user,
        localStorage: JSON.parse(
          localStorage.getItem(STORAGE_KEYS.USER_DATA) || "{}"
        ),
      });
    }, 0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        forceLogin,
        register,
        logout,
        logoutAll,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isSeller: user?.role === "seller",
        isBuyer: user?.role === "buyer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
