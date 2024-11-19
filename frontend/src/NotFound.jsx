import { Link } from "react-router-dom";
import Navbar from "./Components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="flex  justify-start h-screen bg-gray-100 text-gray-800 px-10">
        <div className="max-w-md">
          <h1 className="text-9xl font-extrabold text-yellow-500 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-yellow-500 text-white font-semibold rounded shadow-lg hover:bg-yellow-600 transition-transform transform hover:scale-105"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
