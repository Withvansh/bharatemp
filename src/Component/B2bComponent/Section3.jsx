import map from '../../assets/map.webp'
import { FaCloud, FaRobot, FaPlusCircle, FaWind, FaHelicopter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OnlinePresenceSection = () => {
  return (
    <>
    <div className="bg-[#1E3473] lg:h-[488px] h-auto text-white rounded-xl p-6 md:p-12 flex-col md:flex-row items-center justify-between gap-8 hidden md:flex">
      {/* Left Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={map} // Replace with actual path to your image
          alt="India Map"
          className="max-w-full h-auto object-contain"
        />
      </div>

      {/* Right Content */}
      <div className="w-full md:w-1/2 space-y-4">
        <h2 className="md:text-2xl lg:text-3xl  xl:text-[57px] font-bold">Our Online presence</h2>
       <div className='w-full md:w-[75%] text-[#E1E3EB] md:text-[19px] text-[12px]'>
        <p className=" ">
        Over 10,000 pincodes reached and counting! We collaborate with India’s finest courier services to bring you fast, seamless deliveries wherever you are.  
        </p>
    
       </div>
        <Link to="/allproducts" className="bg-[#F7941D]  text-white font-semibold py-3 px-8 rounded-full mt-4">
          Shop Now
        </Link>
      </div>


    </div>

    {/* Mobile Layout */}
    <div className="md:hidden mobile-b2b-presence">
      <img
        src={map}
        alt="India Map"
        className="mobile-b2b-presence-image"
      />
      <div className="mobile-b2b-presence-content">
        <h2 className="mobile-b2b-presence-title">Our Online presence</h2>
        <p className="mobile-b2b-presence-text">
          Over 10,000 pincodes reached and counting! We collaborate with India's finest courier services to bring you fast, seamless deliveries wherever you are.
        </p>
        <Link to="/allproducts" className="mobile-b2b-presence-button">
          Shop Now
        </Link>
      </div>
    </div>
    </>
  );
};

export default OnlinePresenceSection;
