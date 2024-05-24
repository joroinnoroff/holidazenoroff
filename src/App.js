import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './globals.css';
import { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import VenuesID from './pages/venues/[id]';
import CreateVenues from './pages/CreateVenues';
import EditVenue from './pages/venues/edit/EditVenue';
import UserVenues from './pages/user/UserVenues';
import UserProfile from './pages/user/UserProfile';

function App() {
  const [user, setUser] = useState(null);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchUserProfile(accessToken);
    }
  }, []);

  const fetchUserProfile = async (accessToken) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {
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
        setUser(userProfileData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  return (
    <Router>
      <div>
        <NavBar user={user} setUser={setUser} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage setVenues={setVenues} />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/venues/:id" element={<VenuesID user={user} />} />
          <Route path="/venues/edit/:id" element={<EditVenue />} />
          <Route path="/user/venues" element={<UserVenues venues={venues} />} />
          <Route path="/user" element={<UserProfile venues={venues} setUser={setUser} />} />
          <Route path="/createvenues" element={<CreateVenues />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
