import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import Navbar from '../Navbar';
import { useAuth } from '../../AuthContext';
import { toast } from 'react-toastify';
import { toastSuccessStyle,toastErrorStyle } from '../../utils/ToastStyle';
const SigninPage = () => {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    email: '',
    phoneNo: '',
  });
  const {setIsLogin,setUser,user,isLogin} = useAuth();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const navigate=useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setisLoading(true);
      console.log(formData);
      const response = await axios.post('http://localhost:8080/api/customer/signin', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      },);
      console.log(response);

      toast.success("Welcome To KADS's Cabs",toastSuccessStyle);
      setSuccessMessage('User registered successfully!');
      setIsLogin(true);
      setUser({...response.data,role:'customer'});
      setError(''); // Clear any previous errors
      setisLoading(false);
      navigate('/customer/ride');

    } catch (err) {
      console.log(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Set custom error message
      } else {
        setError('An unexpected error occurred. Please try again.');
      }

      toast.error("Signin Failed! Please Try Again.",toastErrorStyle);
      setSuccessMessage('');
      setisLoading(false);
      setIsLogin(false);
      setUser(null);
    }
  };

  return (
    <div>
      <Navbar isAuthPage={true}/>
      <div className="flex items-center justify-center min-h-fit bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white my-16 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up to Book Your Ride</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 mt-4 font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600"
              disabled={isLoading}
            >
              {isLoading ? "Loading" : "Sign In"}
            </button>
            <p className="mt-4 text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/customer/login" className="text-blue-500 hover:underline">
                Log in
              </Link>
            </p>
          </form>

          {successMessage && (
            <p className="mt-4 text-green-500 text-center">{successMessage}</p>
          )}
          {error && (
            <p className="mt-4 text-red-500 text-center">{error}</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SigninPage;

