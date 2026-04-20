import React, { useState, useEffect } from 'react';
import { ShoppingBasket, Calculator, Plus, Trash2, Loader2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Roma Tomatoes', price: 1.20, unit: 'kg', icon: '🍅' },
  { id: 2, name: 'Red Onions', price: 0.80, unit: 'kg', icon: '🧅' },
  { id: 3, name: 'Hydroponic Spinach', price: 3.50, unit: 'kg', icon: '🥬' },
  { id: 4, name: 'Bell Peppers (Mixed)', price: 2.10, unit: 'kg', icon: '🫑' },
  { id: 5, name: 'Carrots', price: 0.90, unit: 'kg', icon: '🥕' },
  { id: 6, name: 'Potatoes', price: 0.60, unit: 'kg', icon: '🥔' },
];

const getCropIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('tomato')) return '🍅';
  if (n.includes('onion')) return '🧅';
  if (n.includes('spinach') || n.includes('lettuce') || n.includes('leaf')) return '🥬';
  if (n.includes('pepper') || n.includes('capsicum')) return '🫑';
  if (n.includes('carrot')) return '🥕';
  if (n.includes('potato')) return '🥔';
  if (n.includes('corn')) return '🌽';
  if (n.includes('broccoli')) return '🥦';
  if (n.includes('mushroom')) return '🍄';
  if (n.includes('apple')) return '🍎';
  if (n.includes('banana')) return '🍌';
  if (n.includes('orange')) return '🍊';
  if (n.includes('strawberry')) return '🍓';
  if (n.includes('grape')) return '🍇';
  if (n.includes('watermelon')) return '🍉';
  if (n.includes('garlic')) return '🧄';
  if (n.includes('eggplant') || n.includes('aubergine')) return '🍆';
  if (n.includes('pea') || n.includes('bean')) return '🫛';
  return '🌿';
};

const formatTimestamp = (timestamp: any) => {
  if (!timestamp) return 'Just now';
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 172800) return 'Yesterday';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
};

