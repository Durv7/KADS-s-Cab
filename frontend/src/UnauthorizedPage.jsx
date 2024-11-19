import { Link } from "react-router-dom";
import Navbar from "./Components/Navbar";

export default function AccessDenied() {
  return (
    <>
      <Navbar />
      <div className="flex  justify-start h-screen bg-gray-100 text-gray-800 px-10">
        <div className="max-w-md">
          <h1 className="text-8xl font-extrabold text-yellow-500 mb-4">403</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            You do not have permission to view this page. Please check with an administrator if you believe this is a mistake.
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
