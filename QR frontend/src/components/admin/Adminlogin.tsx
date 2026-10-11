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

          "linear-gradient(135deg, #F5F6FA 0%, #FFE7ED 50%, #FFD0DC 100%)",

        fontFamily: "Flame, 'Arial Rounded MT Bold', 'Trebuchet MS', Arial, sans-serif",

        color: "#1F1F1F",

      }}

    >

      <div

        style={{

          width: "100%",

          maxWidth: "430px",

          background: "#FFFFFF",

          border: "1px solid #E7E7EB",

          borderRadius: "28px",

          padding: "34px",

          boxSizing: "border-box",

          boxShadow:

            "0 24px 70px rgba(31,31,31,0.10), 0 8px 28px rgba(255,36,87,0.10)",

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

              background: "#FF2457",

              display: "grid",

              placeItems: "center",

              color: "#fff",

              boxShadow:

                "0 8px 20px rgba(255,36,87,0.20)",

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

              color: "#FF2457",

              fontSize: "12px",

              fontWeight: 900,

              letterSpacing: "2px",

              marginBottom: "6px",

            }}

          >

          </div>



          <h1

            style={{

              margin: 0,

              fontSize: "28px",

              lineHeight: 1.1,

              fontWeight: 900,

              color: "#1F1F1F",

            }}

          >

            Admin Login

          </h1>



          <p

            style={{

              margin: "8px 0 0",

              color: "#8A8A8A",

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

                color="#8A8A8A"

                strokeWidth={2}

              />



              <input

                type="email"

                placeholder="admin\@float247.com"

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

                color="#8A8A8A"

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

                  color: "#8A8A8A",

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

                background: "#FFF0F4",

                border:

                  "1px solid rgba(255,36,87,0.15)",

                color: "#E91E4D",

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

              height: "52px",

              border: "none",

              borderRadius: "12px",

              background: loading

                ? "#E91E4D"

                : "#FF2457",

              color: "#fff",

              fontSize: "14px",

              fontWeight: 900,

              cursor: loading

                ? "not-allowed"

                : "pointer",

              boxShadow:

                "0 8px 18px rgba(255,36,87,0.18)",

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

              "1px solid #E7E7EB",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            gap: "6px",

            color: "#8A8A8A",

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

  color: "#1F1F1F",

  fontSize: "12px",

  fontWeight: 800,

};



const inputWrapperStyle: React.CSSProperties = {

  width: "100%",

  height: "52px",

  display: "flex",

  alignItems: "center",

  gap: "9px",

  padding: "0 13px",

  boxSizing: "border-box",

  background: "#FAFBFD",

  border:

    "1px solid #E7E7EB",

  borderRadius: "14px",

};



const innerInputStyle: React.CSSProperties = {

  flex: 1,

  minWidth: 0,

  border: "none",

  outline: "none",

  background: "transparent",

  color: "#1F1F1F",

  fontSize: "14px",

};



export default AdminAuth;