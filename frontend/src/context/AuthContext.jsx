import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser, signupUser } from "../helpers/api_communicator";
import { checkAuthStatus, setAuthHeader } from "../helpers/axios_helper";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    console.log("Auth Provider Loaded");

    const [user, setUser] = useState(() => {
      const storedUser = localStorage.getItem("user");
  
      try {
          return storedUser ? JSON.parse(storedUser) : null;
      } catch (error) {
          console.error("Error parsing stored user from localStorage", error);
          return null;  // Return null if there's an error
      }
  });
  

    const [isLoggedIn, setIsLoggedIn] = useState(!!user);
    const [inExplore, setInExplore] = useState(false);

   /* useEffect(() => {
      async function checkSession() {
          const data =  checkAuthStatus();
          if (data && data.message === "ok") {
              setUser(data.user);
              setIsLoggedIn(true);
              setAuthHeader(data.token);
              localStorage.setItem("user", JSON.stringify(data.user));
              localStorage.setItem("token", data.token);
          } else {
              console.error("Invalid auth response:", data);
          }
      }
      checkSession();
  }, []);*/
  

    const login = async (username, password) => {
        setAuthHeader(null);
        const data = await loginUser(username, password);
        if (data) {
            setUser({ id: data.id, username: data.username, name: data.name , email:data.email});
            setIsLoggedIn(true);
            setAuthHeader(data.token);
            setInExplore(false);
            localStorage.setItem("user", JSON.stringify({ id: data.id, username: data.username, name: data.name , email:data.email}));
            localStorage.setItem("token", data.token);
        }
    };

    const signup = async (name, username, email, password) => {
        setAuthHeader(null);
        const data = await signupUser(name, username, email, password);
        if (data) {
            setUser({ id: data.id, username: data.username, name: data.name });
            setIsLoggedIn(true);
            setAuthHeader(data.token);
            localStorage.setItem("user", JSON.stringify({ id: data.id, username: data.username, name: data.name }));
            localStorage.setItem("token", data.token);
        }
    };

    const logout = async () => {
        setAuthHeader(null);
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    const toggleExplore = () => {
        setInExplore(!inExplore);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout, inExplore, toggleExplore }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export const getAuthContext = ()=> useContext(AuthContext); //context used by the users. kinda like a getter function