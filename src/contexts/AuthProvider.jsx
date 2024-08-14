import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [token, setToken] = useState();

  const getPersonalizedToken = () => {
    return token;
  };

  const login = async ({ full_name, email, personal_token }) => {
    const res = await fetch(`${import.meta.env.VITE_API_ROOT}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name,
        email,
        personal_token,
      }),
    });

    if (res.status == 200) {
      const data = await res.json();
      console.log(data.status);
      if (data.status == 200) {
        setIsAuthenticated(true);
        setToken(personal_token);
        sessionStorage.setItem("auth", true);
        sessionStorage.setItem("token", personal_token);
        return true;
      }
    } else {
      return false;
    }
  };

  const AuthenticatedFetch = async ({ method, url, data }) => {
    console.log(method, url, data);
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const rlt = await res.json()

    return rlt;
  };

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("auth");
    const savedToken = sessionStorage.getItem("token");

    setIsAuthenticated(savedAuth);
    setToken(savedToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        getPersonalizedToken,
        login,
        AuthenticatedFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
