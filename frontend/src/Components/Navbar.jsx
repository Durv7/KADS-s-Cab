import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useState } from "react";
import {toast} from 'react-toastify';
import axios from "axios";
import {toastSuccessStyle,toastErrorStyle} from "../utils/ToastStyle.js"
export default function Navbar({ isAuthPage }) {
  const { isLogin, user, setIsLogin, setUser } = useAuth();
  const [isLoginDropdownVisible, setLoginDropdownVisible] = useState(false);
  const [isSignupDropdownVisible, setSignupDropdownVisible] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);


  const onLogout = async () => {
    try {
      if(user.role==='customer'){
        const response=await axios.get(`http://localhost:8080/api/customer/logout`, { withCredentials: true });
      }else{
        const response=await axios.get(`http://localhost:8080/api/driver/logout`, { withCredentials: true });
      }
      toast.success("Logout Successfully!",toastSuccessStyle);
      setIsLogin(false);
      setUser(null);
    } catch (error) {
      toast.error("Logout Unsuccessful! Please Try Again",toastErrorStyle);
      console.error("Logout failed:", error);
    }
  };

  const toggleLoginDropdown = () => {
    setLoginDropdownVisible(!isLoginDropdownVisible);
    setSignupDropdownVisible(false); // Close the other dropdown
  };

  const toggleSignupDropdown = () => {
    setSignupDropdownVisible(!isSignupDropdownVisible);
    setLoginDropdownVisible(false); // Close the other dropdown
  };

  return (
    <nav className="bg-yellow-500 text-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <h1 className="text-3xl font-bold cursor-pointer text-gray-900 transition-transform transform hover:scale-105">
            <span className="bg-yellow-600 text-white px-2 py-1 rounded-md">KADS's</span> Cabs
          </h1>
        </Link>

        {!isAuthPage && (
          <div className="flex space-x-4 items-center">
            {!isLogin ? (
              <div className="flex space-x-4 items-center">
                {/* Login Button with Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleLoginDropdown}
                    className="px-5 py-2 bg-gray-800 text-white rounded-full shadow-md transition-transform transform hover:-translate-y-1 hover:bg-gray-900"
                  >
                    Login
                  </button>
                  {isLoginDropdownVisible && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg">
                      <Link to="/customer/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Customer
                      </Link>
                      <Link to="/driver/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Driver
                      </Link>
                    </div>
                  )}
                </div>

                {/* Sign Up Button with Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleSignupDropdown}
                    className="px-5 py-2 bg-gray-800 text-white rounded-full shadow-md transition-transform transform hover:-translate-y-1 hover:bg-gray-900"
                  >
                    Sign Up
                  </button>
                  {isSignupDropdownVisible && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg">
                      <Link to="/customer/signin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Customer
                      </Link>
                      <Link to="/driver/signin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Driver
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* User Button with Profile and Sign Out */
              <div className="relative group">
              <button
                onClick={() => setDropdownVisible((prev) => !prev)}
                className="px-5 py-2 bg-gray-100 text-black rounded-full shadow-md transition-transform transform hover:-translate-y-1 hover:bg-gray-200"
              >
                {user.userName} <span>▼</span>
              </button>
              {isDropdownVisible && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
