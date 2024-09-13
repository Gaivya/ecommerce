import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import "./AccordionMenu.css";
import axios from "axios";
import SITE_CONFIG from "../../../controller";
import { useDispatch } from "react-redux";
import { setSubcategory } from "../../../slices/subcategoryslice";

const AccordionMenu = ({
  activeSubcategoryid,
  subcategory,
  activecategoryid,
  setActiveSubcategoryid,
  setActivecategoryid,
}) => {
  useEffect(() => {
    // Handle changes to subcategory here
    if (subcategory) {
      setActiveSubcategoryid(subcategory.name);
      setActivecategoryid(subcategory.category);
    }
  }, [subcategory]);

  const [menuItems, setMenuItems] = useState([]);
  const dispatch = useDispatch();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${SITE_CONFIG.apiIP}/api/category`, {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (category) => {
    try {
      const response = await axios.get(
        `${SITE_CONFIG.apiIP}/api/subcategory?category=${category}`,
        {
          headers: {
            Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const buildMenuItems = async () => {
    try {
      const categories = await fetchCategories();
      if (!categories) return;
      const activeCategories = categories.filter(
        (category) => category.status === "active"
      );

      const items = await Promise.all(
        activeCategories.map(async (category) => {
          const subcategories = await fetchSubcategories(category.name);
          return {
            category: category.name,
            subcategories:
              subcategories
                ?.filter((sub) => sub.status === "active")
                .map((sub) => ({ name: sub.name, data: sub })) || [],
          };
        })
      );

      setMenuItems(items);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    buildMenuItems();
  }, []);

  const handleSubcategoryClick = (subcategoryData) => {
    dispatch(
      setSubcategory({
        name: subcategoryData.name,
        category: subcategoryData.category,
      })
    );
    setActiveSubcategoryid(subcategoryData.name);
  };

  return (
    <div className="accordion-menu">
      <h2>Categories</h2>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <div
              onClick={() => setActivecategoryid(item.category)}
              className={`menu-item ${
                activecategoryid === item.category ? "active" : ""
              }`}
            >
              {item.subcategories.length > 0 &&
                (activecategoryid === item.category ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                ))}
              {item.category}
            </div>
            {activecategoryid === item.category &&
              item.subcategories.length > 0 && (
                <ul className="submenu">
                  {item.subcategories.map((subcategory, subIndex) => (
                    <li
                      key={subIndex}
                      onClick={() => handleSubcategoryClick(subcategory.data)}
                      className={
                        activeSubcategoryid === subcategory.name ? "active" : ""
                      }
                    >
                      {subcategory.name}
                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccordionMenu;
