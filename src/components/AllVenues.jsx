import { MapPinIcon, Star, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y } from 'swiper/modules';
import { Pagination as PaginationSwiper } from "swiper/modules";
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion, useInView } from 'framer-motion';
import FilterVenues from "./FilterVenues";

export default function GetAllVenues() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const [venues, setVenues] = useState([]);
  const [Filteredvenues, setFilteredVenues] = useState([]);
  const [currentPage,] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');



  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("Access token not found");
        }

        const queryParams = new URLSearchParams(window.location.search);
        const countryFilter = queryParams.get('country');

        // Construct URL with filters and sorting
        let url = 'https://nf-api.onrender.com/api/v1/holidaze/venues?_sort=created:desc';
        let params = [];

        if (params.length > 0) {
          url += '?' + params.join('&');
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }

        const venuesData = await response.json();

        // Filter and sort venues as before
        let filteredVenues = venuesData.filter(
          (venue) => venue.media && venue.media.length > 0
        );
        const sortedVenues = [
          ...filteredVenues.filter(venue => venue.media.length > 1),
          ...filteredVenues.filter(venue => venue.media.length <= 1)
        ];

        // Filter by country if countryFilter is present
        if (countryFilter) {
          filteredVenues = sortedVenues.filter(venue => venue.location.country === countryFilter);
        } else {
          filteredVenues = sortedVenues; // If no country filter, use all venues
        }
        // Sort by creation date (ensure sorting by 'created' property is in descending order)
        filteredVenues.sort((a, b) => new Date(b.created) - new Date(a.created));


        setVenues(filteredVenues);
        setFilteredVenues(filteredVenues); // Initialize Filteredvenues with all venues
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchVenues();
  }, [currentPage]);

  useEffect(() => {
    const lowercasedFilter = searchQuery.toLowerCase();
    const filteredData = venues.filter(item => {
      return (
        item.name.toLowerCase().includes(lowercasedFilter) ||
        item.location.country.toLowerCase().includes(lowercasedFilter) ||
        item.price.toString().includes(lowercasedFilter)
      );
    });
    setFilteredVenues(filteredData);
  }, [searchQuery, venues]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-6xl my-8">All venues</h1>
      <div>
        <FilterVenues setVenues={setVenues} venues={venues} />
        <div className="flex justify-between items-center">
          <div className="hidden lg:flex space-x-5">
            <Link to={""} className="text-xs font-light py-3 px-3 border rounded-full">Lowest to highest $</Link>
            <Link to={""} className="text-xs font-light py-3 px-3 border rounded-full">Lowest to highest rating</Link>
            <Link to={""} className="text-xs font-light py-3 px-3 border rounded-full">Most amount of people</Link>
            <Link to={""} className="text-xs font-light py-3 px-3 border rounded-full">Least amount of people</Link>
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Search for Venues.."
              className="rounded-full"
              id="SearchVenues"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="text-xs items-end justify-end flex p-2">Amount of venues: {Filteredvenues.length}</span>
          </div>
        </div>
      </div>
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-5">
        {Filteredvenues.map((venue, index) => (
          <motion.div
            key={index}
            className="flex flex-col"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ staggerChildren: 0.1 }}
            ref={ref}
          >
            <Link to={`/venues/${venue.id}`} className="w-full">
              {venue.media && venue.media.length > 0 ? (
                <Swiper
                  className="h-48 md:h-64"
                  spaceBetween={0}
                  slidesPerView={1}
                  centeredSlides={true}
                  navigation={true}
                  pagination={true}
                  modules={[Navigation, Scrollbar, PaginationSwiper, A11y]}
                >
                  {venue.media.map((image, imageIndex) => (
                    <SwiperSlide key={imageIndex}>
                      <img
                        className="object-cover w-full h-full rounded hover:scale-110 overflow-auto transition-all"
                        src={image}
                        alt=""
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="h-48 md:h-64 bg-gray-300"></div>
              )}
            </Link>
            <div className="flex justify-between mt-4">
              <div className="flex flex-col items-start gap-1 justify-start">
                <h2 className="text-lg">{venue.name}</h2>
                <div className="flex">
                  <span className="flex items-center text-sm opacity-65"><MapPinIcon strokeWidth={1} />{venue.location.country}</span>
                </div>
                <span className="text-gray-600 ml-2 font-extralight">From ${venue.price} per night</span>
              </div>
              <div className="flex items-center flex-col">
                {venue.rating >= 4 ? (
                  <p className="text-gray-600 flex items-center flex-row">
                    <Star strokeWidth={1.25} />
                    {venue.rating}
                  </p>
                ) : (
                  <p className="text-gray-600 flex items-center flex-row text-xs">
                    New   <Star strokeWidth={1.25} />
                  </p>
                )}
                <Users strokeWidth={1.25} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
