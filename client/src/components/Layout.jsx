// src/components/Layout.jsx
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./Layout.scss";

const Layout = ({ children }) => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const hideSidebarPaths = ["/", "/register"];

    useEffect(() => {
        const token = localStorage.getItem("token");
        const tokenCreated = localStorage.getItem("token_created_at");
        const tokenExpiry = 60 * 60 * 1000; // 1 hour

        if (token && tokenCreated && Date.now() - parseInt(tokenCreated) > tokenExpiry) {
            localStorage.removeItem("token");
            localStorage.removeItem("token_created_at");
            localStorage.removeItem("userId");
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(!!token);
        }
    }, [location]);

    if (isAuthenticated === null) return null;

    return (
        <div className="layout">
            {!hideSidebarPaths.includes(location.pathname) && isAuthenticated && <Sidebar />}
            <div className="content">{children}</div>
        </div>
    );
};

export default Layout;
