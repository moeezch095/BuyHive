

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Divider,
  Button,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import Navbar from "../components/Navbar";
import SearchBarr from "../components/SearchCategoiesDropdown";
import API from "../api/api";

const productImages = [
  "https://kimi-web-img.moonshot.cn/img/www.shutterstock.com/c27efba93441ff2ae9b443c19ea2e2176a4e7831.jpg",
  "https://kimi-web-img.moonshot.cn/img/t3.ftcdn.net/203b923f977b36dc217c836c0ff1545968916bf4.jpg",
  "https://kimi-web-img.moonshot.cn/img/cdn.prod.website-files.com/8be438cc778fa0991220534b08d164f45cfc188b.webp",
  "https://kimi-web-img.moonshot.cn/img/img.freepik.com/df83de19388c415930e05b718f6f1d5f0b3fc6c0.jpg",
  "https://kimi-web-img.moonshot.cn/img/c8.alamy.com/59e9fdd8627cb4a61cecf395dab51b53d3172b9e.jpg",
];

const getImage = (picture, id) => {
  if (picture && picture !== "default.jpg" && picture !== "buyhive1.png") {
    return `${API.uploads}/uploads/${picture}`;
  }
  return productImages[Math.abs(parseInt(id) || 0) % productImages.length];
};


const InfoRow = ({ label, value, valueColor }) => (
  <div
    style={{
      display: "flex",       
      flexDirection: "row",
      alignItems: "center",
      gap: "8px",
      marginBottom: "12px",
    }}
  >
    <span
      style={{
        fontSize: "14px",
        color: "#6b7280",
        fontWeight: 500,
        minWidth: "145px",
        flexShrink: 0,        
      }}
    >
      {label}:
    </span>
    <span
      style={{
        fontSize: "14px",
        fontWeight: 600,
        color: valueColor || "#1f2937",
      }}
    >
      {value || "—"}
    </span>
  </div>
);


const ProductDetailPage = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res  = await fetch(API.productById(id));
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Product nahi mila");
        setProduct(json.data);
      } catch (err) {
        setError(err.message || "Kuch masla aa gaya");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <div>
      <Navbar />
      <SearchBarr />

      <Box sx={{ px: { xs: 3, md: 6 }, pb: 6, maxWidth: "1300px", margin: "0 auto" }}>

       
        {loading && (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress sx={{ color: "#0d9488" }} />
          </Box>
        )}

      
        {!loading && error && (
          <Box textAlign="center" py={10}>
            <Typography color="error" fontSize="18px" mb={2}>{error}</Typography>
            <Button
              onClick={() => navigate(-1)}
              variant="outlined"
              sx={{ borderColor: "#0d9488", color: "#0d9488", borderRadius: "999px", textTransform: "none" }}
            >
              ← Wapas jao
            </Button>
          </Box>
        )}

        
        {!loading && !error && product && (
          <>
           
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "#f0fdfa",
                border: "1px solid #99f6e4",
                borderRadius: "999px",
                px: 2.5,
                py: 0.8,
                mb: 3,
                flexWrap: "nowrap",
              }}
            >
              <Typography
                fontSize="13px" fontWeight={600} color="#0d9488"
                sx={{ cursor: "pointer", whiteSpace: "nowrap", "&:hover": { textDecoration: "underline" } }}
                onClick={() => navigate("/buy")}
              >
                Buy
              </Typography>
              <Typography fontSize="14px" color="#0d9488" fontWeight={700}>›</Typography>
              <Typography fontSize="13px" fontWeight={600} color="#0d9488" sx={{ whiteSpace: "nowrap" }}>
                {product.sub_category?.name || "Category"}
              </Typography>
              <Typography fontSize="14px" color="#0d9488" fontWeight={700}>›</Typography>
              <Typography
                fontSize="13px" fontWeight={600} color="#374151"
                sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "250px" }}
              >
                {product.name}
              </Typography>
            </Box>

            
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 5,
                alignItems: "flex-start",
              }}
            >
            
              <Box
                sx={{
                  width: { xs: "100%", md: "420px" },
                  flexShrink: 0,
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#f8fafc",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <Box
                  component="img"
                  src={getImage(product.picture, product.id)}
                  alt={product.name}
                  sx={{ width: "100%", height: "400px", objectFit: "cover", display: "block" }}
                />
              </Box>

             
              <Box flex={1} sx={{ minWidth: 0 }}>

               
                <Typography component="h1" sx={{ fontWeight: 700, fontSize: "28px", color: "#1f2937", mb: 0.5, lineHeight: 1.3 }}>
                  {product.name}
                </Typography>
                <Typography sx={{ fontSize: "14px", color: "#9ca3af", fontWeight: 600, mb: 2.5 }}>
                  Model No. {product.model_no}
                </Typography>

                <Divider sx={{ mb: 2.5 }} />

                
                <InfoRow label="Brand"          value={product.brand}              valueColor="#0d9488" />
                <InfoRow label="Sold By"        value={product.sold_by}            valueColor="#0d9488" />
                <InfoRow label="Source Country" value={product.source_country} />
                <InfoRow label="Category"       value={product.sub_category?.name} />

               
                <div
                  style={{
                    display: "flex",     
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      fontWeight: 500,
                      minWidth: "145px",
                      flexShrink: 0,
                    }}
                  >
                    Certifications:
                  </span>
                  {product.certifications
                    ? product.certifications.split(",").map((cert) => (
                        <Chip
                          key={cert}
                          label={cert.trim()}
                          size="small"
                          sx={{
                            backgroundColor: "#f0fdfa",
                            color: "#0d9488",
                            border: "1px solid #99f6e4",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        />
                      ))
                    : <span style={{ fontSize: "14px" }}>—</span>
                  }
                </div>

                <Divider sx={{ mb: 2.5 }} />

                
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1.5 }}>
                  <Typography sx={{ fontSize: "36px", fontWeight: 800, color: "#0d9488" }}>
                    ${product.price?.toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: "16px", color: "#9ca3af", fontWeight: 500 }}>
                    / Piece
                  </Typography>
                </Box>

                
                <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3, flexWrap: "wrap" }}>
                  {product.sold_by === "Verified Supplier" && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <VerifiedIcon sx={{ color: "#0d9488", fontSize: 18 }} />
                      <Typography sx={{ fontSize: "14px", color: "#0d9488", fontWeight: 600 }}>
                        Verified Supplier
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocationOnIcon sx={{ color: "#9ca3af", fontSize: 16 }} />
                    <Typography sx={{ fontSize: "14px", color: "#6b7280" }}>
                      {product.source_country}
                    </Typography>
                  </Box>
                </Box>

                
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{
                      borderColor: "#0d9488",
                      color: "#0d9488",
                      borderRadius: "999px",
                      textTransform: "none",
                      px: 4, py: 1.4,
                      fontWeight: 600,
                      fontSize: "15px",
                      "&:hover": { backgroundColor: "#f0fdfa" },
                    }}
                  >
                    ← Back
                  </Button>
                </Box>

              </Box>
            </Box>
          </>
        )}
      </Box>
    </div>
  );
};

export default ProductDetailPage;