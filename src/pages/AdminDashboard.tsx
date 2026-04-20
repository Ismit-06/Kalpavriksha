import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';
import { Users, Package, Trash2, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'inventory'>('users');

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      navigate('/');
      toast.error("Unauthorized access");
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (profile?.role === 'admin') {
      // Fetch all users
      const usersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
        const fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(fetchedUsers);
      }, (error) => {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      });

      // Fetch all inventory
      const inventoryUnsubscribe = onSnapshot(collection(db, 'inventory'), (snapshot) => {
        const fetchedInventory = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInventory(fetchedInventory);
      }, (error) => {
        console.error("Error fetching inventory:", error);
        toast.error("Failed to load inventory");
      });

      return () => {
        usersUnsubscribe();
        inventoryUnsubscribe();
      };
    }
  }, [profile]);

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'users', id));
        toast.success("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  const handleDeleteInventory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this inventory item?")) {
      try {
        await deleteDoc(doc(db, 'inventory', id));
        toast.success("Item deleted successfully");
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete item");
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  if (!user || profile?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-accent flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gray-900 text-white p-3 rounded-2xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage users and platform inventory.</p>
            </div>
          </div>
          <div className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-full font-bold shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            System Online
          </div>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-sm border border-accent overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-4 px-6 text-center font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'users' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 py-4 px-6 text-center font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'inventory' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5" />
              Inventory ({inventory.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'users' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold">Role</th>
                      <th className="p-4 font-semibold">Joined</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-800">{u.name}</td>
                        <td className="p-4 text-gray-600">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            u.role === 'farmer' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 text-sm">
                          {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'Unknown'}
                        </td>
                        <td className="p-4 text-right">
                          {u.role !== 'admin' && (
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                      <th className="p-4 font-semibold">Crop Name</th>
                      <th className="p-4 font-semibold">Farmer ID</th>
                      <th className="p-4 font-semibold">Quantity</th>
                      <th className="p-4 font-semibold">Price</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-800">{item.cropName}</td>
                        <td className="p-4 text-gray-500 text-sm font-mono">{item.farmerId}</td>
                        <td className="p-4 text-gray-600">
                          <span className="bg-gray-100 px-2 py-1 rounded-md font-medium">{item.quantity} {item.unit}</span>
                        </td>
                        <td className="p-4 text-gray-600 font-medium text-primary">${item.price.toFixed(2)}</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleDeleteInventory(item.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {inventory.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">No inventory items found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
