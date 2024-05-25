import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import Calendar from "react-calendar";
import { toast } from "sonner";

export default function DatePicker({ id, venue }) {
  const [showCalendar, setShowCalendar] = useState(true);
  const [formData, setFormData] = useState({
    id: id,
    dateTo: "",
    dateFrom: "",
    guests: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      // Access form data from state
      const { id, dateFrom, dateTo, guests } = formData;

      // Perform any necessary validation here
      if (!dateFrom || !dateTo || !guests) {
        throw new Error("All fields must be filled out");
      }

      if (guests > venue.maxGuests) {
        toast.error(`Max amount of guests is ${venue.maxGuests} people`);
        return;
      }

      // Create request body
      const requestBody = {
        venueId: id,
        dateFrom: dateFrom,
        dateTo: dateTo,
        guests: guests
      };

      const response = await fetch("https://nf-api.onrender.com/api/v1/holidaze/bookings?_customer=true&_venue=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}` // Include Authorization header
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      toast.success(`Booking from ${dateFrom} to ${dateTo} successful`);
      console.log("Form Data:", formData);

      // Reset form data after successful submission
      setFormData({
        venueId: id,
        dateTo: "",
        dateFrom: "",
        guests: 0
      });

    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Error submitting form");
    }
  };

  const handleDateChange = (dates) => {
    if (Array.isArray(dates) && dates.length === 2) {
      const dateFrom = new Date(dates[0].getTime() - dates[0].getTimezoneOffset() * 60000);
      const dateTo = new Date(dates[1].getTime() - dates[1].getTimezoneOffset() * 60000);
      setFormData({
        ...formData,
        dateFrom: dateFrom.toISOString().split('T')[0],
        dateTo: dateTo.toISOString().split('T')[0]
      });
    } else if (dates instanceof Date) {
      const dateFrom = new Date(dates.getTime() - dates.getTimezoneOffset() * 60000);
      setFormData({
        ...formData,
        dateFrom: dateFrom.toISOString().split('T')[0],
        dateTo: ""
      });
    } else {
      setFormData({
        ...formData,
        dateFrom: "",
        dateTo: ""
      });
    }
  };

  const getCalendarValue = () => {
    const { dateFrom, dateTo } = formData;
    if (dateFrom && dateTo) {
      return [new Date(dateFrom), new Date(dateTo)];
    } else if (dateFrom) {
      return new Date(dateFrom);
    } else {
      return null;
    }
  };

  const incrementGuests = () => {
    setFormData((prevData) => ({
      ...prevData,
      guests: prevData.guests + 1
    }));
  };

  const decrementGuests = () => {
    setFormData((prevData) => ({
      ...prevData,
      guests: prevData.guests > 0 ? prevData.guests - 1 : 0
    }));
  };

  return (
    <div className='w-full h-auto'>


      {showCalendar ? (

        <button onClick={() => setShowCalendar(false)} className="rounded">View Calendar</button>

      ) : (
        <div>
          <button onClick={() => setShowCalendar(true)} className="rounded">Hide Calendar</button>
          <form onSubmit={handleSubmit}>
            {formData.dateFrom && formData.dateTo ? (
              <div className=' text-2xl my-5'>
                <span className='bold'>Check-in:</span>{' '}
                {new Date(formData.dateFrom).toDateString()}
                &nbsp;|&nbsp;
                <span className='bold'>Check-out:</span> {new Date(formData.dateTo).toDateString()}
              </div>
            ) : (
              <div className=' text-2xl my-5'>
                <span className='bold'>Selected date:</span>{' '}
                {formData.dateFrom && new Date(formData.dateFrom).toDateString()}
                {formData.dateTo && <>&nbsp;|&nbsp;{new Date(formData.dateTo).toDateString()}</>}
              </div>
            )}
            <div className='calendar-container'>
              <Calendar
                onChange={handleDateChange}
                value={getCalendarValue()}
                selectRange={true}
                tileClassName={({ date, view }) => {
                  const dateFrom = formData.dateFrom ? new Date(formData.dateFrom) : null;
                  const dateTo = formData.dateTo ? new Date(formData.dateTo) : null;
                  if (dateFrom && dateTo && view === 'month') {
                    return (date >= dateFrom && date <= dateTo) ? 'highlight' : null;
                  }
                  return null;
                }}
              />
            </div>
            <p className="my-5">How many guests ?</p>
            <div className="my-5 flex items-center gap-2">
              <input
                type="number"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: +e.target.value })}
                placeholder="Number of guests"
              />

              <button type="button" className="rounded-full" onClick={incrementGuests}><PlusIcon /></button>
              <button type="button" className="rounded-full" onClick={decrementGuests}><MinusIcon /></button>
            </div>
            <button type="submit" className="rounded">Submit</button>
          </form>
        </div>
      )}



    </div>
  );
}
