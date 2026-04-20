import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db, loginWithGoogle } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function RegisterFarmer() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const crops = ["Onions", "Tomatoes", "Leafy Greens", "Potatoes", "Exotic Veggies", "Carrots"];
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    farmSize: ''
  });
  const [yieldCapacity, setYieldCapacity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && profile) {
      navigate('/dashboard'); // Already registered
    }
  }, [profile, loading, navigate]);

  const toggleCrop = (crop: string) => {
    setSelectedCrops(prev => 
      prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
    );
  };

  const handleComplete = async () => {
    if (!user) {
      toast.error("Please sign in first.");
      return;
    }
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Saving your profile...');
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        role: 'farmer',
        name: formData.name || user.displayName || 'Farmer',
        email: user.email,
        location: formData.location,
        farmSize: Number(formData.farmSize) || 0,
        crops: selectedCrops,
        yieldCapacity: yieldCapacity,
        createdAt: serverTimestamp()
      });
      toast.success('Profile created successfully!', { id: loadingToast });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving farmer profile:", error);
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
          <p className="text-gray-600 mb-6">You need an account to register as a farmer.</p>
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
        className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-lg border border-accent overflow-hidden"
      >
        <div className="mb-8 flex justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 w-1/3 mx-1 rounded-full transition-colors duration-500 ${step >= s ? 'bg-primary' : 'bg-gray-200'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold text-primary">Farm Details</h2>
              <p className="text-sm text-gray-500 mb-6">Let's start with the basics.</p>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
              />
              <input 
                type="text" 
                placeholder="Location (District/State)" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
              />
              <input 
                type="number" 
                placeholder="Farm Size (Acres)" 
                value={formData.farmSize}
                onChange={e => setFormData({...formData, farmSize: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
              />
              <button onClick={() => setStep(2)} className="w-full bg-primary hover:bg-secondary text-white p-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg mt-6">Next Step</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold text-primary">What do you grow?</h2>
              <p className="text-sm text-gray-500 mb-6">Select your primary crops.</p>
              <div className="grid grid-cols-2 gap-3">
                {crops.map(crop => (
                  <button 
                    key={crop} 
                    onClick={() => toggleCrop(crop)}
                    className={`p-4 border rounded-xl transition-all text-sm font-medium ${
                      selectedCrops.includes(crop) 
                        ? 'border-primary bg-primary/10 text-primary shadow-inner' 
                        : 'border-gray-200 hover:border-primary hover:bg-primary/5 text-gray-700'
                    }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(1)} className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-xl font-bold transition-colors">Back</button>
                <button onClick={() => setStep(3)} className="w-2/3 bg-primary hover:bg-secondary text-white p-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg">Next Step</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold text-primary">Yield Capacity</h2>
              <p className="text-sm text-gray-500 mb-6">Help us understand your volume.</p>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Monthly Yield (kg/tons)</label>
              <input 
                type="text" 
                placeholder="e.g. 500kg" 
                value={yieldCapacity}
                onChange={e => setYieldCapacity(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
              />
              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(2)} className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-xl font-bold transition-colors">Back</button>
                <button 
                  onClick={handleComplete} 
                  disabled={isSubmitting}
                  className="w-2/3 bg-secondary hover:bg-primary text-white p-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Complete Profile'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
