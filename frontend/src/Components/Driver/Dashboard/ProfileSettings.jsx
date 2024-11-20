import React from 'react';
import { useAuth } from '../../../AuthContext';
import { toast } from 'react-toastify';
import { toastSuccessStyle,toastErrorStyle } from '../../../utils/ToastStyle';
import axios from 'axios';
import { server } from '../../../../constants';

export default function ProfileSettings() {

  const {user,setIsLogin,setUser}=useAuth();

  const onLogout = async () => {
    console.log("here");
    try {
      if(user.role==='customer'){
        const response=await axios.get(`${server}/api/customer/logout`, { withCredentials: true });
      }else{
        const response=await axios.get(`${server}/api/driver/logout`, { withCredentials: true });
      }
      toast.success("Logout Successfully!",toastSuccessStyle);
      setIsLogin(false);
      setUser(null);
    } catch (error) {
      toast.error("Logout Unsuccessful! Please Try Again",toastErrorStyle);
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-4">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Profile Settings</h2>
      <p className="text-gray-600">Name: {user.fullName}</p>
      <button className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-full transition-transform transform hover:-translate-y-1 hover:bg-gray-900"
        onClick={onLogout}
      >
        Log Out
      </button>
    </div>
  );
}
