import { useNavigate } from "react-router-dom";
import { toSlug } from "../utils/slug";

const CategoryTree = ({ items }) => {
  const navigate = useNavigate();

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <span
            onClick={() =>
              navigate(`/buy/${toSlug(item.name)}`, {
                state: { id: item.id },
              })
            }
            style={{ cursor: "pointer", fontWeight: "bold" }}
          >
            {item.name}
          </span>

          {item.children && item.children.length > 0 && (
            <CategoryTree items={item.children} />
          )}

          {item.products?.map((p) => (
            <div key={p.id} style={{ marginLeft: "10px" }}>
              {p.name}
            </div>
          ))}
        </li>
      ))}
    </ul>
  );
};

export default CategoryTree;
