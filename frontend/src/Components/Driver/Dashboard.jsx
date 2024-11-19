import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar.jsx'; // Ensure this path is correct
import Map from './Dashboard/Map.jsx';
import RideRequests from './Dashboard/RideRequests.jsx';
import RideDetails from './Dashboard/RideDetails.jsx';
import ProfileSettings from './Dashboard/ProfileSettings.jsx';
import {getSocket} from '../../SocketContext.jsx';


export default function Dashboard() {
  const [driverLocation,setDriverLocation]=useState(null);
  const [rideDetails,setRideDetails]=useState(null);
  const socket=getSocket();

  const handleDriverLocation=(location)=>{
    setDriverLocation(location);
  }

  const handleRideDetails=(details)=>{
    setRideDetails(details);
  }

  return (    
        <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <div className="lg:col-span-2">
          <Map socket={socket} handleDriverPosition={handleDriverLocation} rideDetails={rideDetails}/>
        </div>
        <div>
          <RideRequests socket={socket} driverLocation={driverLocation} handleRideDetails={handleRideDetails}/>
          <RideDetails rideDetails={rideDetails} socket={socket} handleRideDetails={handleRideDetails}/>
          <ProfileSettings />
        </div>
      </div>
    </div> 

  );
}
