import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import style from './LogRegStyle/style.module.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the email matches the required pattern
    const emailPattern = /@stud\.noroff\.no$/;
    if (!emailPattern.test(formData.email)) {
      // Display error toast for invalid email format
      return toast.error('Only users with stud.noroff.no email addresses are allowed.');
    }

    try {
      const response = await fetch(`https://nf-api.onrender.com/api/v1/holidaze/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // If response is not okay, display error message
        return toast.error('Invalid email or password');
      }

      const responseData = await response.json();
      console.log(responseData);

      const { accessToken, ...user } = responseData;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Example: Redirect to dashboard or profile page using window.location
      window.location.href = "/dashboard"; // Change "/dashboard" to the appropriate route

      // Display success toast
      toast.success('Login successful!');
    } catch (error) {
      console.error('Error:', error);
      // Display error toast for any other unexpected errors
      toast.error('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className={style.regContainer}>
      <Toaster />

      <h1 className='text-3xl'>Sign in to your Account</h1>
      <h3>Don't have one?</h3>
      <Link to={"/register"}>Register here</Link>
      <form onSubmit={handleSubmit} className={style.Form}>
        <div className="Holder">
          <label htmlFor="email">Enter your Email</label>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 start-0 flex items-center justify-center ps-3.5 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
              </svg>
            </div>
            <input type="email" name='email' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formData.email} onChange={handleChange} placeholder='Email@stud.noroff.no' required />
          </div>

        </div>
        <div className='Holder'>
          <label htmlFor="password">Enter your Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder='Password' required />
        </div>
        <div className={style.Remember}>
          <input type="checkbox" name="" id="" />
          <span>Remember me </span>
        </div>

        <span>Forgotten password?</span>

        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
