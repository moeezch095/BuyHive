

import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import buyhive from "../assets/buyhive1.png";
import Navbar from "../components/Navbar";
import API from "../api/api";


const hasInvalidSpaces = (str) => /^\s|\s$|\s{3,}/.test(str);
const isValidAlphanumeric = (str) => /^[a-zA-Z0-9]+(?:\s{1,2}[a-zA-Z0-9]+)*$/.test(str);


const StyledField = ({ label, children, error, ...props }) => (
  <div style={{ width: "50%" }}>
    <p>{label}</p>
    <TextField
      fullWidth
      error={!!error}
      helperText={error}
      style={{ backgroundColor: "#f8f4ee", borderRadius: "10px" }}
      {...props}
    >  {children}  </TextField>
  </div>
);


const PasswordField = ({ label, value, onChange, error, disabled, show, onToggle }) => (
  <StyledField
    label={label}
    type={show ? "text" : "password"}
    value={value}
    onChange={onChange}
    error={error}
    disabled={disabled}
  
    slotProps={{
      input: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={onToggle} edge="end" disabled={disabled}>
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      },
    }}
  />
);


const RegisterBuyer = () => {
  const navigate = useNavigate();

 
  const [form, setForm] = useState({
    first_name: "", last_name: "", company_name: "",
    country: "", email: "", phone_number: "",
    password: "", confirm_password: "", agree: false,
  });

  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState({ type: "", text: "" });

  const [showPwd, setShowPwd] = useState({ password: false, confirm: false });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const err = {};

   
    [
      ["first_name",   "First name"],
      ["last_name",    "Last name"],
      ["company_name", "Company name"],
    ].forEach(([field, label]) => {
      const val = form[field];
      if (!val.trim())                 err[field] = "Required";
      else if (hasInvalidSpaces(val))  err[field] = "No leading/trailing or 3+ consecutive spaces";
      else if (!isValidAlphanumeric(val)) err[field] = "Only alphanumeric characters allowed";
    });

    if (!form.country) err.country = "Select country";

    if (!form.email.match(/\S+@\S+\.\S+/))   err.email = "Invalid email";
    else if (hasInvalidSpaces(form.email))    err.email = "Email cannot contain spaces";

    if (!form.phone_number.trim())                           err.phone_number = "Required";
    else if (hasInvalidSpaces(form.phone_number))            err.phone_number = "No leading/trailing or 3+ consecutive spaces";
    else if (!/^[0-9+\-\s()]+$/.test(form.phone_number))    err.phone_number = "Only numbers, +, -, (), spaces allowed";

    if (form.password.length < 6)        err.password = "Min 6 characters";
    else if (/\s{3,}/.test(form.password)) err.password = "Max 2 consecutive spaces allowed";

    if (form.password !== form.confirm_password) err.confirm_password = "Passwords do not match";

    if (!form.agree) err.agree = "Must agree to terms";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const payload = {
        first_name:   form.first_name.trim(),
        last_name:    form.last_name.trim(),
        company_name: form.company_name.trim(),
        country:      form.country,
        email:        form.email.trim(),
        phone_number: form.phone_number.trim(),
        password:     form.password,
      };

      const res  = await fetch(API.register, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      setMsg({ type: "success", text: data.message });
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Navbar />

      {msg.text && (
        <Alert severity={msg.type} style={{ maxWidth: "600px", margin: "20px auto" }}>
          {msg.text}
        </Alert>
      )}

      <div style={{ width: "100%" }}>

       
        <div style={{ width: "100%", textAlign: "center", padding: "70px 0 10px", background: "#f3f4f6" }}>
          <h1 style={{ fontWeight: "bold", color: "#2c2c6c", fontSize: "50px" }}>
            Register as a Buyer
          </h1>
          <h2 style={{ color: "#14b8a6", fontSize: "30px" }}>
            You are registering as a Buyer so you can use BuyHive's sourcing services!
          </h2>
        </div>

       
        <div style={{ width: "100%", display: "flex" }}>

        
          <div style={{ width: "50%", background: "#f3f4f6", display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 0" }}>
            <img src={buyhive} alt="buyer" style={{ width: "620px", maxWidth: "100%" }} />
          </div>

         
          <div style={{ width: "50%", background: "#cfe3e8", padding: "40px 0", display: "flex", justifyContent: "center", borderRadius: "10px", marginRight: "5px" }}>
            <form onSubmit={handleSubmit} style={{ width: "80%", paddingLeft: "25px" }}>

             
              <div style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
                <StyledField label="First Name *"  placeholder="e.g. John"
                  value={form.first_name}  error={errors.first_name}  disabled={loading}
                  onChange={(e) => handleChange("first_name",  e.target.value)} />
                <StyledField label="Last Name *"   placeholder="e.g. Doe"
                  value={form.last_name}   error={errors.last_name}   disabled={loading}
                  onChange={(e) => handleChange("last_name",   e.target.value)} />
              </div>

              
              <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <StyledField label="Company Name *" placeholder="e.g. BuyHive Ltd."
                  value={form.company_name} error={errors.company_name} disabled={loading}
                  onChange={(e) => handleChange("company_name", e.target.value)} />

                <StyledField label="Country/Region *" select
                  value={form.country} error={errors.country} disabled={loading}
                  onChange={(e) => handleChange("country", e.target.value)}>
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Pakistan">Pakistan</MenuItem>
                  <MenuItem value="UK">UK</MenuItem>
                  <MenuItem value="USA">USA</MenuItem>
                </StyledField>
              </div>

              
              <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <StyledField label="Email *" placeholder="e.g. john@website.com"
                  value={form.email} error={errors.email} disabled={loading}
                  onChange={(e) => handleChange("email", e.target.value)} />
                <StyledField label="Phone Number *" placeholder="e.g. +92 300 1234567"
                  value={form.phone_number} error={errors.phone_number} disabled={loading}
                  onChange={(e) => handleChange("phone_number", e.target.value)} />
              </div>

             
              <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <PasswordField
                  label="Password *"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  error={errors.password}
                  disabled={loading}
                  show={showPwd.password}
                  onToggle={() => setShowPwd(p => ({ ...p, password: !p.password }))}
                />
                <PasswordField
                  label="Confirm Password *"
                  value={form.confirm_password}
                  onChange={(e) => handleChange("confirm_password", e.target.value)}
                  error={errors.confirm_password}
                  disabled={loading}
                  show={showPwd.confirm}
                  onToggle={() => setShowPwd(p => ({ ...p, confirm: !p.confirm }))}
                />
              </div>

              
              <div style={{ marginBottom: "20px" }}>
                <FormControlLabel
                  control={
                    <Checkbox checked={form.agree} disabled={loading}
                      onChange={(e) => handleChange("agree", e.target.checked)} />
                  }
                  label={
                    <span>
                      I agree to{" "}
                      <span style={{ color: "#14b8a6" }}>Terms of Service</span> and{" "}
                      <span style={{ color: "#14b8a6" }}>Privacy Policy</span>
                    </span>
                  }
                />
                {errors.agree && <p style={{ color: "red", fontSize: "12px" }}>{errors.agree}</p>}
              </div>

             
              <Button type="submit" variant="contained" fullWidth disabled={loading}
                style={{ backgroundColor: loading ? "#999" : "#2c2c6c", padding: "12px 0" }}>
                {loading ? <CircularProgress size={20} /> : "REGISTER"}
              </Button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterBuyer;