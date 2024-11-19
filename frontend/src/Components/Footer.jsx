import { Link } from "react-router-dom"
export default function Footer(){
    return(
        <footer className="bg-yellow-500 text-gray-800 p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 <span className="font-bold">KADS's Cabs</span>. All rights reserved.</p>
          <p>
            <Link to="/terms" className="hover:underline">Terms of Service</Link> |{' '}
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </footer>
    )
}