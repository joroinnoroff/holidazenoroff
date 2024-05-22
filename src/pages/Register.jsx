import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import style from './LogRegStyle/style.module.css';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    bannerUrl: '',
    venueManager: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If the input type is checkbox, set venueManager to checked value
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Regex pattern for stud.noroff.no email addresses
    const emailPattern = /@stud\.noroff\.no$/;

    // Check if the email matches the required pattern
    if (!emailPattern.test(formData.email)) {
      // Display error toast for invalid email format
      return toast.error('Only users with stud.noroff.no email addresses are allowed.');
    }

    // Check if password is at least 8 characters long
    if (formData.password.length < 8) {
      // Display error toast for password length requirement not met
      return toast.error('Password must be at least 8 characters long.');
    }

    try {
      const response = await fetch(`https://nf-api.onrender.com/api/v1/holidaze/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      console.log(responseData);
      toast.success("Successful");
      setIsSuccess(true);
    } catch (error) {
      toast.error("An error occurred");
      console.error('Error:', error);
    }
  };

  if (isSuccess) {
    return (
      <div className={style.regContainer}>
        <Toaster />
        <h1>Registration Successful</h1>
        <div>
          <button onClick={() => window.location.href = "/login"}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className={style.regContainer}>
      <Toaster />
      <h1 className='text-3xl'>Register your account</h1>
      <p>Already have one ?</p>
      <Link to={"/login"}><span>Login here</span></Link>
      <form onSubmit={handleSubmit} className={style.Form}>
        <div className='Holder'>
          <label htmlFor="Name">Enter your Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder='Name' />
        </div>
        <div className='Holder'>
          <label htmlFor="Email">Enter your Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder='Email' />
        </div>
        <div className='Holder'>
          <label htmlFor="Password">Create your Password min 8 chars</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <input type="text" name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio (Optional)" />
        <input type="url" name="bannerUrl" value={formData.bannerUrl} onChange={handleChange} placeholder="Banner URL (Optional)" />

        <div className='Holder'>
          <label htmlFor="VenueManager">Want to create venues ?</label>
          <div className='flex flex-row'>
            <input type="checkbox" name="venueManager" onChange={handleChange} />
            <span>Yes</span>
            <input type="checkbox" name="No" />
            <span>No</span>
          </div>
        </div>
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
