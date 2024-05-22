import React, { useEffect, useState } from 'react';
import style from './DashStyle/style.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import 'swiper/css/pagination';
import { Star } from 'lucide-react';
import GetAllvenues from '../components/AllVenues';



export default function DashboardPage() {
  const [venues, setVenues] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const url = 'https://nf-api.onrender.com/api/v1/holidaze/venues?_&_sortOrder=desc';
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch venues');
        }

        const venuesData = await response.json();
        // Filter venues with rating >= 4 and with media
        const filteredVenues = venuesData.filter(venue => venue.rating >= 4 && venue.media && venue.media.length > 0);
        setVenues(filteredVenues);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();

    // Fetch user info
    const userData = JSON.parse(localStorage.getItem('user'));
    setUserInfo(userData);
  }, []);

  return (
    <>
      <div className='w-full h-full'>

        <GetAllvenues />


        <h2>Top Rated</h2>
      </div>
      <Swiper
        spaceBetween={0}
        slidesPerView={2} // Change this to 2
        centeredSlides={true} // Center the active slide
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        navigation={true} // Add navigation

        modules={[Navigation, Pagination, Scrollbar, A11y]}
      >

        {venues.map((venue, index) => (
          <SwiperSlide key={index}>
            <div className={style.SliderCon}>
              {venue.media && venue.media.length > 0 && (
                <img src={venue.media[0]} alt="" />
              )}
            </div>
            <h2>{venue.name}</h2>
            <span>{venue.price}$</span>
            <p><Star /> {venue.rating}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
