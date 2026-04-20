import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logout } from '../firebase';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-sm border-b border-accent sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Leaf className="text-primary w-7 h-7" />
            </div>
            <span className="font-extrabold text-2xl text-primary tracking-tight">Kalpavriksha</span>
          </Link>
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <div className="hidden lg:flex items-center gap-6 mr-4 pr-6 border-r border-gray-200">
                  <a href="/#about" className="text-gray-600 hover:text-primary font-medium transition-colors">About</a>
                  <a href="/#how-it-works" className="text-gray-600 hover:text-primary font-medium transition-colors">How it Works</a>
                  <a href="/#benefits" className="text-gray-600 hover:text-primary font-medium transition-colors">Benefits</a>
                </div>
                <Link to="/register-farmer" className="text-earth hover:text-primary font-medium px-3 py-2 rounded-md transition-colors hidden sm:block">
                  Farmers
                </Link>
                <Link to="/register-buyer" className="text-earth hover:text-primary font-medium px-3 py-2 rounded-md transition-colors hidden sm:block">
                  Businesses
                </Link>
                <Link to="/login" className="bg-primary hover:bg-secondary text-white font-bold px-6 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Login / Register
                </Link>
              </>
            ) : (
              <>
                {profile?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-2 text-gray-600 hover:text-primary font-bold px-3 py-2 rounded-md transition-colors">
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </Link>
                )}
                {profile?.role !== 'admin' && profile && (
                  <Link to="/dashboard" className="text-earth hover:text-primary font-bold px-3 py-2 rounded-md transition-colors">
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-3 ml-2 border-l border-gray-200 pl-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <User className="w-4 h-4 text-primary" />
                    <span className="hidden sm:block">{profile?.name || user.displayName || 'User'}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
