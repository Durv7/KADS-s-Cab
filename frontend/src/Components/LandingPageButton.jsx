import { Link } from "react-router-dom"
import { useAuth } from "../AuthContext"
import { useEffect, useState } from "react";
export default function LandingPageButton() {
    const {isLogin,user} =useAuth();
    const [buttonDetails, setButtonDetails] = useState({
      text: "Get Started as Customer",
      link: "/customer/signin",
    });
  
  
    useEffect(() => {
      if (isLogin && user) {
        if (user.role === 'customer') {
          setButtonDetails({ text: "Request Ride", link: "/customer/ride" });
        } else if (user.role === 'driver') {
          setButtonDetails({ text: "Dashboard", link: "/driver/dashboard" });
        }
      } else {
        setButtonDetails({ text: "Get Started as Customer", link: "/customer/signin" });
      }
    }, [isLogin, user]);

    return (
        <Link
            to={buttonDetails.link}
            className="inline-block px-8 py-3 bg-yellow-500 text-white rounded-full font-extrabold tracking-wider shadow-lg transform transition-transform hover:-translate-y-1 hover:bg-yellow-600"
        >
            {buttonDetails.text}
        </Link>
    )
}