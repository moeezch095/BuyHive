
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import API from "../api/api";

// const ProductCard = ({ product, index }) => {
//   const navigate = useNavigate();

//   const productImages = [
//     "https://kimi-web-img.moonshot.cn/img/www.shutterstock.com/c27efba93441ff2ae9b443c19ea2e2176a4e7831.jpg",
//     "https://kimi-web-img.moonshot.cn/img/t3.ftcdn.net/203b923f977b36dc217c836c0ff1545968916bf4.jpg",
//     "https://kimi-web-img.moonshot.cn/img/cdn.prod.website-files.com/8be438cc778fa0991220534b08d164f45cfc188b.webp",
//     "https://kimi-web-img.moonshot.cn/img/img.freepik.com/df83de19388c415930e05b718f6f1d5f0b3fc6c0.jpg",
//     "https://kimi-web-img.moonshot.cn/img/c8.alamy.com/59e9fdd8627cb4a61cecf395dab51b53d3172b9e.jpg",
//   ];

//   const getProductImage = () => {
//     if (product.picture && product.picture !== "buyhive1.png" && product.picture !== "default.jpg") {
//       return `http://localhost:5000/uploads/${product.picture}`;
//     }
//     const safeIndex = index !== undefined ? index : (product.id ? parseInt(product.id) : 0);
//     return productImages[Math.abs(safeIndex) % productImages.length];
//   };

//   // 🟢 Card click → product detail page par jao
//   const handleCardClick = () => {
//     navigate(`/product/${product.id}`);
//   };

//   return (
//     <Card
//       onClick={handleCardClick}
//       sx={{
//         borderRadius: "12px",
//         boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
//         transition: "transform 0.2s, box-shadow 0.2s",
//         cursor: "pointer",
//         "&:hover": {
//           transform: "translateY(-4px)",
//           boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
//         },
//       }}
//     >
//       <Box
//         sx={{
//           height: "280px",
//           backgroundColor: "#f8fafc",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           overflow: "hidden",
//           borderTopLeftRadius: "12px",
//           borderTopRightRadius: "12px",
//         }}
//       >
//         <Box
//           component="img"
//           src={getProductImage()}
//           alt={product.name}
//           sx={{ width: "100%", height: "100%", objectFit: "cover" }}
//         />
//       </Box>

//       <CardContent sx={{ p: 1.5, pt: 1 }}>
//         <Typography
//           variant="body1"
//           fontWeight={600}
//           fontSize="14px"
//           color="#1f2937"
//           sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
//           title={product.name}
//         >
//           {product.name}
//         </Typography>
//         <Typography variant="h6" color="#0d9488" fontWeight={700} fontSize="16px" mt={0.5}>
//           ${product.price?.toFixed(2)}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

const TrendingProducts = () => {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const res  = await fetch(API.allProducts(page, LIMIT));
        const json = await res.json();
        setProducts(json?.data?.data || []);
        setTotalPages(json?.data?.pagination?.totalPages || 1);
      } catch (err) {
        setError("Products load nahi ho sakay. Server check karo.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ px: 5, py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="#0d9488" sx={{ mb: 0.5 }}>
          Trending Products
        </Typography>
        <Typography variant="body2" fontWeight={600} color="#0d9488">
          Explore our most popular sourcing products
        </Typography>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress sx={{ color: "#0d9488" }} />
        </Box>
      )}

      {!loading && error && (
        <Box textAlign="center" py={6}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {!loading && !error && (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: 3,
            }}
          >
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </Box>

          <Box display="flex" justifyContent="center" mt={10}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              shape="rounded"
              sx={{
                mb: 3,
                "& .MuiPaginationItem-root": { color: "#0d9488" },
                "& .MuiPaginationItem-root.Mui-selected": { backgroundColor: "#0d9488", color: "white" },
              }}
            />
          </Box>

          <Typography textAlign="center" color="#9ca3af" fontSize="13px" mt={1}>
            Page {page} of {totalPages}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default TrendingProducts;