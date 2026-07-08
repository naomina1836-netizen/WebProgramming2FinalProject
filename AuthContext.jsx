import { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Auth Provider component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem("token"));

    // Set up axios interceptor for token
    useEffect(() => {
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common["Authorization"];
        }
    }, [token]);

    // Load user on mount
    useEffect(() => {
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    async function loadUser() {
        try {
            const res = await api.get("/users/me");
            setUser(res.data);
        } catch (err) {
            console.error("Error loading user:", err);
            if (err.response?.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    }

    async function login(email, password) {
        try {
            const res = await api.post("/auth/login", { email, password });
            const { token, user } = res.data;
            
            localStorage.setItem("token", token);
            setToken(token);
            setUser(user);
            
            return { success: true, user };
        } catch (err) {
            console.error("Login error:", err);
            throw err;
        }
    }

    async function register(userData) {
        try {
            const res = await api.post("/auth/register", userData);
            return { success: true, data: res.data };
        } catch (err) {
            console.error("Register error:", err);
            throw err;
        }
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common["Authorization"];
        toast.success("Logged out successfully");
    }

    const value = {
        user,
        setUser,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Default export for backward compatibility
export default AuthContext;