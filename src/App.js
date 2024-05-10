import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './globals.css';
import { useState } from 'react';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import VenuesID from './pages/venues/[id]';
import CreateVenues from './pages/CreateVenues';
import EditVenue from './pages/venues/edit/EditVenue';
import UserVenues from './pages/user/UserVenues';


function App() {
  const [user, setUser] = useState(null);
  const [venues, setVenues] = useState([]);

  return (
    <Router>
      <div>
        <NavBar user={user} setUser={setUser} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={<DashboardPage setVenues={setVenues} />}
          />
          <Route path="/" element={<LandingPage />} />
          <Route path="/venues/:id" element={<VenuesID />} />
          <Route path="/venues/edit/:id" element={<EditVenue />} />
          <Route
            path="/user/venues"
            element={<UserVenues venues={venues} />}
          />

          <Route path="/createvenues" element={<CreateVenues />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
