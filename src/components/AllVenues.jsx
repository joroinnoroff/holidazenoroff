import { MapPinIcon, Star, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y } from 'swiper/modules';
import { Pagination as PaginationSwiper } from "swiper/modules";
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "../_components/ui/pagination";
import { motion, useInView } from 'framer-motion';
import FilterVenues from "./FilterVenues";

// Inside your component
export default function GetAllvenues() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const [venues, setVenues] = useState([]);
  const [Filteredvenues, setFilteredVenues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 6; // Changed to 6 venues per page
  const pagesToShow = 3; // Number of pages to show in the pagination
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
        let url = 'https://nf-api.onrender.com/api/v1/holidaze/venues';
        let params = [];

        if (params.length > 0) {
          url += '?' + params.join('&');
        }

        // Add sorting by price
        url += '?_sortOrder=asc';

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

        setVenues(filteredVenues);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchVenues();
  }, [currentPage]);



  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate start and end index for the current page
  const startIndex = (currentPage - 1) * venuesPerPage;
  const endIndex = startIndex + venuesPerPage;

  const defaultAnimations = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      Bounce: 0.5
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div>
        <FilterVenues setVenues={setVenues} venues={venues} />
      </div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-5"
      >
        {venues.slice(startIndex, endIndex).map((venue, index) => (
          <motion.div
            key={index}
            className="flex flex-col"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            aria-hidden
            transition={{ staggerChildren: 0.1 }}
            ref={ref}
          >
            <Link to={`/venues/${venue.id}`} className="w-full">
              {venue.media && venue.media.length > 0 ? (
                <Swiper
                  className="h-48 md:h-64"
                  spaceBetween={0}
                  loopedslides={"true"}
                  slidesPerView={1} // Change this to 2
                  centeredSlides={true} // Center the active slide
                  onSlideChange={() => console.log('slide change')}
                  onSwiper={(swiper) => console.log(swiper)}
                  navigation={true} // Add navigation
                  pagination={true}

                  modules={[Navigation, Scrollbar, Pagination, A11y]}
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
              <div className="flex flex-col">
                <h2 className="text-lg font-extralight">{venue.name}</h2>

                <div className="flex">
                  <span className="flex"><MapPinIcon strokeWidth={1} />{venue.location.country}</span>
                </div>

                <span className="text-gray-600 ml-2">${venue.price}</span>
              </div>
              <div className="flex items-center flex-col  ">
                {venue.rating >= 4 && (
                  <p className="text-gray-600 flex items-center flex-row">
                    <Star strokeWidth={1.25} />
                    {venue.rating}
                  </p>
                )}
                <Users />
                {/* You can adjust the styling of the Users component if necessary */}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
            >
              Previous
            </PaginationPrevious>
          </PaginationItem>
          {Array.from({ length: Math.min(pagesToShow, Math.ceil(venues.length / venuesPerPage)) }, (_, i) => {
            const pageNumber = currentPage - Math.floor(pagesToShow / 2) + i;
            return (
              pageNumber >= 1 && pageNumber <= Math.ceil(venues.length / venuesPerPage) && (
                <PaginationItem key={i}  >
                  <PaginationLink onClick={() => paginate(pageNumber)} className={cn({ 'border': pageNumber === currentPage, 'bg-gray-200': pageNumber !== currentPage }, 'hover:bg-gray-200')}>
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            );
          })}
          {currentPage < Math.ceil(venues.length / venuesPerPage) - pagesToShow + 1 && <PaginationEllipsis />}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(venues.length / venuesPerPage)))}
            >
              Next
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
