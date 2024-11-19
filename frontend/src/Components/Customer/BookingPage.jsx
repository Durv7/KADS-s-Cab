import React, { useState, useEffect } from "react";
import { getSocket } from "../../SocketContext.jsx";
import Navbar from "../Navbar.jsx"; // Assuming Navbar is in the same directory
import SearchForm from "./Booking/SearchForm.jsx";
import InitialMap from "./Booking/InitialMap.jsx";

export default function BookingPage() {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const socket = getSocket();
  const [customerLocation, setCustomerLocation] = useState({ lat: null, lng: null });
  const [cost,setCost]=useState(null);
  const [isRideAccepted,setIsRideAccepted]=useState(false);
  const [driverLocation,setDriverLocation]=useState(null);
  const [isRideCompleted,setIsRideCompleted] =useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;

        setCustomerLocation({ lat: latitude, lng: longitude });
      },
        (err) => {
          console.log(err);
        }, {
        enableHighAccuracy: true
      })
    }

  }, [])

  const handleRideCompletion=(ans)=>{
    setIsRideCompleted(ans);
  }

  const handleDriverLocation=(location)=>{
    setDriverLocation(location)
  }

  const handlePricing=(price)=>{
    setCost(price);
  }

  const handleRideAcceptance=(ans)=>{
    setIsRideAccepted(ans);
  }



  const handleSelectLocation = (type, coords) => {
    if (type === 'source') {
      if(coords!=null){
        setSource({ lat: coords[1], lng: coords[0] });
      }else{
        setSource(null);
      } // Leaflet expects [lat, lon]
    } else if (type === 'destination') {
      if(coords!=null){
        setDestination({ lat: coords[1], lng: coords[0] });
      }else{
        setDestination(null);
      } 
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen overflow-hidden">
      <Navbar isAuthPage={false} /> {/* Use Navbar component */}

      <div className="flex flex-col lg:flex-row container mx-auto mt-4 p-4 h-[86vh]">

        {/* Left side: Booking Form */}
        <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-lg mb-4 lg:mb-0 lg:mr-8 overflow-auto h-full lg:h-auto">
          <SearchForm onSelectLocation={handleSelectLocation} currentLocation={customerLocation} socket={socket} cost={cost} handleRideAcceptance={handleRideAcceptance} handleDriverLocation={handleDriverLocation} handleRideCompletion={handleRideCompletion}/>
        </div>

        {/* Right side: Map with adjusted height */}
        <div className="lg:w-2/3 h-[72vh] lg:h-[82vh] z-0">
          <InitialMap source={source} destination={destination} socket={socket} customerLocation={customerLocation} handlePricing={handlePricing} isRideAccepted={isRideAccepted} driverLocation={driverLocation} rideCompletion={isRideCompleted}/>
        </div>
      </div>
    </div>
  );
}
