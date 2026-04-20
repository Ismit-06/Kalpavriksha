import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db, loginWithGoogle } from '../firebase';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export default function RegisterBuyer() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    contactPerson: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && profile) {
      navigate('/dashboard'); // Already registered
    }
  }, [profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in first.");
      return;
    }
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Registering your business...');
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        role: 'business',
        name: formData.businessName || user.displayName || 'Business',
        email: user.email,
        businessName: formData.businessName,
        businessType: formData.businessType,
        contactPerson: formData.contactPerson,
        location: formData.location,
        createdAt: serverTimestamp()
      });
      toast.success('Business registered successfully!', { id: loadingToast });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving business profile:", error);
      toast.error("Failed to save profile. Please try again.", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-accent text-center"
        >
          <h2 className="text-2xl font-bold text-primary mb-4">Sign in to Register</h2>
          <p className="text-gray-600 mb-6">You need an account to register your business.</p>
          <button 
            onClick={loginWithGoogle}
            className="w-full bg-primary hover:bg-secondary text-white p-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-accent"
      >
        <h2 className="text-3xl font-bold text-primary mb-2">Business Registration</h2>
        <p className="text-gray-600 mb-8">Join our network to source fresh, direct-from-farm produce.</p>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Name</label>
              <input 
                type="text" 
                required 
                value={formData.businessName}
                onChange={e => setFormData({...formData, businessName: e.target.value})}
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                placeholder="e.g. The Green Kitchen" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Type</label>
              <select 
                required 
                value={formData.businessType}
                onChange={e => setFormData({...formData, businessType: e.target.value})}
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white transition-all"
              >
                <option value="">Select Type</option>
                <option value="restaurant">Restaurant</option>
                <option value="hotel">Hotel</option>
                <option value="retail">Retail Grocery</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Person</label>
              <input 
                type="text" 
                required 
                value={formData.contactPerson}
                onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                placeholder="Full Name" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
              <input 
                type="text" 
                required 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                placeholder="City, State" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification Document</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-primary transition-colors cursor-pointer bg-gray-50/50">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary hover:text-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">Business License or GST number (PDF, PNG, JPG)</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-secondary text-white p-4 rounded-xl font-bold transition-all text-lg mt-8 disabled:opacity-50 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            {isSubmitting ? 'Registering...' : 'Register Business'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
