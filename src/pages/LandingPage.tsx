import { Link } from 'react-router-dom';
import { Leaf, Truck, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80')] bg-cover bg-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60" />
        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Connecting Farms Directly <br className="hidden md:block" /> To Your Kitchen.
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-accent mb-10 max-w-2xl mx-auto font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Eliminate middlemen, ensure fair pricing for farmers, and guarantee 24-hour freshness for businesses.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/register-farmer" className="bg-secondary hover:bg-primary text-white px-8 py-4 rounded-full font-bold transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
              Register as a Farmer
            </Link>
            <Link to="/register-buyer" className="bg-white hover:bg-accent text-primary px-8 py-4 rounded-full font-bold transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
              Register as a Business
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Value Prop Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div 
          className="grid md:grid-cols-3 gap-12 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm border border-accent/50 hover:shadow-md transition-shadow">
            <div className="p-5 bg-primary/10 rounded-2xl mb-6 text-primary">
              <Leaf className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">Zero Middlemen</h3>
            <p className="text-gray-600 leading-relaxed text-lg">Farmers earn up to 40% more by selling directly to commercial kitchens and retail stores.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm border border-accent/50 hover:shadow-md transition-shadow">
            <div className="p-5 bg-primary/10 rounded-2xl mb-6 text-primary">
              <BarChart3 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">Demand Forecasting</h3>
            <p className="text-gray-600 leading-relaxed text-lg">Know exactly what to grow based on real-time pre-order data from local restaurants.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm border border-accent/50 hover:shadow-md transition-shadow">
            <div className="p-5 bg-primary/10 rounded-2xl mb-6 text-primary">
              <Truck className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">Guaranteed Freshness</h3>
            <p className="text-gray-600 leading-relaxed text-lg">Optimized farm-to-fork logistics ensure delivery in under 24 hours from harvest.</p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
