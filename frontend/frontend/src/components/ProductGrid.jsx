
import React from "react";
import ProductCard from "./ProductCard"; 

const ProductGrid = ({ products, viewMode = "grid" }) => {
  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
        No products found
      </div>
    );
  }

  return (
    <div className={`product-grid ${viewMode}`}>
      {products.map((product, index) => (
   
        <ProductCard key={product.id} product={product} index={index} />
      ))}

      <style>{`
        .product-grid { display: grid; gap: 20px; }
        .product-grid.grid { grid-template-columns: repeat(3, 1fr); }
        .product-grid.list { grid-template-columns: 1fr; }
        
        .product-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .product-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-3px); 
        }
        .product-image {
          height: 200px;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover; 
        }
        .product-info { padding: 15px; }
        .product-name {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          line-height: 1.4;
          white-space: nowrap;      
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .product-moq { font-size: 12px; color: #9ca3af; margin-bottom: 5px; }
        .product-price { font-size: 16px; font-weight: 700; color: #0d9488; }
      `}</style>
    </div>
  );
};

export default ProductGrid;