


import { cn } from "../../../lib/utils";
import { MapPin, MinusCircle, PlusCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast, Toaster } from "sonner";

export default function EditVenue() {
  const [isSaving, setIsSaving] = useState(false); // Step 1: State variable to track saving status
  const { id } = useParams();
  const [guestCount, setGuestCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  // Function to validate URL format
  const isValidURL = (url) => {
    // Regular expression to check if the URL format is valid
    const urlPattern = new RegExp('^(https?://)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!urlPattern.test(url);
  };

  const addMediaInput = () => {
    setFormData((prevData) => ({
      ...prevData,
      media: [...prevData.media, ''],
    }));
  };

  const removeMediaInput = (index) => {
    setFormData((prevData) => {
      const updatedMedia = [...prevData.media];
      updatedMedia.splice(index, 1);
      return {
        ...prevData,
        media: updatedMedia,
      };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        meta: {
          ...prevData.meta,
          [name]: checked,
        },
      }));
    } else if (name.includes("location.")) {
      const locationField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          [locationField]: value,
        },
      }));
    } else if (name === 'price') {
      const price = parseFloat(value);
      setFormData((prevData) => ({
        ...prevData,
        price: isNaN(price) ? 0 : price,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleMediaChange = (index, value) => {
    if (value.trim() === '' || isValidURL(value)) {
      setFormData((prevData) => {
        const updatedMedia = [...prevData.media];
        updatedMedia[index] = value;
        return {
          ...prevData,
          media: updatedMedia,
        };
      });
    }
  };

  const increaseGuestCount = () => {
    setGuestCount((prevCount) => prevCount + 1); // Update displayed guest count
    setFormData((prevData) => ({
      ...prevData,
      maxGuests: prevData.maxGuests + 1, // Update maxGuests value in formData
    }));
  };

  const decreaseGuestCount = () => {
    if (guestCount > 1) {
      setGuestCount((prevCount) => prevCount - 1); // Update displayed guest count
      setFormData((prevData) => ({
        ...prevData,
        maxGuests: prevData.maxGuests - 1, // Update maxGuests value in formData
      }));
    }
  };



  const [formData, setFormData] = useState({
    name: "",
    description: "",
    media: [""],
    price: 0,
    maxGuests: 1, // Initialize maxGuests to 1
    rating: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
      lat: 0,
      lng: 0,
    },
  });

  useEffect(() => {
    handleSubmit();
  }, []);

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault(); // Prevent form submission from reloading the page
    }
    setIsSaving(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const user = JSON.parse(localStorage.getItem("user"));

      let url = `https://nf-api.onrender.com/api/v1/holidaze/venues/${id}?_owner=true&_bookings=false`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch venue data");
      }

      const venueData = await response.json();

      if (venueData.owner.name !== user.name) {
        throw new Error("You are not authorized to edit this venue.");
      }

      setFormData({
        ...formData,
        name: venueData.name,
        description: venueData.description,
        maxGuests: venueData.maxGuests, // Set maxGuests based on fetched data
        location: venueData.location,
        media: venueData.media,
        price: venueData.price
      });

      // Set the initial guest count based on the fetched data
      setGuestCount(venueData.maxGuests);

      // PUT request to update venue data
      const updateResponse = await fetch(url, {
        method: "PUT", // Use PUT method for updating
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData), // Send updated form data
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update venue data");
      }

      toast.success("Changes saved successfully!"); // Optionally, display success message
    } catch (error) {
      console.error("Error updating venue data:", error);
      toast.error("Failed to save changes. Please try again."); // Optionally, display error message
    } finally {
      setIsSaving(false); // Reset saving status regardless of success or failure
    }
  };




  return (
    <div>
      <Toaster position="top-right" richColors />
      <div>
        <form action="" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 flex items-center justify-center">
              <h1 className="text-7xl font-bold text-balance">Update and manage your booking here</h1>
            </div>
            <div className="h-full w-full">
              <h2 className="text-2xl md:text-4xl font-bold mb-10">Edit your Venue</h2>
              <span className="opacity-65 w-3/4 block ">Click to edit and hit save changes.</span>
              <div className="flex items-center my-5">
                <span className="text-black opacity-65">Location: <input type="text" name="location.country" className="bg-gray-50 border text-sm md:text-2xl w-3/4 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block border-none ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded" onChange={handleChange} placeholder={formData.location.country} value={formData.location.country} /></span>
                <span className="text-black opacity-65">City: <input type="text" name="location.city" id="city" className="bg-gray-50 border text-sm md:text-2xl w-3/4 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block border-none ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded" placeholder={formData.location.city} onChange={handleChange} value={formData.location.city} /></span>
              </div>
              <span className="text-black opacity-65">Adress: <input type="text" name="location.adress" id="adress" className="bg-gray-50 border text-sm md:text-2xl w-3/4 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block border-none ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded" placeholder={formData.location.address} onChange={handleChange} value={formData.location.address} /></span>
              <p>Price                   <input type="number" name="price" placeholder={formData.price} onChange={handleChange} value={formData.price} /></p>
              <p> Maximum amount of people: {guestCount} </p>
              <button className="rounded-full text-xs" onClick={increaseGuestCount} >Add more guests</button>
              <button className="rounded-full text-xs" onClick={decreaseGuestCount} >Remove a guest</button>
              <div className="flex gap-2 flex-wrap my-5">
                {formData.media.map((url, index) => (
                  url ? (
                    <div key={index} className="w-72 h-52 bg-gray-400 rounded" style={{ backgroundImage: `url(${url})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                      <input
                        key={index}
                        type="url"
                        name={`media-${index}`}
                        value={url}
                        onChange={(e) => handleMediaChange(index, e.target.value)}
                        className="w-42"
                        placeholder={`Image ${index + 1}`}
                      />
                      <div className="cursor-pointer" onClick={() => removeMediaInput(index)}>
                        <MinusCircle />
                      </div>
                      <div className="cursor-pointer" onClick={addMediaInput}>
                        <PlusCircle />
                      </div>
                    </div>
                  ) : (
                    <div key={index} className="w-32 h-32 bg-gray-400 rounded">
                      <input
                        key={index}
                        type="url"
                        name={`media-${index}`}
                        value={url}
                        onChange={(e) => handleMediaChange(index, e.target.value)}
                        className="w-42"
                        placeholder={`Image ${index + 1}`}
                      />
                    </div>
                  )
                ))}
              </div>
              <div className="w-4/5 my-5">
              </div>
              <div className="relative my-6 w-3/4">
                <div className="absolute inset-y-0 start-0 flex items-center justify-center ps-3.5 pointer-events-none">
                  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M13 2h2v2h1v19h1v-15l6 3v12h1v1h-24v-1h1v-11h7v11h1v-19h1v-2h2v-2h1v2zm8 21v-2h-2v2h2zm-15 0v-2h-3v2h3zm8 0v-2h-3v2h3zm-2-4v-13h-1v13h1zm9 0v-1h-2v1h2zm-18 0v-2h-1v2h1zm4 0v-2h-1v2h1zm-2 0v-2h-1v2h1zm9 0v-13h-1v13h1zm7-2v-1h-2v1h2zm-18-1v-2h-1v2h1zm2 0v-2h-1v2h1zm2 0v-2h-1v2h1zm14-1v-1h-2v1h2zm0-2.139v-1h-2v1h2z" /></svg>
                </div>
                <input type="name" name='name' className="bg-gray-50 border-none text-sm md:text-4xl border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} placeholder={formData.name}
                  value={formData.name}
                />
              </div>
              <h2 className="text-2xl font-bold my-6">The description about your place</h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                cols="30"
                rows="10"
                className="w-3/4 my-5 resize-none p-2 font-light"
                placeholder={formData.description}
              ></textarea>
              <div className="flex gap-5 items-center mb-5">
                <button type="submit" className="rounded-full hover:shadow-xl transition-all" title={isSaving ? 'Saving...' : 'Save changes'}>
                  {isSaving ? 'Saving...' : 'Save changes'}
                </button>


              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
