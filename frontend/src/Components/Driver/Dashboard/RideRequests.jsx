import React, { useState,useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline"; // Using HeroIcons for icons
import { toast } from 'react-toastify';
import { toastSuccessStyle,toastErrorStyle } from '../../../utils/ToastStyle';

export default function RideRequests({socket,driverLocation,handleRideDetails}) {
    const [rideDetails,setRideDetails]=useState(null);

    useEffect(()=>{
        const rideAssigned=(msg)=>{
            
            console.log(msg);
            setRideDetails(msg);
            toast.success("New Ride Request Recieved :)",toastSuccessStyle);
          }
      
          socket.on("rideAssigned",rideAssigned);
      
          return ()=>{
            socket.off("rideAssigned",rideAssigned);
          }
    })

    const respondToRide = (action) => {
        if (rideDetails && driverLocation) {
            socket.emit("respondToRide", { rideId: rideDetails.rideId, action,custSocketId:rideDetails.custSocketId ,driverLocation});
            if (action === "accept") {
                toast.success("Ride accepted!", toastSuccessStyle);
                handleRideDetails(rideDetails);
            } else {
                toast.error("Ride declined.", toastErrorStyle);
            }
            setRideDetails(null); 
}
    };
  return (
    <>
      <div className="bg-white rounded-lg p-4 shadow-md mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Ride Requests</h2>
        { rideDetails && rideDetails.source.length != 0 && rideDetails.destination.length != 0
          ?
          <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-4 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
              Ride Request
          </h2>
          <div>
              <p className="text-sm text-gray-500 font-bold">Source</p>
              <p className="text-gray-700">{rideDetails.source}</p>
          </div>
          <div>
              <p className="text-sm text-gray-500 font-bold">Destination</p>
              <p className="text-gray-700">{rideDetails.destination}</p>
          </div>
          <div className="flex items-center justify-between mt-6">
              <button
                  onClick={()=>respondToRide("accept")}
                  className="flex items-center justify-center gap-2 w-1/2 py-2 text-green-500 hover:text-white bg-green-50 hover:bg-green-500 rounded-lg transition-all duration-200"
              >
                  <CheckCircleIcon className="h-6 w-6" />
                  Accept
              </button>
              <button
                  onClick={()=>respondToRide("decline")}
                  className="flex items-center justify-center gap-2 w-1/2 py-2 text-red-500 hover:text-white bg-red-50 hover:bg-red-500 rounded-lg transition-all duration-200"
              >
                  <XCircleIcon className="h-6 w-6" />
                  Decline
              </button>
          </div>
      </div>


          : <p className="text-gray-600">No new ride requests.</p>}

      </div>
    </>
  );
}
