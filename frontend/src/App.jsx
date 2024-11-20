import { Routes, BrowserRouter, Route } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustLogin from './Components/Customer/LoginPage.jsx';
import LandingPage from './Components/LandingPage.jsx';
import CustSignin from './Components/Customer/SigninPage.jsx'
import DriverSignin from './Components/Driver/SigninPage.jsx';
import DriverLogin from './Components/Driver/LoginPage.jsx';
import BookingPage from './Components/Customer/BookingPage.jsx';
import Dashboard from './Components/Driver/Dashboard.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import UnauthorizedPage from './UnauthorizedPage.jsx';
import { SocketProvider } from './SocketContext.jsx';
import NotFound from './NotFound.jsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/customer/login' element={<CustLogin />} />
        <Route path='/customer/signin' element={<CustSignin />} />
        <Route path='/driver/login' element={<DriverLogin />} />
        <Route path='/driver/signin' element={<DriverSignin />} />
        <Route
          path="/customer/ride"
          element={
            <ProtectedRoute allowedRole="customer">
              <SocketProvider>
                <BookingPage />
              </SocketProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute allowedRole="driver">
              <SocketProvider>
                <Dashboard />
              </SocketProvider>
            </ProtectedRoute>
          }
        />
        <Route path='/unautherized' element={<UnauthorizedPage />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" 

      />


    </BrowserRouter>
  )
}

export default App
