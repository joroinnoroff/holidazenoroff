import { CarFront, PawPrint, Settings, Star, Users, Utensils, Wifi } from "lucide-react";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useParams, Link } from "react-router-dom";

export default function VenuesID() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(0);

  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);


  const handleDateChange = (date) => {
    if (!calendarVisible) return; // Check if calendar is visible
    if (!dateFrom) {
      setDateFrom(date);
    } else {
      setDateTo(date);
    }
    console.log("Selected date:", date);
  };

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };


  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("Access token not found");
        }

        const url = `https://nf-api.onrender.com/api/v1/holidaze/venues/${id}?=true`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch venue");
        }

        const venueData = await response.json();
        setVenue(venueData);
      } catch (error) {
        console.error("Error fetching venue:", error);
      }
    };

    fetchVenue();
  }, [id]);

  // Function to handle click on media thumbnails
  const handleMediaClick = (index) => {
    setSelectedMedia(index); // Update selectedMedia state with the clicked index
  };

  if (!venue) {
    return <div>Loading...</div>;
  }



  return (
    <div className="w-full h-screen mb-20">
      {/* Render big preview of selected media */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2">
        <div className="">
          <img
            src={venue.media[selectedMedia]}
            alt={`Media ${selectedMedia}`}
            className="w-full xl:h-[35rem] rounded object-cover"
          />
          <div className="flex gap-4 mt-2">
            {venue.media.map((media, index) => (
              <div key={index} className=" ">
                <img
                  src={media}
                  alt={`Media ${index}`}
                  className="w-32 h-32 cursor-pointer object-cover rounded"
                  onClick={() => handleMediaClick(index)} // Call handleMediaClick function on click
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5 p-4">
          <h1 className="text-6xl font-semibold">{venue.name}</h1>
          <div className="w-2/6">
            <Link to={`/venues/edit/${id}`}><Settings strokeWidth={1.25} /></Link>
          </div>
          <h2 className="text-4xl font-extralight">About the venue:</h2>
          <p className="text-balance">{venue.description}</p>
          <div className="flex items-center gap-5">
            <p className="flex items-center gap-1"><Users />Guests: {venue.maxGuests}</p>
            {venue.rating !== 0 ? (
              <span className="flex items-center gap-1"><Star strokeWidth={1.25} />Rated: {venue.rating} </span>
            ) : (
              <span className="flex items-center gap-1"><Star strokeWidth={1.25} />New venue</span>
            )}
          </div>
          <div className="">
            <h3 className="text-xl opacity-65 font-extralight my-3">What this place offers</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Wifi strokeWidth={1.25} />
                <span className="ml-2">Wifi</span>
              </div>
              <div className="flex items-center">
                <PawPrint strokeWidth={1.25} />
                <span className="ml-2">Pets allowed</span>
              </div>
              <div className="flex items-center">
                <Utensils strokeWidth={1.25} />
                <span className="ml-2">Breakfast included</span>
              </div>
              <div className="flex items-center">
                <CarFront strokeWidth={1.25} />
                <span className="ml-2">Free parking</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button onClick={toggleCalendar}>
              {calendarVisible ? "Hide Calendar" : "Show Calendar"}
            </button>
          </div>
          {calendarVisible && (
            <div className="flex flex-col items-center justify-center mt-4">
              <Calendar
                onChange={handleDateChange}
                value={calendarVisible ? dateFrom : null} // Pass dateFrom as the value if calendarVisible is true, otherwise pass null
                selectRange={true}
                minDate={new Date()}
              />

              <div className="flex items-center justify-center mt-2">
                {/* Check if dateTo is a valid Date object before calling toLocaleDateString */}
                <p className="mr-2">Selected Dates: {dateFrom.toLocaleDateString()} - {dateTo instanceof Date ? dateTo.toLocaleDateString() : ''}</p>
                {/* Clear button to remove selected dates */}
                <button onClick={() => { setDateFrom(null); setDateTo(null); }}>Clear</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <hr className="my-5 w-full" />
      <div className="w-full h-3/5 flex items-center justify-center flex-col gap-4 ">
        <div className="w-[70%]">
          <h2 className="text-4xl">Where it's located</h2>
          <p className="opacity-65 font-extralight">{venue.location.address}, {venue.location.city}, {venue.location.country}</p>
        </div>
        <iframe
          src={`https://maps.google.com/maps?q=${venue.location.country},${venue.location.address}&hl=en&z=14&output=embed`}
          width="70%"
          height="400"
          frameBorder="0"
          style={{ border: 0, borderRadius: "5px" }}
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
          onLoad={() => console.log(`Map loaded with location: ${venue.location.lat}, ${venue.location.lng}`)}
        ></iframe>
      </div>
    </div>
  );

}
