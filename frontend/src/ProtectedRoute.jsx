import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { isLogin, user, loading } = useAuth();

  // Display a loading screen while waiting for auth data
  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!isLogin) {
    return <Navigate to='/' />;
  }

  // If logged in but not allowed, redirect to unauthorized page
  if (user.role !== allowedRole) {
    console.log(user.role);
    return <Navigate to="/unautherized" />;
  }

  // Render the protected content if checks pass
  return children;
}
