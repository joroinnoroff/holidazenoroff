export default function CreateForm() {
  (
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
              <input type="name" name='name' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} placeholder='Cabin by the lake... Apartment in the' required
                value={formData.name}
              />
            </div>
            <p className="text-2xl font-bold">Get started</p>
            <h2 className="opacity-65 text-balance text-lg my-3">1 Share some basic info, like where it is and how many guests can stay.</h2>
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
          <button onClick={handleNextClick}>Next</button>
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
              <span className="text-xl font-semibold">{guestCount}</span>
              <button onClick={increaseGuestCount} className="px-4 py-2 bg-gray-300 rounded-md ml-2">+</button>
            </div>
          </div>
          <h2 className="text-lg font-semibold my-5">Essentials:</h2>
          <div className="flex items-center gap-10 ">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="" id="" className="h-4 w-4" />
              <label htmlFor="Wifi">Wifi</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="" id="" className="h-4 w-4" />
              <label htmlFor="breakfast">Breakfast</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="" id="" className="h-4 w-4" />
              <label htmlFor="pets">Pets</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="" id="" className="h-4 w-4" />
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
          <div className="w-4/5 my-5">
            {formData.media.map((url, index) => (
              <input
                key={index}
                type="url"
                name={`media-${index}`}
                value={url}
                onChange={(e) => handleMediaChange(index, e.target.value)}
                className="w-42"
                placeholder={`Image ${index + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-5 items-center mb-5">
            {currentPage > 2 && <div onClick={handlePrevClick}>Back</div>}
            <button onClick={handleNextClick}>Next</button>
          </div>
        </div>
      )}

      {currentPage === 4 && (
        <div className="h-full w-full">
          <span className="opacity-65 ">Click to edit if you wanna make changes, its also possible to edit venue later on.</span>
          <h2 className="text-2xl font-bold">Preview your Venue</h2>
          <span className="text-black opacity-65">Location: <input type="country" placeholder={formData.location.country} className="border-none w-32 h-5" /></span>
          <span className="text-black opacity-65">City: {formData.location.city}</span>
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
            <input type="name" name='name' className="bg-gray-50 border text-sm md:text-2xl border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} placeholder={formData.name}
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
            className="w-3/4 bg-gray-200 resize-none p-2"
            placeholder={formData.description}
          ></textarea>

          <div className="flex gap-5 items-center mb-5">
            {currentPage > 3 && <div onClick={handlePrevClick}>Back</div>}
            <button onClick={handleNextClick}>Next</button>
          </div>
        </div>



      )}


    </div>
  )
}