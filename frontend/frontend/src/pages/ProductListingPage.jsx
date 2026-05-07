
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import CategorySidebar from "../components/CategorySidebar";
import FilterPanel from "../components/FilterPanel";
import ProductGrid from "../components/ProductGrid";
import Navbar from "../components/Navbar";
import SearchBarr from "../components/SearchCategoiesDropdown";
import API from "../api/api";

const ProductListingPage = () => {
  const { categorySlug, subCategorySlug } = useParams();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const stateData = location.state || {};

  const categoryId = stateData.id;
  const subCategoryId = stateData.subCategoryId;

  const isChildCategory = stateData.type === "child";
  const effectiveSubCategoryId = isChildCategory ? stateData.id : subCategoryId;

  const categoryName = stateData.name || categorySlug?.replace(/-/g, ' ') || 'Products';
  const subCategoryName = stateData.subCategoryName || subCategorySlug?.replace(/-/g, ' ') || '';


  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (effectiveSubCategoryId) {
        params.append('sub_category_id', effectiveSubCategoryId);
      } else if (categoryId) {
        params.append('category_id', categoryId);
      }

      
      if (activeFilters.price) {
        const priceMin = activeFilters.price.min;
        const priceMax = activeFilters.price.max;

        const numMin = priceMin !== undefined && priceMin !== null ? Number(priceMin) : null;
        const numMax = priceMax !== undefined && priceMax !== null ? Number(priceMax) : null;

        if (numMin !== null && !isNaN(numMin) && numMin >= 0) {
          params.append('price_min', numMin);
        }
        if (numMax !== null && !isNaN(numMax) && numMax >= 0) {
          params.append('price_max', numMax);
        }
      }

     
      if (activeFilters.moq !== undefined && activeFilters.moq !== null) {
        const moqNum = Number(activeFilters.moq);
        if (!isNaN(moqNum) && moqNum > 0) {
          params.append('moq', moqNum);
        }
      }

      if (activeFilters.certification?.length > 0) {
        params.append('certifications', activeFilters.certification.join(','));
      }

  
      if (activeFilters.location?.length > 0) {
        params.append('country', activeFilters.location.join(','));
      }

      params.append('page', page);
      params.append('limit', 20);

      const url = API.originalFilters(params);

      console.log(" Fetching URL:", url);
      console.log(" Current Page:", page);

      const res = await fetch(url);
      const response = await res.json();

      console.log(" API Response:", response);

      const responseData = response.data || {};
      const productList = responseData.data || [];

      const pagination = responseData.pagination || {};
      const pages = pagination.totalPages || 1;
      const total = pagination.total || productList.length;

      console.log("Setting totalPages:", pages, "| totalProducts:", total);

      setProducts(productList);
      setTotalPages(pages);
      setTotalProducts(total);

    } catch (err) {
      console.error(" Error:", err);
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [page, categoryId, subCategoryId, effectiveSubCategoryId, activeFilters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  const prevCategoryRef = useRef(null);
  const prevSubCategoryRef = useRef(null);

  useEffect(() => {
    const catChanged = categoryId !== prevCategoryRef.current;
    const subChanged = subCategoryId !== prevSubCategoryRef.current;

    if (!catChanged && !subChanged) return;

    prevCategoryRef.current = categoryId;
    prevSubCategoryRef.current = subCategoryId;

    setPage(1);
  }, [categoryId, subCategoryId]);

  const handleFilterChange = (filter) => {
    console.log(" Filter changed:", filter);

    setActiveFilters(prev => {
      const newFilters = { ...prev };

      if (
        filter.value === null ||
        filter.value === undefined ||
        filter.value === '' ||
        (Array.isArray(filter.value) && filter.value.length === 0)
      ) {
        delete newFilters[filter.type];
      } else {
        newFilters[filter.type] = filter.value;
      }

      return newFilters;
    });

    setPage(1);
  };

  const breadcrumbText = subCategoryName
    ? `Buy / ${categoryName} / ${subCategoryName}`
    : `Buy / ${categoryName}`;

  const handlePrevPage = () => {
    setPage(p => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setPage(p => Math.min(totalPages, p + 1));
  };

  return (
    <div>
      <Navbar />
      <SearchBarr />

      <div className="product-listing-page">
        <div className="page-header">
          <h1>{categoryName} <span className="count">({totalProducts} Products)</span></h1>
          <span className="breadcrumb">{breadcrumbText}</span>
        </div>

        <div className="page-layout">
          <aside className="left-sidebar">
            <CategorySidebar />
            <FilterPanel
              onFilterChange={handleFilterChange}
              categoryId={categoryId}
              subCategoryId={effectiveSubCategoryId}
            />
          </aside>

          <main className="main-content">
            <div className="toolbar">
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                >
                  ←
                </button>
                <span className="page-num active">{page}</span>
                <span className="page-text">of {totalPages}</span>
                <button
                  className="page-btn"
                  onClick={handleNextPage}
                  disabled={page >= totalPages || totalPages <= 1}
                >
                  →
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <p>No products found</p>
                <p style={{fontSize: "12px", color: "#ccc", marginTop: "8px"}}>
                  page: {page} | totalPages: {totalPages} | totalProducts: {totalProducts}
                </p>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}

            <div className="pagination-bottom">
              <button
                className="page-btn"
                onClick={handlePrevPage}
                disabled={page <= 1}
              >
                ←
              </button>
              <span className="page-num active">{page}</span>
              <span className="page-text">of {totalPages}</span>
              <button
                className="page-btn"
                onClick={handleNextPage}
                disabled={page >= totalPages || totalPages <= 1}
              >
                →
              </button>
            </div>
          </main>
        </div>

        <style>{`
          * { box-sizing: border-box; }
          .product-listing-page {
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f9fafb;
            min-height: 100vh;
          }
          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .page-header h1 {
            font-size: 22px;
            font-weight: 700;
            color: #1f2938;
            text-transform: capitalize;
            margin: 0;
          }
          .count {
            color: #9ca3af;
            font-weight: 400;
            font-size: 15px;
            margin-left: 6px;
          }
          .breadcrumb {
            color: #9ca3af;
            font-size: 13px;
          }
          .page-layout {
            display: flex;
            gap: 24px;
            align-items: flex-start;
          }
          .left-sidebar {
            flex: 0 0 260px;
            position: sticky;
            top: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .main-content {
            flex: 1;
            min-width: 0;
            background: white;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #e5e7eb;
          }
          .toolbar {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid #f3f4f6;
          }
          .pagination, .pagination-bottom {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .pagination-bottom {
            justify-content: flex-end;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid #f3f4f6;
          }
          .page-btn {
            width: 32px;
            height: 32px;
            border: 1px solid #e5e7eb;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #4b5564;
            transition: all 0.15s;
          }
          .page-btn:hover:not(:disabled) {
            border-color: #0d9488;
            color: #0d9488;
          }
          .page-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
          .page-num {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 13px;
            font-weight: 600;
          }
          .page-num.active {
            background: #0d9488;
            color: white;
          }
          .page-text {
            font-size: 13px;
            color: #9ca3af;
          }
          .loading-state, .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 80px 20px;
            color: #9ca3af;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e5e7eb;
            border-top-color: #0d9488;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @media (max-width: 1024px) {
            .page-layout {
              flex-direction: column;
            }
            .left-sidebar {
              position: relative;
              top: 0;
              flex: none;
              width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProductListingPage;