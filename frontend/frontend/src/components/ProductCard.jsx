
import React from "react";
import { useNavigate } from "react-router-dom";
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
    return `${API.uploads}/${picture}`;
  }
  return productImages[Math.abs(parseInt(id) || 0) % productImages.length];
};


const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();

  const imgSrc = getImage(
    product.picture,
    index !== undefined ? index : product.id
  );

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        cursor: "pointer",
        background: "white",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",                             
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        transition: "transform 0.18s, box-shadow 0.18s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.13)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
      }}
      >

      <div
        style={{
          height: "180px",         
          overflow: "hidden",       
          backgroundColor: "#f8fafc",
        }}
      >
        <img
          src={imgSrc}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",     
            display: "block",
          }}
        />
      </div>

      
      <div style={{ padding: "12px" }}>

        
        <p
          title={product.name}
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#1f2937",
            margin: "0 0 4px 0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </p>

       
        <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 4px 0" }}>
          MOQ: {product.moq || "—"} Units
        </p>

        
        <p style={{ fontSize: "15px", fontWeight: 700, color: "#0d9488", margin: 0 }}>
          ${product.price?.toFixed(2)} / Unit
        </p>

      </div>
    </div>
  );
};

export default ProductCard;