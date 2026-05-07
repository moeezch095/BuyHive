import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toSlug } from "../utils/slug";
import CategoryTree from "../components/CategoryTree";
import API from "../api/api";

const CategoryPage = () => {
  const { slug } = useParams();
  const location = useLocation();

  const [data, setData] = useState(null);

  useEffect(() => {
    let id = location.state?.id;

  
    if (!id) {
      const stored = JSON.parse(localStorage.getItem("categories"));

      const findCategory = (list) => {
        for (let item of list) {
          if (toSlug(item.name) === slug) return item;

          for (let sub of item.sub_categories || []) {
            if (toSlug(sub.name) === slug) return sub;

            for (let child of sub.children || []) {
              if (toSlug(child.name) === slug) return child;
            }
          }
        }
        return null;
      };

      const found = findCategory(stored || []);
      id = found?.id;
    }

    if (!id) return;

    fetch(API.categoryById(id))
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, [slug]);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{slug}</h2>

      <CategoryTree items={data} />
    </div>
  );
};

export default CategoryPage;