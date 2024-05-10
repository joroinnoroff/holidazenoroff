// NavBar.js
import { useEffect, useState } from 'react';
import style from './_styles/NavbarStyle/style.module.css';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../_components/ui/dropdown-menu"
import { UserIcon } from 'lucide-react';


export default function NavBar({ setUser }) {
  const [user, updateUser] = useState(null); // Rename setUser to updateUser

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Fetch user profile data using the access token
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
      updateUser(userProfileData); // Use updateUser to set the state

    } catch (error) {
      console.error('Error fetching user profile:', error);

    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('accessToken');
    updateUser(null); // Use updateUser to set the state
    window.location.href("/")
  };

  return (
    <div className={style.Navigation}>
      <img src="/assets/LOGO.png" width={250} height={150} alt="Logo" />
      {user ? (
        <div className='flex gap-5'>
          <Link to={"/profile/edit"}>
            <button className='rounded-full w-52'>{user.name}</button>
          </Link>
          <Link to={`/CreateVenues`} title="Create Venue">
            <button className='rounded-full w-20 '>
              +
            </button>
          </Link>

          <Link to={"/Dashboard"}>All venues</Link>

        </div>
      ) : (
        <div className={style.Buttons}>




        </div>
      )}
    </div>
  );
}
