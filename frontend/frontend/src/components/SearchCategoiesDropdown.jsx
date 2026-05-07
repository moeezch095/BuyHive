

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import { toSlug } from "../utils/slug";
import API from "../api/api";

const SearchBarr = () => {
  const [mainOpen, setMainOpen] = useState(false);
  const [allOpen, setAllOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (mainOpen || allOpen) {
      setLoading(true);
      fetch(API.categories)
        .then((res) => res.json())
        .then((data) => {
          setCategories(data.data || []);
          localStorage.setItem("categories", JSON.stringify(data.data));
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching categories:", err);
          setLoading(false);
        });
    }
  }, [mainOpen, allOpen]);


  const toggleMain = () => {
    setMainOpen((prev) => !prev);
    setAllOpen(false);
  };

  const toggleAll = () => {
    setAllOpen((prev) => !prev);
    setMainOpen(false);
  };


  const handleMainCategoryClick = (category) => {
    setMainOpen(false);
    setAllOpen(false);

    navigate(`/buy/${toSlug(category.name)}`, {
      state: {
        id: category.id,
        name: category.name,
        type: "main",
        sub_categories: category.sub_categories || [],
        fullCategory: category
      }
    });
  };


  const handleSubCategoryClick = (sub, parentCategory) => {
    setMainOpen(false);
    setAllOpen(false);

    navigate(`/buy/${toSlug(sub.name)}`, {
      state: {
        id: sub.id,
        name: sub.name,
        type: "sub",
        parentCategory: {
          id: parentCategory.id,
          name: parentCategory.name,
          sub_categories: parentCategory.sub_categories || []
        },
        subCategories: sub.children || [],
        fullCategory: parentCategory
      }
    });
  };


  const handleChildCategoryClick = (child, sub, parentCategory) => {
    setMainOpen(false);
    setAllOpen(false);

    navigate(`/buy/${toSlug(child.name)}`, {
      state: {
        id: child.id,
        name: child.name,
        type: "child",
        parentCategory: {
          id: parentCategory.id,
          name: parentCategory.name,
          sub_categories: parentCategory.sub_categories || []
        },
        subCategory: {
          id: sub.id,
          name: sub.name,
          children: sub.children || []
        },
        fullCategory: parentCategory
      }
    });
  };

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      
      <Box
        sx={{ 
          maxWidth: "100%",
          backgroundColor: "#f3f4f6",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 2,
          margin:5,
          marginTop: "90px", 
        }}
      >
        

        <Box
          onClick={toggleMain}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pr: 3,
            cursor: "pointer",
            px: 1.5,
            py: 1,
            borderRadius: "8px",
            transition: "all 0.2s ease",
            backgroundColor: mainOpen ? "#e6fffa" : "transparent",
            "&:hover": { backgroundColor: "#e6fffa" },
          }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px", width: 20, height: 20 }}>
            {[...Array(4)].map((_, i) => (
              <Box key={i} sx={{ backgroundColor: "#0d9488", borderRadius: "3px" }} />
            ))}
          </Box>
          <Typography fontSize="14px" fontWeight={600}>Categories</Typography>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />

        <Box sx={{ position: "relative", flex: 1 }}>
          <TextField
            variant="outlined"
            placeholder="What are you looking for ?"
            fullWidth
            sx={{
              fontSize:"10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "white",
                "& fieldset": { border: "none" },
                pr: "160px",
              },
              "& input": { fontSize: "16px", px: 2 },
            }}
          />


          <Box
            onClick={toggleAll}
            sx={{
              position: "absolute",
              right: 15,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              "&:hover": { backgroundColor: "#f3f4f6" },
              zIndex: 10,
            }}
          >
            <Typography
              sx={{
                fontSize: "17px",
                color: "#9ca3af",
                whiteSpace: "nowrap",
                fontWeight: 400,
              }}
            >
              {selectedCategory}
            </Typography>

            <KeyboardArrowDownIcon 
              sx={{ 
                fontSize: 27, 
                color: "#9ca3af", 
                transition: "0.3s", 
                transform: allOpen ? "rotate(180deg)" : "rotate(0deg)" 
              }} 
            />

      
            {allOpen && (
              <div className="simple-categories-dropdown">
                {loading ? (
                  <p style={{ padding: "10px", fontSize: "14px", color: "#666" }}>Loading...</p>
                ) : (
                  <div className="simple-list">
                    <div 
                      className="simple-category-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory("All Categories");
                        setAllOpen(false);
                      }}
                    >
                      All Categories
                    </div>

                    {categories.map((category) => (
                      <div 
                        key={category.id} 
                        className="simple-category-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(category.name);
                          setAllOpen(false);
                          handleMainCategoryClick(category);
                        }}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 2  }} />

        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          sx={{
            backgroundColor: "#0d9488",
            borderRadius: "30px",
            textTransform: "none",
            fontSize: "14px",
            px: 4,
            py: 1,
            boxShadow: "none",
            "&:hover": { backgroundColor: "#0f766e" },
          }}
        >
          Search
        </Button>
      </Box>

      {mainOpen && (
        <div className="categories-dropdown">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <div key={category.id} className="category-column">
                  <h4
                    className="category-title"
                    onClick={() => handleMainCategoryClick(category)}
                  >
                    {category.name}
                  </h4>
                  
                  <ul className="subcategory-list">
                    {category.sub_categories?.map((sub) => (
                      <li key={sub.id} className="subcategory-item">
                        <div
                          onClick={() => handleSubCategoryClick(sub, category)}
                          style={{ cursor: "pointer" }}
                        >
                          {sub.name}
                        </div>

                        {/* {sub.children && sub.children.length > 0 && (
                          <ul style={{ marginLeft: "10px", marginTop: "5px" }}>
                            {sub.children.map((child) => (
                              <li
                                key={child.id}
                                className="child-category-item"
                                onClick={() => handleChildCategoryClick(child, sub, category)}
                              >
                                {child.name}
                              </li>
                            ))}
                          </ul>
                        )} */}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .categories-dropdown {
          position: absolute;
          top: 100px;
          left: 20px;
          width: 90%;
          background: #ffffff;
          padding: 20px 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          border-radius: 9px;
          z-index: 1000;
        }

        .simple-categories-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 1100;
          background-color: white;
          min-width: 200px; 
          max-width: 250px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          margin-top: 5px;
          overflow: hidden;
        }

        .simple-list {
          display: flex;
          flex-direction: column;
          max-height: 300px;
          overflow-y: auto;
        }

        .simple-category-item {
          padding: 10px 15px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
          text-align: left;
          font-family: Arial, sans-serif;
        }

        .simple-category-item:hover {
          background-color: #f3f4f6;
          color: #0d9488;
        }

        .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(146px, 1fr)); gap: 10px; }
        .category-title { font-weight: 700; margin-bottom: 10px; color: #1f2938; font-size: 17px; cursor: pointer; }
        .subcategory-list { padding: 0; margin: 0; }
        .subcategory-item { list-style: none; margin-bottom: 6px; color: #4b5564; font-size: 14px; }
        .subcategory-item > div:hover, .category-title:hover { color: #0d9488; }
        
        .child-category-item {
          list-style: none;
          font-size: 13px;
          color: #6b7280;
          cursor: pointer;
          padding: 2px 0;
          transition: color 0.2s;
        }
        .child-category-item:hover {
          color: #0d9488;
        }
      `}</style>

    </Box>
  );
};

export default SearchBarr;


















