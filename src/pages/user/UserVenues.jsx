import { PlusIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UsersBookings from '../../components/Bookings';

export default function UserVenues() {
  const [venues, setVenues] = useState([]);
  const [showBookings, setShowBookings] = useState(false); // State to toggle between venues and bookings


  useEffect(() => {
    const fetchData = async () => {
      // Retrieve user information from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const accessToken = localStorage.getItem('accessToken');
      const userName = user.name; // Assuming user has a 'name' property
      console.log(userName, accessToken);
      try {
        const response = await fetch(
          `https://nf-api.onrender.com/api/v1/holidaze/profiles/${userName}/venues?_bookings=true`,
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
        setVenues(data); // Assuming data is an array of venues
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure the effect runs only once

  return (
    <div className="p-5 md:w-3/4 m-auto">
      <button
        className={`rounded hover:opacity-90 transition-all hover:shadow-md ${!showBookings ? '' : 'bg-gray-400'}`}
        onClick={() => setShowBookings(false)}
      >
        Users Venues
      </button>
      <button
        className={`ml-5 rounded hover:opacity-90 transition-all hover:shadow-md ${showBookings ? '' : 'bg-gray-400'}`}
        onClick={() => setShowBookings(true)}
      >
        Users bookings
      </button>


      <Link
        to={"/user"}
        className={`ml-5 hover:opacity-90 transition-all hover:shadow-md rounded bg-gray-400 p-4 text-white`}
        onClick={() => setShowBookings(true)}
      >
        User Profile      </Link>
      <div className="w-full h-full mt-5">
        {showBookings ? (
          <div>
            <h1 className="text-3xl">Upcoming reservations</h1>
            <UsersBookings />
          </div>
        ) : (
          <div className="flex flex-col gap-10 justify-between">
            <h1 className="text-3xl">Your venues</h1>
            {venues.length === 0 ? (
              <div>
                <p>You have not created any venues yet, get started with clicking here</p>
                <Link to={"/Createvenues"}><button className='rounded-full flex items-center hover:opacity-90 transition-all hover:shadow-md mt-5'>Create venue<PlusIcon strokeWidth={1.25} /></button></Link>
              </div>
            ) : (
              <div className="flex flex-col gap-10 justify-between">
                {venues.map((venue) => (
                  <div className="border shadow-lg p-2 rounded-xl" key={venue.id}>
                    <h2 className="font-extralight text-xl">{venue.name}</h2>
                    <Link to={`/venues/edit/${venue.id}`}>
                      <span className="text-xs">Edit Venue</span>
                    </Link>
                    <div className="flex gap-10 items-center justify-end">
                      <img src={venue.media[0]} alt="" className="w-52" />
                    </div>
                    <div className="flex flex-col">
                      <span>{venue.location.country}</span>
                      <span>{venue.location.address}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

}
