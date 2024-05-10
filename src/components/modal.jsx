import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { perspective, slideIn } from "../animations/anim";
import { Link } from 'react-router-dom';

export default function Modal({ isActive, toggleMenu, venues = [], setFilteredVenues }) {
  const [selectedCountry, setSelectedCountry] = useState(null); // State to track selected country

  const [trackState, setTrackState] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [location, setLocation] = useState('');
  const [essentials, setEssentials] = useState({
    wifi: false,
    breakfast: false,
    pets: false
  });

  // Filtering logic
  const applyFilters = () => {
    const filtered = venues.filter(venue => {
      // Apply price range filter
      const withinPriceRange =
        venue.price >= priceRange.min && venue.price <= priceRange.max;

      // Apply location filter
      const matchesLocation = location ? venue.location === location : true;

      // Apply essentials filters
      const meetsEssentials =
        (!essentials.wifi || venue.hasWifi) &&
        (!essentials.breakfast || venue.hasBreakfast) &&
        (!essentials.pets || venue.allowPets);

      return withinPriceRange && matchesLocation && meetsEssentials;
    });

    // Update the filtered venues state
    setFilteredVenues(filtered);
  };

  // Get unique countries and their counts
  const countryCounts = venues.reduce((acc, venue) => {
    if (!acc[venue.location.country]) {
      acc[venue.location.country] = 1;
    } else {
      acc[venue.location.country]++;
    }
    return acc;
  }, {});

  const handleCountryClick = (country) => {
    setSelectedCountry(country); // Update selected country when clicked
    // Append selected country to the URL
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('country', country);
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  // Function to clear filter
  const clearFilter = () => {
    setSelectedCountry(''); // Reset selected country
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.delete('country'); // Remove country parameter from URL
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  return (
    <div className='p-10' >
      <motion.div
        variants={perspective}
        animate="enter"
        exit="exit"
      >
        <h1 className='text-3xl font-bold'>Filter</h1>
        <motion.div className='w-[300px]' variants={perspective} animate="enter" exit="exit" initial="hidden" transition={{ opacity: 1 }}>
          <h2 className='text-sm lg:text-2xl font-semibold my-5'>$ Price range</h2>
          <label htmlFor="minmax-range" className="block mb-2 text-sm font-medium text-gray-400 dark:text-white">Min-max range</label>
          <span>Price from 300 - 400$</span>
          <motion.div className='flex gap-4 items-baseline p-1 animate-pulse' variants={slideIn}>
            {/* Placeholder animation elements */}
          </motion.div>
          <input defaultValue id="minmax-range" type="range" min="0" max="10" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 my-5" />
          <hr className='w-[90vw]' />
          <h2 className='text-sm lg:text-2xl font-semibold my-5 flex items-center gap-1'><Globe strokeWidth={1.25} />Choose your location </h2>
          <ul className='my-4 flex flex-wrap w-screen'>
            {Object.entries(countryCounts).map(([country, count]) => (
              <li key={country} className='w-1/2 md:w-1/3 lg:w-1/4 mb-2 px-2'>
                <span
                  className={cn(
                    'block hover:border-b transition-all w-40 scale-105 cursor-pointer',
                    { 'text-black': selectedCountry === country }
                  )}
                  onClick={() => handleCountryClick(country)} // Call handleCountryClick on click
                >
                  {country} ({count})
                </span>
              </li>
            ))}
          </ul>
          <hr className='w-[90vw]' />
          <h2 className='text-lg font-semibold my-5'>Essentials:</h2>
          <div className='flex items-center gap-2'>
            <input type="checkbox" name="" id="" className='h-4 w-4' />
            <label htmlFor="Wifi">Wifi</label>
          </div>
          <div className='flex items-center gap-2'>
            <input type="checkbox" name="" id="" className='h-4 w-4' />
            <label htmlFor="Wifi">Breakfast</label>
          </div>
          <div className='flex items-center gap-2'>
            <input type="checkbox" name="" id="" className='h-4 w-4' />
            <label htmlFor="Wifi">Pets</label>
          </div>
        </motion.div>

        <button className='mt-5' onClick={clearFilter}>Clear filter</button>


        <button className='ml-10' ><a href="">Search</a></button>
      </motion.div>
    </div>
  )
}