export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const [orders, setOrders] = useState<Record<number, number>>({});
  
  // Inventory state
  const [inventory, setInventory] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ cropName: '', quantity: '', unit: 'kg', price: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (user && profile?.role === 'farmer') {
      const q = query(collection(db, 'inventory'), where('farmerId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInventory(items);
      }, (error) => {
        console.error("Error fetching inventory:", error);
        toast.error("Failed to load inventory");
      });
      return () => unsubscribe();
    }
  }, [user, profile]);

  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newItem.cropName || !newItem.quantity || !newItem.price) return;
    setIsAdding(true);
    const loadingToast = toast.loading('Adding to inventory...');
    try {
      await addDoc(collection(db, 'inventory'), {
        farmerId: user.uid,
        cropName: newItem.cropName,
        quantity: Number(newItem.quantity),
        unit: newItem.unit,
        price: Number(newItem.price),
        updatedAt: serverTimestamp()
      });
      setNewItem({ cropName: '', quantity: '', unit: 'kg', price: '' });
      toast.success('Item added successfully!', { id: loadingToast });
    } catch (error) {
      console.error("Error adding inventory", error);
      toast.error("Failed to add item.", { id: loadingToast });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteInventory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inventory', id));
      toast.success('Item deleted');
    } catch (error) {
      console.error("Error deleting inventory", error);
      toast.error("Failed to delete item.");
    }
  };

  const updateOrder = (id: number, qty: number) => {
    setOrders(prev => ({ ...prev, [id]: Math.max(0, qty) }));
  };

  const totalEstimate = MOCK_PRODUCTS.reduce((sum, p) => {
    return sum + (orders[p.id] || 0) * p.price;
  }, 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-accent text-center"
        >
          <h2 className="text-2xl font-bold text-primary mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need to be logged in and have a registered profile to access the dashboard.</p>
          <Link to="/login" className="inline-block w-full bg-primary hover:bg-secondary text-white p-4 rounded-xl font-bold transition-colors">
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-accent flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-primary">Welcome, {profile.name}!</h1>
            <p className="text-gray-600 mt-1">
              {profile.role === 'farmer' ? 'Manage your farm and view demand.' : 'Plan your weekly supply needs.'}
            </p>
          </div>
          <div className="bg-primary/10 text-primary px-5 py-2.5 rounded-full font-bold capitalize shadow-sm">
            {profile.role} Account
          </div>
        </motion.div>

        {profile.role === 'farmer' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-accent text-center">
              <h2 className="text-2xl font-bold text-primary mb-4">Farmer Dashboard</h2>
              <p className="text-gray-600 mb-6">Your farm details are registered. We will notify you when buyers request your crops.</p>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-bold text-gray-800">{profile.location}</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Farm Size</p>
                  <p className="font-bold text-gray-800">{profile.farmSize} Acres</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 col-span-2">
                  <p className="text-sm text-gray-500 mb-2">Primary Crops</p>
                  <div className="flex gap-2 flex-wrap">
                    {profile.crops?.map((crop: string) => (
                      <span key={crop} className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-medium border border-primary/20">{crop}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Management Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-accent">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Inventory Management</h2>
              </div>
              
              <form onSubmit={handleAddInventory} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 mb-8 flex flex-wrap gap-4 items-end shadow-inner">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Crop Name</label>
                  <input 
                    type="text" 
                    required
                    value={newItem.cropName}
                    onChange={e => setNewItem({...newItem, cropName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                    placeholder="e.g. Roma Tomatoes" 
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={newItem.quantity}
                    onChange={e => setNewItem({...newItem, quantity: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                    placeholder="0" 
                  />
                </div>
                <div className="w-28">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit</label>
                  <select 
                    value={newItem.unit}
                    onChange={e => setNewItem({...newItem, unit: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white transition-all"
                  >
                    <option value="kg">kg</option>
                    <option value="tons">tons</option>
                    <option value="units">units</option>
                    <option value="bunches">bunches</option>
                  </select>
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    value={newItem.price}
                    onChange={e => setNewItem({...newItem, price: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                    placeholder="0.00" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isAdding}
                  className="bg-secondary hover:bg-primary text-white p-3 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50 h-[50px] shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  {isAdding ? 'Adding...' : 'Add Item'}
                </button>
              </form>

              {inventory.length === 0 ? (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                  <p className="text-lg font-medium mb-2">No inventory items added yet.</p>
                  <p className="text-sm">Add your first crop above to start managing your stock.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                        <th className="p-4 font-semibold">Crop Name</th>
                        <th className="p-4 font-semibold">Quantity Available</th>
                        <th className="p-4 font-semibold">Price per Unit</th>
                        <th className="p-4 font-semibold">Last Updated</th>
                        <th className="p-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {inventory.map((item) => (
                          <motion.tr 
                            key={item.id} 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl bg-white shadow-sm p-2 rounded-xl border border-gray-100">{getCropIcon(item.cropName)}</span>
                                <span className="font-bold text-gray-800">{item.cropName}</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-600">
                              <span className="bg-gray-100 px-2 py-1 rounded-md font-medium">{item.quantity} {item.unit}</span>
                            </td>
                            <td className="p-4 text-gray-600 font-medium text-primary">${item.price.toFixed(2)}</td>
                            <td className="p-4 text-sm text-gray-500 font-medium">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {formatTimestamp(item.updatedAt)}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <button 
                                onClick={() => handleDeleteInventory(item.id)}
                                className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors"
                                title="Delete Item"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Catalog */}
            <div className="flex-1">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-primary mb-2">Pre-Order Intent</h2>
                <p className="text-gray-600 text-lg">Specify your weekly needs. No payment required today.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {MOCK_PRODUCTS.map((product, index) => (
                  <motion.div 
                    key={product.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-5 rounded-2xl border border-accent shadow-sm flex items-center justify-between hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl bg-gray-50 p-2 rounded-xl">{product.icon}</span>
                      <div>
                        <h3 className="font-bold text-primary text-lg">{product.name}</h3>
                        <p className="text-sm text-earth font-medium">Est. ${product.price.toFixed(2)}/{product.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min="0"
                        className="w-20 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-center font-medium" 
                        placeholder="0"
                        value={orders[product.id] || ''}
                        onChange={(e) => updateOrder(product.id, parseInt(e.target.value) || 0)}
                      />
                      <span className="text-sm font-medium text-gray-500 w-6">{product.unit}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Summary Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-96 bg-primary text-white p-8 rounded-3xl h-fit sticky top-24 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-white/20 pb-5">
                <ShoppingBasket className="w-8 h-8 text-accent" />
                <h2 className="text-2xl font-bold">Weekly Summary</h2>
              </div>
              
              <div className="space-y-4 mb-8 min-h-[150px]">
                {MOCK_PRODUCTS.filter(p => orders[p.id] > 0).length === 0 ? (
                  <p className="text-white/60 text-center italic mt-10">Your cart is empty. Add items to estimate your weekly spend.</p>
                ) : (
                  <AnimatePresence>
                    {MOCK_PRODUCTS.filter(p => orders[p.id] > 0).map(p => (
                      <motion.div 
                        key={p.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex justify-between text-sm items-center bg-white/5 p-3 rounded-xl"
                      >
                        <span className="font-medium">{p.name} <span className="text-accent ml-2 bg-white/10 px-2 py-0.5 rounded">x {orders[p.id]}{p.unit}</span></span>
                        <span className="font-bold text-lg">${(orders[p.id] * p.price).toFixed(2)}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                
                <div className="border-t border-white/20 pt-5 mt-6 flex justify-between items-center font-bold text-xl">
                  <span>Total Est. Spend</span>
                  <span className="text-accent text-2xl">${totalEstimate.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-white/10 p-5 rounded-2xl text-sm mb-8 flex gap-4 items-start border border-white/10 backdrop-blur-sm">
                <Calculator className="w-6 h-6 shrink-0 text-accent mt-0.5" />
                <p className="leading-relaxed text-white/90">Submitting this intent helps us secure supply for you. A representative will contact you for a formal contract.</p>
              </div>

              <button 
                onClick={() => toast.success("Interest Registered! We will contact you soon.")}
                disabled={totalEstimate === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  totalEstimate > 0 
                    ? 'bg-accent text-primary hover:bg-white hover:shadow-xl hover:-translate-y-1' 
                    : 'bg-white/10 text-white/40 cursor-not-allowed shadow-none'
                }`}
              >
                Submit Pre-Order Intent
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
