
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import ForgotPasswordModal from "../components/ForgotPassword";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [showForgotModal, setShowForgotModal] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email aur password dono chahiye");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(API.login, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("🔥 Login response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Extract token from ALL possible locations in response
      const token =
        data.token ||
        data.accessToken ||
        data.jwt ||
        data?.result?.token ||
        data?.result?.accessToken ||
        data?.data?.token ||
        data?.data?.accessToken ||
        data?.user?.token;

      // Extract user from ALL possible locations
      const user =
        data.user ||
        data?.result?.user ||
        data?.data?.user ||
        data?.userData ||
        null;

      console.log(" Extracted token:", token);
      console.log(" Extracted user:", user);

      if (!token) {
        console.error("No token found in response:", data);
        throw new Error("Login successful but no token received. Check console for response structure.");
      }

      const storage = keepSignedIn ? localStorage : sessionStorage;
      const otherStorage = keepSignedIn ? sessionStorage : localStorage;

      // Clear other storage first
      otherStorage.removeItem("token");
      otherStorage.removeItem("user");
      otherStorage.removeItem("isLoggedIn");

      // Save to selected storage
      storage.setItem("token", token);
      if (user) {
        storage.setItem("user", JSON.stringify(user));
      }
      storage.setItem("isLoggedIn", "true");

      console.log("✅ Token saved to", keepSignedIn ? "localStorage" : "sessionStorage");

      // Dispatch auth change event
      window.dispatchEvent(new Event("authChange"));

      navigate("/buy");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div style={{ height: "100px" }} />

      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}

      <div
        style={{
          width: "100%",
          height: "1000px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            width: "475px",
            height: "700px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          <div>
            <p
              style={{
                height: "50px",
                color: "#6b7280",
                marginBottom: "6px",
                fontSize: "50px",
              }}
            >
              Welcome back!
            </p>

            <h2
              style={{
                height: "20px",
                color: "#14b8a6",
                fontWeight: "700",
                fontSize: "30px",
              }}
            >
              Sign In to BuyHive
            </h2>

            <h3
              style={{
                color: "#14b8a6",
                fontSize: "25px",
                marginTop: "4px",
              }}
            >
              as a Buyer
            </h3>
          </div>

          <Box
            display="flex"
            flexDirection="column"
            gap={5}
            width="300px"
            sx={{ p: 2, borderRadius: "8px" }}
          >
            <TextField
              label="E-mail Address"
              sx={{ marginBottom: "30px" }}
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
              helperText={error}
            />

           <TextField
  label="Password"
  type={showPassword ? "text" : "password"} 
  variant="outlined"
  fullWidth
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  slotProps={{
    input: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword((prev) => !prev)}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    },
  }}
/>
          </Box>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "15px",
              marginLeft: "19px",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            <input
              type="checkbox"
              id="keepSignedIn"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
                accentColor: "#2563eb",
              }}
            />

            <label htmlFor="keepSignedIn" style={{ cursor: "pointer" }}>
              Keep me Signed In
            </label>
          </div>

          <div style={{ marginTop: "25px" }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={loading}
              sx={{
                backgroundColor: "#14b8a6",
                borderRadius: "999px",
                textTransform: "none",
                "&:hover": { backgroundColor: "#0d9488" },
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <h3 className="text-lg text-gray-800 ">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#0d9488] underline hover:text-[#0d9488] "
              >
                Create one!
              </Link>
            </h3>

            <p className="text-[18px] text-gray-800 m-0">
              Forgot password?
              <span
                onClick={() => setShowForgotModal(true)}
                className="text-[#0d9488] underline hover:text-[#0d9488] ml-1 cursor-pointer"
              >
                Click here to create new one.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;