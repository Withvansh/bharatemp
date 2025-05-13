import React from 'react';
import upperline from '../assets/Line81.png';
import footerbg from '../assets/footerbg.png';
import logobottom from '../assets/footerlogo.svg';
 
const Footer = () => {
  return (
    <div className="relative w-full h-auto  flex flex-col bg-[#1e3473] overflow-hidden">
      {/* Line image */}
      <img
        src={upperline}
        alt="upperline"
        className="absolute top-5 left-0 w-full max-h-[15px] md:max-h-[20px] object-contain"
      />
 
      <div className="flex flex-col md:flex-row w-full min-h-[400px] mt-8 md:mt-0">
        {/* Left side - 40% */}
        <div className="w-full md:w-[40%] flex flex-col text-white z-10 px-4 md:px-10 py-2 md:py-8">
          <img
            src={logobottom}
            alt="logobottom"
            className="max-w-[200px] md:max-w-full mb-4"
          />
          <p className="text-xs sm:text-sm md:text-base leading-5 md:leading-6">
            Reach Out To Our Team Of Experienced Design Professionals For
            Personalized Consultation, Detailed Planning, And Seamless Execution
            Of Your Interior Design Project
          </p>
        </div>
 
        {/* Right side - 60% with background image */}
        <div
          className="w-full md:w-[60%] px-4 md:px-6 py-6 md:py-8 text-white"
          style={{
            backgroundImage: `url(${footerbg})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center 40px',
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row justify-between gap-4 md:gap-8">
            {/* Column 1 */}
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold mb-2 text-xs md:text-sm lg:text-base">SHOPPING SERVICES</h3>
              <ul className="space-y-2 md:space-y-4 text-xs sm:text-sm md:text-[18px]">
                <li>Propellers</li>
                <li>PCBs</li>
                <li>Drone Parts</li>
                <li>Trade program</li>
              </ul>
            </div>
 
            {/* Column 2 */}
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold mb-2 text-xs md:text-sm lg:text-base">ABOUT</h3>
              <ul className="space-y-2 md:space-y-4 text-xs sm:text-sm md:text-base">
                <li>Reviews</li>
                <li>Careers</li>
                <li>Financing</li>
                <li>Patents</li>
                <li>Our Blog</li>
              </ul>
            </div>
 
            {/* Column 3 */}
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold mb-2 text-xs md:text-sm lg:text-base">RESOURCES</h3>
              <ul className="space-y-2 md:space-y-4 text-xs sm:text-sm md:text-base">
                <li>Look Up Order Status</li>
                <li>Assembly Intrusions</li>
                <li>Returns</li>
                <li>Shipping & Delivery</li>
                <li>FAQ</li>
                <li>Refer a Friend</li>
              </ul>
            </div>
 
            {/* Column 4 */}
            <div className="col-span-2 sm:col-span-1 md:col-auto">
              <h3 className="font-semibold mb-2 text-xs md:text-sm lg:text-base">CONTACT CS</h3>
              <ul className="space-y-2 md:space-y-4 text-xs sm:text-sm md:text-base">
                <li className="break-words">Email: support@Bharatronix.com</li>
                <li>Hours:</li>
                <li>Mon-Fri — 10am to 8pm</li>
                <li>Sat-Sun — 10am to 2pm</li>
                <li>Delhi, India</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <img
        src={upperline}
        alt="upperline"
        className="absolute bottom-14 left-0 w-full max-h-[15px] md:max-h-[20px] object-contain"
      />
      <div className="w-full  flex flex-col md:flex-row  items-center md:justify-between gap-1 md:gap-4 text-white px-10 text-xs sm:text-sm md:text-base ">
        <span>© Copyright 2024, All Rights Reserved</span>
        <span className="flex gap-4">
          <span>Terms of Service</span>
          <span>Privacy Policy </span>
        </span>
      </div>
 
    </div>
  );
};
 
export default Footer;