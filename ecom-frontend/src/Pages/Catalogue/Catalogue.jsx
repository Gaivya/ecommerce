import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./styles.css";
import { Pagination } from "swiper/modules";
import AccordionMenu from "./AccordionMenu/AccordionMenu";
import Card from "../Card/Card";
import axios from "axios";
import SITE_CONFIG from "../../controller";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const Catalogue = () => {
  const [productDetails, setProductDetails] = useState([]);
  const [topBanners, setTopBanners] = useState([]);
  const subcategory = useSelector(
    (state) => state.subcategory.selectedSubcategory
  );
  const [sortCriteria, setSortCriteria] = useState("popularity");
  const storeId = useSelector((state) => state.store.selectedStore);
  const location = useLocation();
  const { itemData, categoryName } = location.state || {};
  const [activeSubcategoryid, setActiveSubcategoryid] = useState(
    itemData ? itemData.text : "0"
  );
  const [activecategoryid, setActivecategoryid] = useState(
    itemData ? categoryName : "0"
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location]);

  const fetchProduct = async () => {
    try {
      const response = await axios.post(
        `${SITE_CONFIG.apiIP}/api/product/getproductbystoreid`,
        { store_id: storeId },
        {
          headers: {
            Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
          },
        }
      );

      const products = response.data;
      const normalizedSubcategory = {
        category: subcategory.category.toLowerCase(),
        name: subcategory.name.toLowerCase(),
        storeId: subcategory.storeId,
      };

      const matchingProducts = products.filter((product) => {
        return (
          product.category.toLowerCase() === normalizedSubcategory.category &&
          product.sub_category.toLowerCase() === normalizedSubcategory.name
        );
      });

      const sortedProducts = sortProducts(matchingProducts);
      setProductDetails(sortedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchTopBanners = async () => {
    try {
      const response = await axios.get(`${SITE_CONFIG.apiIP}/api/banner`, {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      });

      const banners = response.data.filter(
        (banner) => banner.position === "top"
      );
      setTopBanners(banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const sortProducts = (products) => {
    switch (sortCriteria) {
      case "popularity":
        return products.sort((a, b) => b.rating - a.rating);
      case "highToLow":
        return products.sort((a, b) => b.sell_price - a.sell_price);
      case "lowToHigh":
        return products.sort((a, b) => a.sell_price - b.sell_price);
      case "aToZ":
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case "zToA":
        return products.sort((a, b) => b.name.localeCompare(a.name));
      case "%OffHighToLow":
        return products.sort((a, b) => b.discount - a.discount); // Assuming a 'discountPercentage' field
      default:
        return products;
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchTopBanners();
  }, [subcategory, sortCriteria]);

  const handleSort = (criteria) => {
    setSortCriteria(criteria);
  };

  return (
    <div className="container ">
      <div className="grid grid-cols-12 gap-5 lg:mx-[50px] lg:px-[15px]  ">
        {/*------------ Accordion Menu ----------------*/}

        <div className="col-span-3 hidden lg:inline-block">
          <AccordionMenu
            subcategory={subcategory}
            activeSubcategoryid={activeSubcategoryid}
            activecategoryid={activecategoryid}
            setActiveSubcategoryid={setActiveSubcategoryid}
            setActivecategoryid={setActivecategoryid}
          />
        </div>

        <div className="col-span-9">
          {/*------------ Slider ----------------*/}
          <div className="hidden lg:inline">
            <Swiper
              spaceBetween={30}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className="mySwiper"
            >
              {topBanners.map((banner, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`${SITE_CONFIG.apiIP}/images/${banner.cover}`}
                    alt={`Banner ${index + 1}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Filter functionality */}
          <div className="flex flex-col lg:flex-row items-end lg:items-start lg:justify-end gap-4 p-4 my-[25px]">


            
            <div className="flex flex-wrap lg:flex-row gap-2 lg:gap-4">
              {/* Filter Buttons */}
              <p className="relative text-gray-800 py-[3px] px-[15px] rounded-md font-   border-1 border-transparent  transition-colors duration-300 focus:outline-none">
                Short by:
              </p>
              {[
                "popularity",
                "highToLow",
                "lowToHigh",
                "aToZ",
                "zToA",
                "%OffHighToLow",
              ].map((criteria) => (
                <button
                  key={criteria}
                  onClick={() => handleSort(criteria)}
                  className={`px-[12px] py-[3px] text-sm relative text-gray-800 rounded-md border-1 border-transparent ${
                    sortCriteria === criteria
                      ? "border-red-700 text-red-700"
                      : "hover:border-red-700 hover:text-red-700"
                  } transition-colors duration-300 focus:outline-none active:text-red-700`}
                >
                  <span className="absolute inset-0 border-1 border-transparent rounded-md transition-colors duration-300 group-hover:border-red-700 group-hover:text-red-700"></span>
                  {criteria.replace(/([A-Z])/g, " $1").toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productDetails.map((item) => (
              <Card key={item._id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
