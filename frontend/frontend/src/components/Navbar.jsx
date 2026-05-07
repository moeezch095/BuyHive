
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/buyhivelogo.png";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import API from  "../api/api"

function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const checkAuth = () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const user =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true" ||
        sessionStorage.getItem("isLoggedIn") === "true";

      const hasAuth = Boolean(token || user || isLoggedIn);
      console.log(" Navbar auth check:", {
        token: !!token,
        user: !!user,
        isLoggedIn,
        hasAuth,
      });
      setIsAuthenticated(hasAuth);
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);
    window.addEventListener("focus", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
      window.removeEventListener("focus", checkAuth);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(API.logout, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("isLoggedIn");

        setIsAuthenticated(false);
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        backgroundColor: "white",
        color: "#333",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "72px !important",
            px: { xs: 2, sm: 4, md: 6, lg: 8 },
          }}
        >
         
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <img
              src={logo}
              alt="BuyHive Logo"
              style={{ height: 54, width: "auto", objectFit: "contain" }}
            />
          </Box>

          
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              alignItems: "center",
              gap: { lg: 4, xl: 5 },
              flex: 1,
              justifyContent: "center",
              mx: 6,
            }}
          >
            <Typography
              sx={{
                cursor: "pointer",
                fontSize: "0.96rem",
                fontWeight: 500,
                "&:hover": { color: "#14b8a6" },
              }}
            >
              Expert Sourcing
            </Typography>
            <Typography
              sx={{
                cursor: "pointer",
                fontSize: "0.96rem",
                fontWeight: 500,
                "&:hover": { color: "#14b8a6" },
              }}
            >
              Contract Manufacturing
            </Typography>
            <Link
              to="/buy"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography
                sx={{
                  cursor: "pointer",
                  fontSize: "0.96rem",
                  fontWeight: 500,
                  "&:hover": { color: "#14b8a6", fontWeight: 600 },
                }}
              >
                Buy
              </Typography>
            </Link>
            <Typography
              sx={{
                cursor: "pointer",
                fontSize: "0.96rem",
                fontWeight: 500,
                "&:hover": { color: "#14b8a6" },
              }}
            >
              Financing
            </Typography>
            <Typography
              sx={{
                cursor: "pointer",
                fontSize: "0.96rem",
                fontWeight: 500,
                "&:hover": { color: "#14b8a6" },
              }}
            >
              About Us
            </Typography>
          </Box>

          
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexShrink: 0,
              ml: "auto",
            }}
          >
            {isAuthenticated ? (
              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                  backgroundColor: "#14b8a6",
                  color: "white",
                  borderRadius: "999px",
                  textTransform: "none",
                  px: 4,
                  py: 1,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  "&:hover": {
                    backgroundColor: "#0d9488",
                  },
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Link to="/register" style={{ textDecoration: "none" }}>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#14b8a6",
                      color: "#14b8a6",
                      borderRadius: "999px",
                      textTransform: "none",
                      px: 3,
                      py: 0.9,
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      "&:hover": {
                        backgroundColor: "#f0fdfa",
                        borderColor: "#14b8a6",
                      },
                    }}
                  >
                    Register
                  </Button>
                </Link>

                <Link to="/login" style={{ textDecoration: "none" }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#14b8a6",
                      color: "white",
                      borderRadius: "999px",
                      textTransform: "none",
                      px: 3.5,
                      py: 0.9,
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      "&:hover": {
                        backgroundColor: "#0d9488",
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
