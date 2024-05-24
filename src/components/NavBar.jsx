// NavBar.js
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { PlusIcon } from 'lucide-react';

export default function NavBar() {
  const [user, updateUser] = useState(null);




  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchUserProfile(accessToken);
    }
  }, []);

  const fetchUserProfile = async (accessToken) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const username = userData.name;

      const url = `https://nf-api.onrender.com/api/v1/holidaze/profiles/${username}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userProfileData = await response.json();
      updateUser(userProfileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('accessToken');
    updateUser(null);

  };

  return (
    <div className={`flex justify-between items-center p-4 ${!user ? 'absolute top-0 left-0 right-0' : ''}`}>
      {user ? (
        <div className='flex gap-5 items-center flex-wrap'>
          <img src="/assets/LOGO.png" width={100} height={150} alt="Logo" className='md:w-[200px]' />
          <Link to={"/user/venues"}>
            <button className='rounded-full w-52 hover:opacity-90 transition-all hover:shadow-md'>{user.name}</button>
          </Link>
          <Link to={`/CreateVenues`} title="Create Venue">
            <button className='rounded-full hover:opacity-90 transition-all hover:shadow-md'><PlusIcon strokeWidth={1.25} /></button>
          </Link>
          <Link to={"/Dashboard"}>All venues</Link>
          <Link to={"/"} onClick={handleSignOut}>Sign out</Link>
        </div>
      ) : (
        <div className='flex gap-4 absolute z-10 top-10'>
          <Link to="/login">
            <button className='rounded-full uppercase'>Login</button>
          </Link>
          <Link to="/register">
            <button className='rounded-full uppercase'>Sign Up</button>
          </Link>
        </div>
      )}


    </div>
  );
}
