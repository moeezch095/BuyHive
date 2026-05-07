import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toSlug } from "../utils/slug";
import Api from "../api/api";

const CategorySidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentCategory, setCurrentCategory] = useState(null);
  const [activeSubId, setActiveSubId] = useState(null);
  const [activeChildId, setActiveChildId] = useState(null);
  const [expandedSubs, setExpandedSubs] = useState({});
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      let cats = [];
      const saved = localStorage.getItem("categories");

      if (saved) {
        try {
          cats = JSON.parse(saved);
          setAllCategories(cats);
        } catch (err) {
          console.error("Error parsing localStorage:", err);
        }
      }

      if (cats.length === 0) {
        try {
          const res = await fetch(API.categories);
          const data = await res.json();
          cats = data.data || [];
          setAllCategories(cats);
          localStorage.setItem("categories", JSON.stringify(cats));
        } catch (err) {
          console.error("Error fetching categories:", err);
        }
      }

      setLoading(false);
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (allCategories.length === 0) return;

    const state = location.state;

    if (state?.fullCategory) {
      setCurrentCategory(state.fullCategory);

      if (state.type === "sub" && state.id) {
        setActiveSubId(state.id);
        setExpandedSubs({ [state.id]: true });
        setActiveChildId(null);
      } else if (state.type === "child" && state.subCategory) {
        setActiveSubId(state.subCategory.id);
        setActiveChildId(state.id);
        setExpandedSubs({ [state.subCategory.id]: true });
      } else {
        setActiveSubId(null);
        setActiveChildId(null);
        setExpandedSubs({});
      }
      return;
    }

    const path = location.pathname;
    const parts = path.split("/").filter(Boolean);

    if (parts.length >= 2) {
      const urlSlug = parts[1];

      for (const cat of allCategories) {
        if (toSlug(cat.name) === urlSlug) {
          setCurrentCategory(cat);
          return;
        }

        if (cat.sub_categories) {
          for (const sub of cat.sub_categories) {
            if (toSlug(sub.name) === urlSlug) {
              setCurrentCategory(cat);
              setActiveSubId(sub.id);
              setExpandedSubs({ [sub.id]: true });
              return;
            }

            if (sub.children) {
              for (const child of sub.children) {
                if (toSlug(child.name) === urlSlug) {
                  setCurrentCategory(cat);
                  setActiveSubId(sub.id);
                  setActiveChildId(child.id);
                  setExpandedSubs({ [sub.id]: true });
                  return;
                }
              }
            }
          }
        }
      }
    }
  }, [allCategories, location.pathname]);

  const toggleSub = (subId) => {
    setExpandedSubs((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  const handleSubClick = (sub) => {
    if (!currentCategory) return;

    setActiveSubId(sub.id);
    setActiveChildId(null);

    if (sub.children && sub.children.length > 0) {
      toggleSub(sub.id);
    } else {
      navigate(`/buy/${toSlug(currentCategory.name)}/${toSlug(sub.name)}`, {
        state: {
          id: sub.id,
          name: sub.name,
          type: "sub",
          subCategoryId: sub.id,
          subCategoryName: sub.name,
          parentCategory: {
            id: currentCategory.id,
            name: currentCategory.name,
            sub_categories: currentCategory.sub_categories || [],
          },
          fullCategory: currentCategory,
        },
      });
    }
  };

  const handleChildClick = (child, parentSub) => {
    if (!currentCategory) return;

    setActiveChildId(child.id);

    navigate(
      `/buy/${toSlug(currentCategory.name)}/${toSlug(parentSub.name)}/${toSlug(child.name)}`,
      {
        state: {
          id: child.id,
          name: child.name,
          type: "child",
          subCategoryId: parentSub.id,
          subCategoryName: parentSub.name,
          parentCategory: {
            id: currentCategory.id,
            name: currentCategory.name,
            sub_categories: currentCategory.sub_categories || [],
          },
          subCategory: {
            id: parentSub.id,
            name: parentSub.name,
            children: parentSub.children || [],
          },
          fullCategory: currentCategory,
        },
      },
    );
  };

  const handleMainClick = () => {
    if (!currentCategory) return;

    navigate(`/buy/${toSlug(currentCategory.name)}`, {
      state: {
        id: currentCategory.id,
        name: currentCategory.name,
        type: "main",
        sub_categories: currentCategory.sub_categories || [],
        fullCategory: currentCategory,
      },
    });
  };

  if (loading) {
    return (
      <div className="category-sidebar">
        <div style={{ padding: "30px", textAlign: "center", color: "#9ca3af" }}>
          <div className="spinner-small"></div>
          <p style={{ marginTop: "10px", fontSize: "13px" }}>Loading...</p>
        </div>
        <style>{`
          .spinner-small {
            width: 24px; height: 24px;
            border: 2px solid #e5e7eb;
            border-top-color: #0d9488;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="category-sidebar">
        <div className="sidebar-search">
          <input
            type="text"
            placeholder="More Categories"
            className="sidebar-input"
          />
          <span className="search-icon"></span>
        </div>
        <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
          <p style={{ marginBottom: "10px" }}>Select a category</p>
          <button
            onClick={() => navigate("/buy")}
            style={{
              padding: "8px 16px",
              background: "#0d9488",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Browse All Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="category-sidebar">
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="More Categories"
          className="sidebar-input"
        />
        <span className="search-icon"></span>
      </div>

      <div className="category-tree">
        <div className="tree-item parent" onClick={handleMainClick}>
          <span className="tree-label">{currentCategory.name}</span>
        </div>

        <div className="tree-children">
          {currentCategory.sub_categories?.map((sub) => (
            <div key={sub.id} className="tree-branch">
              <div
                className={`tree-item sub ${activeSubId === sub.id ? "active" : ""} ${expandedSubs[sub.id] ? "expanded" : ""}`}
                onClick={() => handleSubClick(sub)}
              >
                {sub.children && sub.children.length > 0 && (
                  <span
                    className={`arrow ${expandedSubs[sub.id] ? "open" : ""}`}
                  >
                    ▸
                  </span>
                )}
                <span className="tree-label">{sub.name}</span>
              </div>

              {sub.children &&
                sub.children.length > 0 &&
                expandedSubs[sub.id] && (
                  <div className="tree-grandchildren">
                    {sub.children.map((child) => (
                      <div
                        key={child.id}
                        className={`tree-item child ${activeChildId === child.id ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChildClick(child, sub);
                        }}
                      >
                        <span className="tree-label">{child.name}</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .category-sidebar {
          width: 100%;
          min-width: 240px;
          max-width: 280px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .sidebar-search {
          position: relative;
          margin-bottom: 16px;
        }
        .sidebar-input {
          width: 100%;
          padding: 10px 35px 10px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          font-size: 13px;
          color: #374151;
          background: #f9fafb;
          outline: none;
          transition: all 0.2s;
        }
        .sidebar-input:focus {
          border-color: #0d9488;
          background: white;
        }
        .sidebar-input::placeholder {
          color: #9ca3af;
        }
        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          opacity: 0.4;
          pointer-events: none;
        }
        .category-tree {
          margin-top: 4px;
        }
        .tree-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-size: 13px;
          color: #4b5564;
          line-height: 1.4;
        }
        .tree-item:hover {
          background-color: #f0fdfa;
          color: #0d9488;
        }
        .tree-item.active {
          background-color: #e6fffa;
          color: #0d9488;
          font-weight: 600;
        }
        .tree-item.parent {
          font-weight: 700;
          font-size: 14px;
          color: #1f2938;
          padding: 10px 12px;
          margin-bottom: 4px;
          background: #f3f4f6;
          border-radius: 8px;
        }
        .tree-item.parent:hover {
          background: #e5e7eb;
          color: #1f2938;
        }
        .arrow {
          font-size: 10px;
          color: #9ca3af;
          transition: transform 0.2s;
          display: inline-block;
          width: 14px;
          text-align: center;
        }
        .arrow.open {
          transform: rotate(90deg);
          color: #0d9488;
        }
        .tree-children {
          padding-left: 4px;
        }
        .tree-branch {
          margin-bottom: 2px;
        }
        .tree-item.sub {
          padding-left: 12px;
          position: relative;
        }
        .tree-item.sub::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e5e7eb;
          border-radius: 1px;
        }
        .tree-item.sub:hover::before {
          background: #0d9488;
        }
        .tree-item.sub.active::before {
          background: #0d9488;
        }
        .tree-grandchildren {
          padding-left: 20px;
          margin-top: 2px;
          animation: slideDown 0.2s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tree-item.child {
          padding: 6px 10px;
          font-size: 12px;
          color: #6b7280;
          border-radius: 4px;
        }
        .tree-item.child:hover {
          color: #0d9488;
          background: #f0fdfa;
        }
        .tree-item.child.active {
          color: #0d9488;
          font-weight: 600;
          background: #f0fdfa;
        }
        .tree-item.child::before {
          content: '└';
          color: #d1d5db;
          margin-right: 6px;
          font-size: 11px;
        }
        .tree-label {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default CategorySidebar;
