import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { apiRequest, AUTH_API_PATHS, getStoredToken, setStoredToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existingToken = getStoredToken();

    if (!existingToken) {
      setLoading(false);
      return;
    }

    setToken(existingToken);

    apiRequest(AUTH_API_PATHS.me, { token: existingToken })
      .then((response) => {
        setUser(response.user);
      })
      .catch(() => {
        setStoredToken("");
        setToken("");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAuth = useCallback(async (path, payload) => {
    const response = await apiRequest(path, {
      method: "POST",
      body: payload,
    });

    setStoredToken(response.token);
    setToken(response.token);
    setUser(response.user);

    return response;
  }, []);

  const refreshUser = useCallback(async (nextToken = token) => {
    if (!nextToken) {
      return null;
    }

    const response = await apiRequest(AUTH_API_PATHS.me, { token: nextToken });
    setUser(response.user);
    return response.user;
  }, [token]);

  const logout = useCallback(() => {
    setStoredToken("");
    setToken("");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      loading,
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login: (payload) => handleAuth(AUTH_API_PATHS.login, payload),
      signup: (payload) => handleAuth(AUTH_API_PATHS.register, payload),
      googleLogin: (payload) => handleAuth(AUTH_API_PATHS.google, payload),
      refreshUser,
      logout,
    }),
    [handleAuth, loading, logout, refreshUser, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
