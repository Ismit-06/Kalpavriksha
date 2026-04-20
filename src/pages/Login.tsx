import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginWithGoogle } from '../firebase';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export default function Login() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (profile) {
        navigate('/dashboard');
      }
    }
  }, [user, profile, loading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      if (user) {
        toast.success("Successfully signed in!");
      }
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Failed to sign in. Please try again.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user && !profile) {
    const isCompanyHolder = user.email === 'ismittripathyit@gmail.com';
    
    const handleAdminRegistration = async () => {
      try {
        const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
        const { db } = await import('../firebase');
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          role: 'admin',
          name: user.displayName || 'Admin',
          email: user.email,
          createdAt: serverTimestamp()
        });
        toast.success("Admin account created successfully!");
        navigate('/admin');
      } catch (error) {
        console.error("Error creating admin profile:", error);
        toast.error("Failed to create admin profile.");
      }
    };

    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-accent text-center"
        >
          <h2 className="text-3xl font-bold text-primary mb-4">Complete Your Profile</h2>
          <p className="text-gray-600 mb-8">Welcome! Please choose how you want to use AgriConnect.</p>
          <div className="flex flex-col gap-4">
            <Link to="/register-farmer" className="w-full bg-secondary hover:bg-primary text-white p-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              I am a Farmer
            </Link>
            <Link to="/register-buyer" className="w-full bg-white hover:bg-accent text-primary border-2 border-primary p-4 rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
              I am a Business Buyer
            </Link>
            {isCompanyHolder && (
              <button 
                onClick={handleAdminRegistration}
                className="w-full bg-gray-900 hover:bg-black text-white p-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-4"
              >
                Initialize Admin Account
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-accent text-center"
      >
        <h2 className="text-3xl font-bold text-primary mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-8">Sign in to your AgriConnect account.</p>
        
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-primary hover:bg-gray-50 text-gray-700 p-4 rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>
      </motion.div>
    </div>
  );
}
