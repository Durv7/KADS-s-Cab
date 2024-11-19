import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import { useAuth } from '../AuthContext';
import LandingPageButton from './LandingPageButton';


const LandingPage = () => {
  const {loading}=useAuth();


  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 text-center p-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Reliable Rides, Anytime, Anywhere with <span className="text-yellow-600">KADS's Cab</span>
        </h2>
        <p className="text-lg text-gray-700 mb-6 max-w-xl">
          Welcome to KADS's Cab! Book a ride quickly and conveniently. Whether you're a passenger or a driver, we've got you covered!
        </p>
        <LandingPageButton/>
      </main>

      {/* How It Works Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-8">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">1. Book Your Ride</h4>
              <p className="text-gray-600">
                Enter your destination and get an instant quote. Confirm your
                booking with just a few clicks.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">2. Track Your Driver</h4>
              <p className="text-gray-600">
                See your driver’s real-time location and arrival time on the map.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">3. Enjoy the Ride</h4>
              <p className="text-gray-600">
                Relax and enjoy the ride with our comfortable and reliable cabs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-yellow-50 py-12">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-8">Why Choose Us</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6">
              <h4 className="text-xl font-semibold text-yellow-600 mb-2">Affordable Rides</h4>
              <p className="text-gray-600">
                Enjoy transparent pricing and great value for money with every ride.
              </p>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-semibold text-yellow-600 mb-2">Reliable Service</h4>
              <p className="text-gray-600">
                Trusted drivers and well-maintained vehicles to ensure a smooth
                and safe journey.
              </p>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-semibold text-yellow-600 mb-2">24/7 Availability</h4>
              <p className="text-gray-600">
                Our cabs are ready to serve you anytime, day or night.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
