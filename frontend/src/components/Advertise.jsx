import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Cards from "./Cards";

function Advertise() {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        let url = import.meta.env.APP_URL || "";

        const response = await fetch(`${url}api/advertisements`);
        if (!response.ok) {
          throw new Error("Failed to fetch advertisements");
        }
        const data = await response.json();
        setAdvertisements(
          data.filter((item) => item.category === "advertisement")
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: true,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="max-w-screen-2x1 container mx-auto mt-12 mb-12 text-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-2x1 container mx-auto mt-12 mb-12 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl container space-y-6 px-5 mt-12 mb-12 mx-auto">
      <div className="mt-4 px-10">
        <Slider {...settings}>
          {advertisements.map((item) => (
            <div key={item.id} className="mx-10">
              {" "}
              {/* Add padding for gap */}
              <Cards item={item} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Advertise;
