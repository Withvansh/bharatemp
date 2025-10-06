import React from "react";
import img1 from "../../assets/1.png";
import img2 from "../../assets/2.png";
import img3 from "../../assets/3.png";
import img4 from "../../assets/4.png";
import img5 from "../../assets/5.png";
import img6 from "../../assets/6.png";
import img7 from "../../assets/7.png";
import img8 from "../../assets/8.png";
import img9 from "../../assets/9.png";
import img10 from "../../assets/10.png";
import img11 from "../../assets/11.png";
import img12 from "../../assets/12.png";
import img13 from "../../assets/13.png";
import img14 from "../../assets/14.png";
import img15 from "../../assets/15.png";
import img16 from "../../assets/16.jpg";

const brands = [
  { img: img1, alt: "Brand 1" },
  { img: img2, alt: "Brand 2" },
  { img: img3, alt: "Brand 3" },
  { img: img1, alt: "Brand 1" },
  { img: img2, alt: "Brand 2" },
  { img: img3, alt: "Brand 3" },
  { img: img4, alt: "Brand 4" },
  { img: img5, alt: "Brand 5" },
  { img: img6, alt: "Brand 6" },
  { img: img7, alt: "Brand 7" },
  { img: img8, alt: "Brand 8" },
  { img: img9, alt: "Brand 9" },
  { img: img10, alt: "Brand 10" },
  { img: img11, alt: "Brand 11" },
  { img: img12, alt: "Brand 12" },
  { img: img13, alt: "Brand 13" },
  { img: img14, alt: "Brand 14" },
  { img: img15, alt: "Brand 15" },
  { img: img16, alt: "Brand 16" },
];

export default function B2BIndustriesSection() {
  const renderBrandSet = (keyPrefix = '') => (
    <div className="flex items-center py-4 whitespace-nowrap">
      {brands.map((brand, index) => (
        <div
          key={`${keyPrefix}${index}`}
          className="inline-flex items-center justify-center flex-shrink-0 mx-8 w-40"
        >
          <img
            src={brand.img}
            alt={brand.alt}
            className="h-32 w-auto max-w-[140px] object-contain transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full h-auto bg-white text-center mb-10 overflow-hidden">
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee hover:pause w-max">
          {/* First set of brands */}
          {renderBrandSet()}
          {/* Duplicate set for seamless loop */}
          {renderBrandSet('duplicate-')}
        </div>
      </div>
    </div>
  );
}