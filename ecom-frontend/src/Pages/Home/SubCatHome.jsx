import SITE_CONFIG from "../../controller";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSubcategory } from "../../slices/subcategoryslice";

export const SubCatHome = ({ heading, subCategories }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleCategoryClick = (subCategory) => {
    dispatch(
      setSubcategory({
        name: subCategory.name,
        category: heading,
      })
    );
    navigate("/catalogue");
  };
  return (
    <>
      {subCategories.length === 0 ? (
        ""
      ) : (
        <h1
          className="text-center font-mont md:text-xl font-semibold mb-4 p-2 bg-gray-400 uppercase text-sm"
          style={{ backgroundColor: "#f3f3f3" }}
        >
          {heading}
        </h1>
      )}
      <div className="flex justify-center flex-col h-auto md:h-auto">
        <div className="flex flex-wrap gap-4 p-1">
          {subCategories.map((subCategory, index) => (
            <Link key={index} onClick={() => handleCategoryClick(subCategory)}>
              <div className="flex flex-col items-center w-40 sm:w-48 p-1">
                <img
                  src={`${SITE_CONFIG.apiIP}/images/${subCategory.cover}`}
                  alt="Subcategory"
                  className="w-48 h-48 rounded-full object-cover mb-4"
                />
                <h2 className="md:text-sm text-xs font-mont font-custom-700 text-center">
                  {subCategory.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
