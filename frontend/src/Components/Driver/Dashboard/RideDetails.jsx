import React from 'react';
import { toast } from 'react-toastify';
import { toastSuccessStyle,toastErrorStyle } from '../../../utils/ToastStyle';

export default function RideDetails({ rideDetails,socket,handleRideDetails }) {
  const handleCompleteRide = () => {
    if (socket && rideDetails) {
      socket.emit('rideCompleted', { rideId: rideDetails.rideId,custSocketId:rideDetails.custSocketId });
      handleRideDetails(null);
      toast.success('Ride marked as completed!', toastSuccessStyle);
    } else {
      toast.error('Unable to complete the ride.', toastErrorStyle);
    }
  };

  if (!rideDetails) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-md mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Ride Details</h3>
        <p className="text-gray-500 mt-2">No active ride currently.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-4">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Ride Details</h2>
      {

          <div>
            <div className="mt-3 space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Customer:</span> {rideDetails.customer.userName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Source:</span> {rideDetails.source}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Destination:</span> {rideDetails.destination}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Fare:</span> &#8377;{rideDetails.cost}
              </p>
            </div>
            <button
              onClick={handleCompleteRide}
              className="w-full mt-4 py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              Complete Ride
            </button>


          </div>

      }

    </div>
  );
}
