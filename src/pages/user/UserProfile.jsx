import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UserProfile() {
  const [user, updateUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false)

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
      setAvatarUrl(userProfileData.avatar || '');
      console.log(userProfileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('accessToken');
    updateUser(null);
  };



  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('No access token found');
      return;
    }

    try {
      const response = await fetch(`https://nf-api.onrender.com/api/v1/holidaze/profiles/${user.name}/media`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ avatar: avatarUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors.map(error => error.message).join(', '));
      }

      const updatedUserProfile = await response.json();
      updateUser(updatedUserProfile);
      setAvatarUrl('');
      setShowAvatarInput(false);
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const handleVenueManagerChange = async (e) => {
    const checked = e.target.checked;
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('No access token found');
      return;
    }

    try {
      const response = await fetch(`https://nf-api.onrender.com/api/v1/holidaze/profiles/${user.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ venueManager: checked }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors.map(error => error.message).join(', '));
      }

      const updatedUserProfile = await response.json();
      updateUser(updatedUserProfile);
      setIsVenueManager(checked);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    }
  };


  return (
    <div className="h-full w-full p-4">
      {user ? (
        <div>
          <h1 className="text-6xl">Edit your profile here</h1>
          {user.avatar && (
            <img src={user.avatar || ''} alt="User Avatar" className="w-52" />
          )}

          <h2>{user.name}</h2>
          <span>{user.email}</span>

          {user.avatar && !showAvatarInput && (
            <button onClick={() => setShowAvatarInput(true)}>Change Avatar</button>
          )}
          {user.venueManager ? (
            <p>You are a venue manager.</p>
          ) : (
            <div className="my-5 flex gap-2">
              <input
                type="checkbox"
                id="VenueManagerCheckbox"

                onChange={handleVenueManagerChange}
              />
              <label htmlFor="VenueManagerCheckbox">Wanna create Venues?</label>
            </div>
          )}

          {showAvatarInput && (
            <form onSubmit={handleAvatarSubmit}>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Enter avatar URL"
                required
              />
              <button type="submit">Update Avatar</button>
            </form>
          )}

          {!user.avatar && (
            <form onSubmit={handleAvatarSubmit} className="">
              <div className="flex flex-col w-3/12">
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Enter avatar URL"
                  required
                />
                <button type="submit">Update Avatar</button>

              </div>
            </form>
          )}





          {/* Add additional user details and logic here */}
        </div>
      ) : (
        <div>No user data available</div>
      )}

    </div>
  );
}
