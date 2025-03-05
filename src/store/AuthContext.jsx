import { createContext, useState } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  isLoggedIn: false,
  login: async (email, password) => {},
  logout: () => {},
  register: async (name, email, password) => {}
});

export function AuthContextProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const isLoggedIn = !!token;

  async function login(email, password) {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to login.");
    }
    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  async function register(name, email, password) {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to register.");
    }
    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
  }

  const contextValue = {
    user,
    token,
    isLoggedIn,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
