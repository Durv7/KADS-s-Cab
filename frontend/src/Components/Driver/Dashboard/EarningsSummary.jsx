import React from 'react';

export default function EarningsSummary() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-4">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Earnings Summary</h2>
      <p className="text-gray-600">Total Earnings: $0.00</p>
      <p className="text-gray-600">Completed Rides: 0</p>
      {/* Add more summary details here */}
    </div>
  );
}
