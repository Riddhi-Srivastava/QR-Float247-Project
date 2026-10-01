import React, { useState } from "react";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Utensils,
} from "lucide-react";
import api from "../../lib/api";
interface AdminAuthProps {
  onLogin?: (email: string, password: string) => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const token = response.data?.token;

      if (!token) {
        throw new Error("Login successful but token was not returned.");
      }

      localStorage.setItem("token", token);

      if (response.data?.user) {
        localStorage.setItem(
          "admin_user",
          JSON.stringify(response.data.user)
        );
      }

      onLogin?.(email, password);
    } catch (err: any) {
      console.error(
        "Admin login error:",
        err?.response?.data || err?.message || err
      );

      setError(
        err?.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
        background:
          "linear-gradient(135deg, #fff8ef 0%, #f7eadb 50%, #ead5c0 100%)",
        fontFamily: "Arial, sans-serif",
        color: "#24120d",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "410px",
          background: "#fffdf9",
          border: "1px solid rgba(59,36,24,0.07)",
          borderRadius: "24px",
          padding: "32px",
          boxSizing: "border-box",
          boxShadow:
            "0 20px 55px rgba(59,36,24,0.12)",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              width: "62px",
              height: "62px",
              borderRadius: "18px",
              background: "#d62300",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              boxShadow:
                "0 8px 20px rgba(214,35,0,0.20)",
            }}
          >
            <Utensils
              size={30}
              strokeWidth={2.5}
            />
          </div>
        </div>

        {/* BRAND */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              color: "#d62300",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "2px",
              marginBottom: "6px",
            }}
          >
            FLOAT247
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              lineHeight: 1.1,
              fontWeight: 900,
              color: "#24120d",
            }}
          >
            Admin Login
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#806c61",
              fontSize: "13px",
            }}
          >
            Sign in to manage your restaurant
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>
              Email Address
            </label>

            <div style={inputWrapperStyle}>
              <Mail
                size={18}
                color="#806c61"
                strokeWidth={2}
              />

              <input
                type="email"
                placeholder="admin@float247.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
                style={innerInputStyle}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>
              Password
            </label>

            <div style={inputWrapperStyle}>
              <Lock
                size={18}
                color="#806c61"
                strokeWidth={2}
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="current-password"
                style={innerInputStyle}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#806c61",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                }}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div
              style={{
                marginBottom: "16px",
                padding: "11px 13px",
                borderRadius: "10px",
                background: "#fff0eb",
                border:
                  "1px solid rgba(214,35,0,0.15)",
                color: "#c32200",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {error}
            </div>
          )}

          {/* LOGIN */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "50px",
              border: "none",
              borderRadius: "12px",
              background: loading
                ? "#a94430"
                : "#d62300",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 900,
              cursor: loading
                ? "not-allowed"
                : "pointer",
              boxShadow:
                "0 8px 18px rgba(214,35,0,0.18)",
            }}
          >
            {loading
              ? "Signing in..."
              : "Login to Admin Panel"}
          </button>
        </form>

        {/* SECURITY */}
        <div
          style={{
            marginTop: "22px",
            paddingTop: "18px",
            borderTop:
              "1px solid rgba(59,36,24,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            color: "#907d71",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          <ShieldCheck size={14} />
          Authorized restaurant administrators only
        </div>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "7px",
  color: "#3b281f",
  fontSize: "12px",
  fontWeight: 800,
};

const inputWrapperStyle: React.CSSProperties = {
  width: "100%",
  height: "48px",
  display: "flex",
  alignItems: "center",
  gap: "9px",
  padding: "0 13px",
  boxSizing: "border-box",
  background: "#fffaf5",
  border:
    "1px solid rgba(59,36,24,0.10)",
  borderRadius: "11px",
};

const innerInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#24120d",
  fontSize: "14px",
};

export default AdminAuth;