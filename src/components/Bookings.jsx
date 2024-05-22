import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function UsersBookings() {
  const [bookings, setBookings] = useState([]);
  const id = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      // Retrieve user information from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const accessToken = localStorage.getItem('accessToken');
      const userName = user.name; // Assuming user has a 'name' property
      console.log(userName, accessToken);
      try {
        const response = await fetch(
          `https://nf-api.onrender.com/api/v1/holidaze/profiles/${userName}/bookings?_venue=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        // Assuming data is an array of bookings
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure the effect runs only once

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust the format as needed
  };

  return (
    <div className=' m-auto'>
      <div className='w-full h-full mt-5'>
        {bookings.length === 0 ? (
          <p className='m-0'>You have no bookings yet</p>
        ) : (
          <div className='flex flex-col gap-10 justify-between'>
            {bookings.map((item) => (
              <div className='border shadow-lg p-2 rounded-xl' key={item.id}>
                <h1 className='font-extralight text-xl'>{item.venue.name}</h1>
                <p className='font-extralight'>
                  Check in <span>{formatDate(item.dateFrom)}</span>
                </p>
                <p className='font-extralight'>
                  Check out <span>{formatDate(item.dateTo)}</span>
                </p>
                <p>Guests: {item.guests}</p>
                <Link to={`/bookings/create/${item.id}`}>
                  <span className='text-xs'>View Venue</span>
                </Link>
                <Link to={`/venues/edit/${item.id}`}>
                  <span className='text-xs'>Edit Booking</span>
                </Link>
                <div className='flex gap-10 items-end justify-end'>
                  <img src={item.venue.media[0]} alt="" className='w-72 h-full rounded' />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}