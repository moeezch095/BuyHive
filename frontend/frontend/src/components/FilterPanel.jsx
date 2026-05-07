import React, { useState, useEffect } from "react";
import API from "../api/api";

const FilterPanel = ({ onFilterChange, categoryId, subCategoryId }) => {
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [moq, setMoq] = useState("");
  const [certs, setCerts] = useState([]);
  const [supplierCerts, setSupplierCerts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    certifications: ["FDA", "Intertek", "GB", "Certificate of Conformity"],
    supplierCertifications: ["DUNS", "DRS", "ISO 9001"],
    locations: ["Hong Kong S.A.R", "China", "United Kingdom", "United States"],
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        let url = API.filters ;
        if (categoryId) url += `category_id=${categoryId}&`;
        if (subCategoryId) url += `subcategory_id=${subCategoryId}`;

        const res = await fetch(url);

        if (!res.ok) {
          console.warn("⚠️ Filters API not found (404), using static filters");
          return;
        }

        const data = await res.json();
        setFilterOptions({
          certifications: data.certifications || [
            "FDA",
            "Intertek",
            "GB",
            "Certificate of Conformity",
          ],
          supplierCertifications: data.supplier_certifications || [
            "DUNS",
            "DRS",
            "ISO 9001",
          ],
          locations: data.locations || [
            "Hong Kong S.A.R",
            "China",
            "United Kingdom",
            "United States",
          ],
        });
      } catch (err) {
        console.error(" Error fetching filters:", err);
      }
    };

    if (categoryId || subCategoryId) {
      fetchFilterOptions();
    }
  }, [categoryId, subCategoryId]);

  const handlePriceApply = () => {
    const min = priceMin !== "" ? Number(priceMin) : null;
    const max = priceMax !== "" ? Number(priceMax) : null;

    if (
      (min !== null && !isNaN(min) && min >= 0) ||
      (max !== null && !isNaN(max) && max >= 0)
    ) {
      onFilterChange?.({
        type: "price",
        value: {
          min: min !== null ? min : undefined,
          max: max !== null ? max : undefined,
        },
      });
    } else {
      onFilterChange?.({ type: "price", value: null });
    }
  };

  const handlePriceClear = () => {
    setPriceMin("");
    setPriceMax("");
    onFilterChange?.({ type: "price", value: null });
  };

  const handleMoqChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setMoq(numericValue);

    if (numericValue && numericValue !== "") {
      const num = Number(numericValue);
      if (!isNaN(num) && num > 0) {
        onFilterChange?.({ type: "moq", value: num });
      }
    } else {
      onFilterChange?.({ type: "moq", value: null });
    }
  };

  const handleMoqClear = () => {
    setMoq("");
    onFilterChange?.({ type: "moq", value: null });
  };

  const toggleCheckbox = (item, list, setter, type) => {
    const newList = list.includes(item)
      ? list.filter((i) => i !== item)
      : [...list, item];
    setter(newList);
    onFilterChange?.({ type, value: newList.length > 0 ? newList : null });
  };

  return (
    <div className="filter-panel">
      <div className="filter-section">
        <h4>Price</h4>
        <div className="price-row">
          <div className="price-input-box">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              min="0"
            />
            <span className="currency">$</span>
          </div>
          <span className="divider">—</span>
          <div className="price-input-box">
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              min="0"
            />
            <span className="currency">$</span>
          </div>
        </div>
        <div className="filter-actions">
          <button className="apply-btn" onClick={handlePriceApply}>
            Apply
          </button>
          <button className="clear-btn" onClick={handlePriceClear}>
            Clear
          </button>
        </div>
      </div>

      <div className="filter-section">
        <h4>MOQ</h4>
        <div className="moq-row">
          <input
            type="number"
            placeholder="Less than"
            value={moq}
            onChange={(e) => handleMoqChange(e.target.value)}
            className="filter-input"
            min="1"
          />
          <button className="clear-btn small" onClick={handleMoqClear}>
            ✕
          </button>
        </div>
      </div>

      <div className="filter-section">
        <h4>Product Certification</h4>
        <div className="search-box">
          <input type="text" placeholder="Product Certifications..." />
          <span className="search-icon"></span>
        </div>
        <div className="checkbox-list">
          {filterOptions.certifications.map((cert) => (
            <label key={cert} className="checkbox-label">
              <input
                type="checkbox"
                checked={certs.includes(cert)}
                onChange={() =>
                  toggleCheckbox(cert, certs, setCerts, "certification")
                }
              />
              <span className="checkmark"></span>
              <span className="label-text">{cert}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Supplier Certification</h4>
        <div className="search-box">
          <input type="text" placeholder="Supplier Certifications..." />
          <span className="search-icon"></span>
        </div>
        <div className="checkbox-list">
          {filterOptions.supplierCertifications.map((cert) => (
            <label key={cert} className="checkbox-label">
              <input
                type="checkbox"
                checked={supplierCerts.includes(cert)}
                onChange={() =>
                  toggleCheckbox(
                    cert,
                    supplierCerts,
                    setSupplierCerts,
                    "supplierCert",
                  )
                }
              />
              <span className="checkmark"></span>
              <span className="label-text">{cert}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Manufacturer Location</h4>
        <div className="search-box">
          <input type="text" placeholder="Country/Region" />
          <span className="search-icon"></span>
        </div>
        <div className="checkbox-list">
          {filterOptions.locations.map((loc) => (
            <label key={loc} className="checkbox-label">
              <input
                type="checkbox"
                checked={locations.includes(loc)}
                onChange={() =>
                  toggleCheckbox(loc, locations, setLocations, "location")
                }
              />
              <span className="checkmark"></span>
              <span className="label-text">{loc}</span>
            </label>
          ))}
        </div>
      </div>

      <style>{`
        .filter-panel {
          width: 100%;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .filter-section {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f3f4f6;
        }
        .filter-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .filter-section h4 {
          font-size: 14px;
          font-weight: 600;
          color: #1f2938;
          margin: 0 0 12px 0;
        }

        /* Price */
        .price-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .price-input-box {
          position: relative;
          flex: 1;
        }
        .price-input-box input {
          width: 100%;
          padding: 8px 28px 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          font-size: 13px;
          color: #374151;
          background: #f9fafb;
          outline: none;
          transition: all 0.2s;
        }
        .price-input-box input:focus {
          border-color: #0d9488;
          background: white;
        }
        .price-input-box .currency {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 12px;
          pointer-events: none;
        }
        .divider {
          color: #9ca3af;
          font-size: 12px;
        }

        /* Filter Actions (Apply/Clear buttons) */
        .filter-actions {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }
        .apply-btn {
          flex: 1;
          padding: 8px 12px;
          background: #0d9488;
          color: white;
          border: none;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .apply-btn:hover {
          background: #0f766e;
        }
        .clear-btn {
          padding: 8px 14px;
          background: #f3f4f6;
          color: #6b7280;
          border: none;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .clear-btn:hover {
          background: #e5e7eb;
          color: #374151;
        }
        .clear-btn.small {
          padding: 8px 10px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* MOQ */
        .moq-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* MOQ Input */
        .filter-input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          font-size: 13px;
          color: #374151;
          background: #f9fafb;
          text-align: center;
          outline: none;
          transition: all 0.2s;
        }
        .filter-input:focus {
          border-color: #0d9488;
          background: white;
        }
        .filter-input::placeholder {
          color: #9ca3af;
        }

        /* Search Box */
        .search-box {
          position: relative;
          margin-bottom: 10px;
        }
        .search-box input {
          width: 100%;
          padding: 8px 32px 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          font-size: 12px;
          color: #374151;
          background: #f9fafb;
          outline: none;
        }
        .search-box input::placeholder {
          color: #9ca3af;
        }
        .search-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          opacity: 0.4;
          pointer-events: none;
        }

        /* Checkbox List */
        .checkbox-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 0;
          font-size: 13px;
          color: #4b5564;
          cursor: pointer;
          transition: all 0.15s;
        }
        .checkbox-label:hover {
          color: #0d9488;
        }
        .checkbox-label input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: #0d9488;
        }
        .label-text {
          line-height: 1.3;
        }
      `}</style>
    </div>
  );
};

export default FilterPanel;
