import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Card from "../Card/Card.jsx";
import {
  TruckIcon,
  ShieldCheckIcon,
  TagIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import { SubCatHome } from "./SubCatHome.jsx";
import { FeatureItem } from "./FeatureItem.jsx";
import axios from "axios";
import SITE_CONFIG from "../../controller.js";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "./HomePage.css";
import { Autoplay, Navigation } from "swiper/modules";
import { setSubcategory } from "../../slices/subcategoryslice.js";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [category, setCategory] = useState([]);
  const [product, setproduct] = useState([]);
  const [banners, setBanners] = useState([]);
  const storeId = useSelector((state) => state.store.selectedStore);

  // Group banners by position
  const topBanners = banners.filter((banner) => banner.position === "top");
  const betweenBanners = banners.filter(
    (banner) => banner.position === "between"
  );
  const bottomBanners = banners.filter(
    (banner) => banner.position === "bottom"
  );

  // Fetch banner data from API
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`${SITE_CONFIG.apiIP}/api/banner`, {
          headers: { Authorization: `Bearer ${SITE_CONFIG.apiToken}` },
        });
        setBanners(response.data);
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    };
    fetchBanner();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % topBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [topBanners]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const goToSlide = (index) => {
    if (index < 0) {
      setCurrentSlide(topBanners.length - 1);
    } else if (index >= topBanners.length) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide(index);
    }
  };

  const [menuItems, setMenuItems] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.post(
        `${SITE_CONFIG.apiIP}/api/product/getproductbystoreid`,
        {
          store_id: storeId,
        },
        {
          headers: {
            Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
          },
        }
      );
      setproduct(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

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

  // Fetch subcategories
  const fetchSubcategories = async (category) => {
    try {
      const response = await axios.post(
        `${SITE_CONFIG.apiIP}/api/subcategory/getsubcategorybysidandcid`,
        {
          store_id: storeId,
          category: category,
        },
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

  // Build menuItems from categories and subcategories
  const buildMenuItems = async () => {
    try {
      const categories = await fetchCategories();
      if (!categories) return;
      const activeCategories = categories.filter(
        (category) => category.status === "active"
      );
      setCategory(activeCategories);
      const items = await Promise.all(
        activeCategories.map(async (category) => {
          const subcategories = await fetchSubcategories(category.name);
          return {
            category: category.name,
            subcategories:
              subcategories
                ?.filter((sub) => sub.status === "active")
                .map((sub) => sub) || [],
          };
        })
      );

      setMenuItems(items);
    } catch (err) {
      console.error(err);
    }
  };
  const handleCategoryClick = (category) => {
    dispatch(
      setSubcategory({
        name: "",
        category: category.name,
      })
    );
    navigate("/catalogue");
  };

  useEffect(() => {
    buildMenuItems();
    fetchProducts();
  }, [storeId]);

  return (
    <>
      {/* Image Carousel */}
      <div className="relative w-full overflow-hidden custom-height ">
        {/* Carousel Container */}
        <div
          className="relative flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            height: "100%",
          }}
        >
          {topBanners.map((banner, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full flex justify-center items-center relative"
            >
              <img
                src={`${SITE_CONFIG.apiIP}/images/${banner.cover}`}
                alt={`Banner ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-1/2 top-1/4">
                {banner.message && (
                  <div
                    className="pb-4 transform -translate-x-1/2 -translate-y-1/2 text-white custom-font-size text-center font-bold bg-opacity-50 rounded"
                    dangerouslySetInnerHTML={{ __html: banner.message }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 px-4 py-2 text-white  bg-opacity-50 rounded-full  transition-colors duration-300"
          onClick={() => goToSlide(currentSlide - 1)}
        >
          &#10094;
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 px-4 py-2 text-white  bg-opacity-50 rounded-full transition-colors duration-300"
          onClick={() => goToSlide(currentSlide + 1)}
        >
          &#10095;
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {topBanners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? "bg-white" : "bg-gray-400"
              } transition-colors duration-300`}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>
      </div>

      {/* Top Picked Section */}
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold mb-4">TOP PICKED</h1>
        <Link to={`/allproduct`} className="text-md text-red-500">
          View all
        </Link>
      </div>
      <Swiper
        slidesPerView={2}
        spaceBetween={20}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="mySwiperProduct"
      >
        {product.map((item, index) => (
          <SwiperSlide key={index} className="w-300">
            <Card item={item} key={index} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Shop by Category */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 to-yellow-400 py-8 my-8">
        <h1 className="text-center text-3xl font-bold  uppercase text-[#212529]">
          Shop by category
        </h1>
        <p className="text-center mb-8">Find everything you need in one go</p>
        <Swiper
          slidesPerView={3}
          spaceBetween={20}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 6,
            },
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Navigation]}
          className="mySwiperCat"
        >
          {category.map((category, index) => (
            <SwiperSlide
              key={index}
              className="bg-transparent flex justify-center items-center cursor-grab"
              style={{ backgroundColor: "transparent" }}
            >
              <Link
                key={index}
                onClick={() => handleCategoryClick(category)}
                className="p-6 rounded-lg flex flex-col items-center sm:w-50 flex-shrink-0 cursor-grab"
              >
                <img
                  src={`${SITE_CONFIG.apiIP}/images/${category.cover}`}
                  alt="Category"
                  className="w-40 h-40 rounded-full object-cover mb-4"
                  id="categoryImage"
                />
                <h2 className="text-sm font-bold text-center">
                  {category.name}
                </h2>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Featured Items */}
      <div className="flex flex-col md:flex-row md:gap-6 gap-10 md:justify-between m-8">
        <FeatureItem
          icon={<TruckIcon className="w-6 h-6 text-red-500" />}
          title="Free Shipping"
          description="On orders over $1000"
        />
        <FeatureItem
          icon={<ShieldCheckIcon className="w-6 h-6 text-red-500" />}
          title="Safe Online Payment"
          description="Secure transactions"
        />
        <FeatureItem
          icon={<TagIcon className="w-6 h-6 text-red-500" />}
          title="Value for Money"
          description="100% Fresh & Halal Certified"
        />
        <FeatureItem
          icon={<PhoneIcon className="w-6 h-6 text-red-500" />}
          title="Support"
          description="431-695-219"
        />
      </div>

      {/* Banner Section */}
      <div className="flex flex-wrap py-6">
        {betweenBanners.map((banner, index) => (
          <div
            key={index}
            className="w-full md:w-1/2 flex items-center justify-center"
          >
            <img
              className="w-full h-auto max-h-60 object-cover"
              src={`${SITE_CONFIG.apiIP}/images/${banner.cover}`}
              alt={`Banner ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Subcategory section */}
      <div className="relative overflow-hidden py-8 my-8">
        {menuItems.map((item, i) => (
          <SubCatHome
            key={i}
            heading={item.category}
            subCategories={item.subcategories}
          />
        ))}
      </div>

      {/* Image Section */}
      <div className="flex flex-col gap-2 md:flex-row md:gap-0 mb-20">
        {bottomBanners.map((banner, index) => (
          <div
            key={index}
            className="w-full md:w-1/2 flex items-center justify-center"
          >
            <img
              className="w-full h-auto max-h-80 object-cover"
              src={`${SITE_CONFIG.apiIP}/images/${banner.cover}`}
              alt={`Banner ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default HomePage;
