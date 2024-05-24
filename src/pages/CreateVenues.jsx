import { PlusIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import createAni from '../animations/Creating.json'
import Lottie from 'lottie-react'

export default function CreateVenues() {
  const [introModal, setIntroModal] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate(); // Initialize useNavigate
  const closeModal = () => {
    setIntroModal(false);
  };
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    media: ["", "",],
    price: 0,
    maxGuests: guestCount,
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
  const addMediaInput = () => {
    setFormData((prevData) => ({
      ...prevData,
      media: [...prevData.media, ''], // Add an empty string as a new media input field
    }));
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
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
    } else if (name === "price") {
      const price = parseFloat(value);
      setFormData((prevData) => ({
        ...prevData,
        price: isNaN(price) ? 0 : price,
      }));
    } else if (name === "rating") { // Add condition for rating field
      const rating = parseFloat(value); // Convert value to a number
      setFormData((prevData) => ({
        ...prevData,
        rating: isNaN(rating) ? 0 : rating, // Set rating to 0 if conversion fails
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };


  useEffect(() => {
    console.log(formData); // Logging the formData for debugging
  }, [formData]); // Add useEffect to log formData when it changes




  const handleMediaChange = (index, value) => {
    // Validate the URL format before updating the state
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



  const increaseGuestCount = () => {
    setGuestCount((prevCount) => prevCount + 1);
    setFormData((prevData) => ({
      ...prevData,
      maxGuests: guestCount + 1,
    }));
  };

  const decreaseGuestCount = () => {
    if (guestCount > 1) {
      setGuestCount((prevCount) => prevCount - 1);
      setFormData((prevData) => ({
        ...prevData,
        maxGuests: guestCount - 1,
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    try {
      // Set isCreating to true to render "Creating..." message and Lottie animation
      setIsCreating(true);

      // Retrieve access token from localStorage
      const accessToken = localStorage.getItem('accessToken');
      console.log(accessToken)
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const url = "https://nf-api.onrender.com/api/v1/holidaze/venues";

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData), // Convert formData to JSON string
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Venue created successfully:', responseData);

      toast.success(`venue ${responseData.name} venue created`);

      // Simulate creation process with a delay
      setTimeout(() => {
        navigate("/user/venues");
        // Reset isCreating back to false when submission process is completed
        setIsCreating(false);
      }, 8000);

      // Optionally, you can reset the form data or perform other actions after successful submission
    } catch (error) {
      console.error('Error creating venue:', error);
      // Ensure isCreating is set back to false in case of error
      setIsCreating(false);
    }
  };


  const handleNextClick = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevClick = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };



  return (
    <div>
      <Toaster position="top-right" />
      {introModal && (
        <div className="modal bg-gray-100 h-screen w-full fixed z-10 top-0 grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 flex items-center justify-center">
            {/* Column 1 (left) */}
            <h1 className="text-7xl font-bold text-balance">It's easy to create venues</h1>
          </div>
          <div className="p-8 flex items-start justify-center flex-col space-y-10">
            {/* Column 2 (right) */}
            <div className="h-32 border-b ">
              <h2 className="text-2xl font-bold">1 Tell us about your place</h2>
              <p className="opacity-65 text-balance">Share some basic info, like where it is and how many guests can stay.</p>
            </div>
            <div className="h-32 border-b ">
              <h2 className="text-2xl font-bold">2 Make it stand out</h2>
              <p className="opacity-65 text-balance">Add 5 or more photos plus a title and description—we'll help you out.</p>
            </div>
            <div className="h-32 ">
              <h2 className="text-2xl font-bold">3 Finish up and publish</h2>
              <p className="opacity-65 text-balance">Choose if you'd like to start with an experienced guest, set a starting price, and publish your listing.</p>
            </div>
          </div>
          <button onClick={closeModal} className="absolute bottom-10 right-10 rounded-full">Get started</button>
          <div onClick={() => setIntroModal(false)} className="absolute top-10 right-10 border py-2 px-5 opacity-65 rounded-full">Exit</div>
        </div>
      )}

      <div>
        <form action="" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2">

            <div className="p-8 flex items-center justify-center">
              {/* Column 1 (left) */}
              <h1 className="text-7xl font-bold text-balance">Fill out the form and let thousands explore your venue</h1>
            </div>

            {currentPage === 1 && (
              <div className="p-8 flex items-start justify-center flex-col space-y-10">

                {/* Column 2 (right) */}
                <div className="h-full border-b ">
                  <p className="text-2xl font-bold">Set a name for your venue</p>
                  <h2 className="opacity-65 text-balance text-lg my-3">Give a simple yet descriptive name of your venue</h2>
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 start-0 flex items-center justify-center ps-3.5 pointer-events-none">
                      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M13 2h2v2h1v19h1v-15l6 3v12h1v1h-24v-1h1v-11h7v11h1v-19h1v-2h2v-2h1v2zm8 21v-2h-2v2h2zm-15 0v-2h-3v2h3zm8 0v-2h-3v2h3zm-2-4v-13h-1v13h1zm9 0v-1h-2v1h2zm-18 0v-2h-1v2h1zm4 0v-2h-1v2h1zm-2 0v-2h-1v2h1zm9 0v-13h-1v13h1zm7-2v-1h-2v1h2zm-18-1v-2h-1v2h1zm2 0v-2h-1v2h1zm2 0v-2h-1v2h1zm14-1v-1h-2v1h2zm0-2.139v-1h-2v1h2z" /></svg>
                    </div>
                    <input type="name" name='name' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} placeholder='Cabin by the lake... Apartment in the city..' required
                      value={formData.name}
                    />
                  </div>
                  <p className="text-2xl font-bold">Get started</p>
                  <h2 className="opacity-65 text-balance text-lg my-3">Share some basic info, like where it is and how many guests can stay.</h2>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    cols="30"
                    rows="10"
                    className="w-full bg-gray-200 resize-none text-center"
                    placeholder="My venue is located in the center of ..."
                  ></textarea>
                </div>

                <h2>Has it been rated ? if so set your current rating here.</h2>
                <input type="number" value={formData.rating} onChange={handleChange} placeholder="Set your Rating here" id="rating" name="rating" />
                <button onClick={handleNextClick} className="rounded">Next</button>
              </div>
            )}

            {currentPage === 2 && (
              <div className="w-full">
                <h2 className="text-2xl font-bold mb-2">Where's your place located?</h2>
                <p>Your address is only shared with guests after they&apos;ve made a reservation.</p>
                <div className="w-4/6 h-72 rounded mb-3 bg-blue-400 flex items-center justify-center flex-wrap">
                  <div className="relative my-6 w-3/4">
                    <div className="absolute inset-y-0 start-0 flex items-center justify-center ps-3.5 pointer-events-none">
                      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M12 10c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2m0-5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3m-7 2.602c0-3.517 3.271-6.602 7-6.602s7 3.085 7 6.602c0 3.455-2.563 7.543-7 14.527-4.489-7.073-7-11.072-7-14.527m7-7.602c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602" /></svg>

                    </div>
                    <input type="text" name="location.country" className="bg-gray-50 border text-sm md:text-2xl border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded" onChange={handleChange} placeholder="Enter your Country" value={formData.location.country} />
                  </div>

                  <input type="text" name="location.address" id="address" className="border w-3/4 p-2 rounded" placeholder="Enter your Address" onChange={handleChange} value={formData.location.address} />
                  <input type="text" name="location.city" id="city" className="border w-3/4 p-2 rounded" placeholder="Enter your City" onChange={handleChange} value={formData.location.city} />
                  <input type="text" name="location.zip" id="zip" className="border w-3/4 p-2 rounded" placeholder="Enter your Zip" onChange={handleChange} value={formData.location.zip} />

                </div>
                <div className="text-center mt-8 w-4/6 ">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold mb-2">Max Guests</h2>
                    <button onClick={decreaseGuestCount} className="px-4 py-2 bg-gray-300 rounded-md mr-2">-</button>
                    <span className="text-xl font-semibold" value>{formData.maxGuests}
                      <input type="number" name="maxGuests" value={formData.maxGuests} onChange={handleChange} placeholder={formData.maxGuests} />
                    </span>


                    <button onClick={increaseGuestCount} className="px-4 py-2 bg-gray-300 rounded-md ml-2">+</button>
                  </div>
                </div>
                <h2 className="text-lg font-semibold my-5">Essentials:</h2>
                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="wifi"
                      id="wifi"
                      className="h-4 w-4"
                      checked={formData.meta.wifi}
                      onChange={handleChange}
                    />
                    <label htmlFor="wifi">Wifi</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="breakfast"
                      id="breakfast"
                      className="h-4 w-4"
                      checked={formData.meta.breakfast}
                      onChange={handleChange}
                    />
                    <label htmlFor="breakfast">Breakfast</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="pets"
                      id="pets"
                      className="h-4 w-4"
                      checked={formData.meta.pets}
                      onChange={handleChange}
                    />
                    <label htmlFor="pets">Pets</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="parking"
                      id="parking"
                      className="h-4 w-4"
                      checked={formData.meta.parking}
                      onChange={handleChange}
                    />
                    <label htmlFor="parking">Parking</label>
                  </div>




                </div>
                <div className="flex gap-5">
                  {currentPage > 1 && <button onClick={handlePrevClick}>Back</button>}
                  <button onClick={handleNextClick}>Next</button>
                </div>
              </div>
            )}

            {currentPage === 3 && (
              <div className="h-full border-b ">
                <p className="text-2xl font-bold">Make it stand out</p>
                <h2 className="opacity-65 text-balance text-lg my-3"> Add 5 or more photos plus a title and description</h2>
                <div className="flex gap-2 flex-wrap">
                  {formData.media.map((url, index) => (
                    url ? (
                      <div key={index} className="w-32 h-32 bg-gray-400 rounded" style={{ backgroundImage: `url(${url})`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
                    ) : (
                      <div key={index} className="w-32 h-32 bg-gray-400 rounded"></div>
                    )
                  ))}
                </div>
                <p className="opacity-65 text-lg my-3">Copy and paste your image url</p>
                <div className="flex flex-wrap gap-2">
                  {formData.media.map((url, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="url"
                        name={`media-${index}`}
                        value={url}
                        onChange={(e) => handleMediaChange(index, e.target.value)}
                        className="border w-64 p-2 rounded"
                        placeholder={`Image ${index + 1}`}
                      />
                      {index === formData.media.length - 1 && ( // Render the "plus" button next to the last input field
                        <button onClick={addMediaInput} className="rounded-full w-12 h-12 flex items-center">
                          <PlusIcon />
                        </button>
                      )}
                    </div>
                  ))}
                </div>



                <div>
                  <h2>Set a price</h2>
                  <input type="number" name="price" placeholder="Set your price" onChange={handleChange} value={formData.price} />

                </div>
                <div className="flex gap-5 items-center mb-5">
                  {currentPage > 2 && <div onClick={handlePrevClick}>Back</div>}
                  <button onClick={handleNextClick}>Next</button>
                </div>
              </div>
            )}

            {currentPage === 4 && (
              <>
                {isCreating ? (
                  <div>
                    <h1>Creating {formData.name}</h1>
                    <Lottie animationData={createAni} />
                  </div>
                ) : (
                  <div className="h-full w-full">
                    <h2 className="text-2xl md:text-4xl font-bold mb-10">Preview your Venue</h2>
                    <span className="opacity-65 w-3/4 block ">Click to edit if you wanna make changes now, its also possible to edit venue later once posted.</span>
                    <div className="flex items-center my-5">
                      <span className="text-black opacity-65">Location: <input type="text" name="location.country" className="bg-gray-50 border text-sm md:text-2xl w-3/4 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block border-none ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded" onChange={handleChange} placeholder={formData.location.country} value={formData.location.country} /></span>
                      <span className="text-black opacity-65">City:                   <input type="text" name="location.city" id="city" className="bg-gray-50 border text-sm md:text-2xl w-3/4 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block border-none ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded" placeholder={formData.location.city} onChange={handleChange} value={formData.location.city} /></span>
                      <span className="text-black opacity-65">Zip:          <input type="text" name="location.zip" id="zip" className="border w-3/4 p-2 rounded" placeholder="Enter your Zip" onChange={handleChange} value={formData.location.zip} />                    </span>
                    </div>
                    <p> Maximum amount of people: {formData.maxGuests} </p>
                    <div className="flex gap-2 flex-wrap my-5">
                      {formData.media.map((url, index) => (
                        url ? (
                          <div key={index} className="w-32 h-32 bg-gray-400 rounded" style={{ backgroundImage: `url(${url})`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
                        ) : (
                          <div key={index} className="w-32 h-32 bg-gray-400 rounded"></div>
                        )
                      ))}
                    </div>
                    <div className="relative my-6 w-3/4">
                      <div className="absolute inset-y-0 start-0 flex items-center justify-center ps-3.5 pointer-events-none">
                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M13 2h2v2h1v19h1v-15l6 3v12h1v1h-24v-1h1v-11h7v11h1v-19h1v-2h2v-2h1v2zm8 21v-2h-2v2h2zm-15 0v-2h-3v2h3zm8 0v-2h-3v2h3zm-2-4v-13h-1v13h1zm9 0v-1h-2v1h2zm-18 0v-2h-1v2h1zm4 0v-2h-1v2h1zm-2 0v-2h-1v2h1zm9 0v-13h-1v13h1zm7-2v-1h-2v1h2zm-18-1v-2h-1v2h1zm2 0v-2h-1v2h1zm2 0v-2h-1v2h1zm14-1v-1h-2v1h2zm0-2.139v-1h-2v1h2z" /></svg>
                      </div>
                      <input type="name" name='name' className="bg-gray-50 border-none text-sm md:text-4xl border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} placeholder={formData.name} value={formData.name} />
                    </div>
                    <h2 className="text-2xl font-bold my-6">The description about your place</h2>
                    <textarea name="description" value={formData.description} onChange={handleChange} cols="30" rows="10" className="w-3/4 my-5 resize-none p-2 font-light" placeholder={formData.description}></textarea>
                    <p>Essentials</p>
                    <div>
                      {formData.meta.wifi ? (
                        <div>The venue does have Wifi</div>
                      ) : (
                        <div>The venue does not have Wifi</div>
                      )}
                    </div>
                    <div>
                      {formData.meta.breakfast ? (
                        <div>Breakfast is included</div>
                      ) : (
                        <div>Breakfast is not included</div>
                      )}
                    </div>
                    <div>
                      {formData.meta.pets ? (
                        <div>Pets are allowed</div>
                      ) : (
                        <div>Pets are not allowed</div>
                      )}
                    </div>
                    <div>
                      {formData.meta.parking ? (
                        <div>Parking space is included</div>
                      ) : (
                        <div>Parking space is not included</div>
                      )}
                    </div>
                    <div className="flex gap-5 items-center mb-5">
                      {currentPage > 3 && <div onClick={handlePrevClick}>Back</div>}
                      <button type="submit" className="rounded-full hover:shadow-xl transition-all">Create venue</button>
                    </div>
                  </div>
                )}
              </>
            )}



          </div>
        </form>
      </div >
    </div >
  );
}
