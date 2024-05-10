import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
export default function UserVenues() {
  const [venues, setVenues] = useState([]);
  const id = useSearchParams()

  useEffect(() => {
    const fetchData = async () => {
      // Retrieve user information from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const accessToken = localStorage.getItem('accessToken');
      const userName = user.name; // Assuming user has a 'name' property
      console.log(userName, accessToken);
      try {
        const response = await fetch(`https://nf-api.onrender.com/api/v1/holidaze/profiles/${userName}/venues`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVenues(data); // Assuming data is an array of venues
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure the effect runs only once

  return (
    <div>
      <h2>User Venues</h2>
      <div className='w-full h-full mt-5'>
        <div className="flex flex-col gap-10 justify-between">
          {venues.map(venue => (
            <div className=' border-b' key={venue.id} >
              <h1 className='font-extralight list-decimal'>{venue.name} </h1>
              <Link to={`/bookings/${venue.id}`}><span className='text-xs'>Setup booking</span></Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
