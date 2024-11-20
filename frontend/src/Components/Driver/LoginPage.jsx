import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar.jsx';
import Footer from '../Footer.jsx';
import { useAuth } from '../../AuthContext.jsx';
import { toast } from 'react-toastify';
import { toastSuccessStyle,toastErrorStyle } from '../../utils/ToastStyle.js';
import { server } from '../../../constants.js';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
    });
    const {setIsLogin,setUser,user,isLogin} =useAuth();
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, SetisLoading] = useState(false);
    const navigate=useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            SetisLoading(true);
            const response = await axios.post(`${server}/api/driver/login`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            toast.success('Login successful!',toastSuccessStyle);

            setSuccessMessage('Login successful!');
            setIsLogin(true);
            setUser({...response.data,role:'driver'});
            setError(''); // Clear any previous errors
            SetisLoading(false);
            navigate('/driver/dashboard')
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); // Set custom error message from backend
            } else {
                setError('An unexpected error occurred. Please try again.');
            }

            toast.error("Login failed! Check your credentials.",toastErrorStyle);

            setSuccessMessage(''); // Clear any previous success messages
            SetisLoading(false);
            setIsLogin(false);
            setUser(null);
        }
    };

    return (
        <div>
            <Navbar isAuthPage={true}/>
            <div className="flex items-center justify-center min-h-fit bg-gray-100">
                <div className="w-full max-w-md p-6 space-y-6 bg-white rounded shadow-lg my-28">
                    <h2 className="text-3xl font-bold text-center text-gray-700">Login As Driver</h2>
                    <p className="text-center text-gray-500">Enter your credentials to access your account</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                        <button
                            type="submit"
                            className="w-full py-2 mt-4 font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading" : "Log In"}
                        </button>

                        {error && (
                            <p className="mt-2 text-center text-red-500">{error}</p>
                        )}
                        {successMessage && (
                            <p className="mt-2 text-center text-green-500">{successMessage}</p>
                        )}

                        <p className="mt-4 text-center text-gray-600">
                            Don’t have an account?{' '}
                            <Link to="/customer/signin" className="text-blue-500 hover:underline">
                                Sign in here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    );
};


