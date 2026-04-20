import { Link } from 'react-router-dom';
import { Leaf, Truck, BarChart3, Users, Sprout, Store, ArrowRight, CheckCircle2 } from 'lucide-react';
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
      <section className="relative h-[90vh] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80')] bg-cover bg-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60" />
        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Connecting Farms Directly <br className="hidden md:block" /> To Your Kitchen.
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Eliminate middlemen, ensure fair pricing for farmers, and guarantee 24-hour freshness for commercial businesses.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/register-farmer" className="bg-secondary hover:bg-primary text-white px-8 py-4 rounded-full font-bold transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
              <Sprout className="w-5 h-5" />
              I'm a Farmer
            </Link>
            <Link to="/register-buyer" className="bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-full font-bold transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
              <Store className="w-5 h-5" />
              I'm a Business Buyer
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* About Us / Mission Section */}
      <section id="about" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-6"
            >
              <h2 className="text-sm font-bold text-secondary uppercase tracking-wider">Our Mission</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight">
                Empowering the root of our food system.
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Traditionally, crops pass through multiple intermediaries before reaching the consumer, leaving farmers with minimal margins and kitchens with degraded freshness. 
                Our platform bridges this gap, creating a transparent, fair, and incredibly fast supply chain.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Fair trade pricing guaranteed for all growers",
                  "Direct logistics tracking from harvest to delivery",
                  "Sustainable sourcing for responsible businesses"
                ].map((point, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-secondary w-6 h-6 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <a href="#how-it-works" className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors text-lg">
                  Learn how it works <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative">
                <img src="https://images.unsplash.com/photo-1595841696650-6f01daaf2e64?auto=format&fit=crop&q=80" alt="Farmer holding fresh produce" className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Users className="text-primary w-8 h-8" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-primary">10k+</p>
                  <p className="text-sm font-bold text-gray-500 uppercase">Registered Farmers</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section id="benefits" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">Why Choose Us</h2>
            <h3 className="text-4xl font-extrabold text-primary">Better for Farmers, Better for Business</h3>
          </div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-10 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-accent/50 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="p-5 bg-green-50 rounded-2xl mb-6 text-green-600">
                <Leaf className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Zero Middlemen</h3>
              <p className="text-gray-600 leading-relaxed text-lg">Farmers earn up to 40% more by selling directly to commercial kitchens and retail stores, cutting out unnecessary fees.</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-accent/50 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="p-5 bg-blue-50 rounded-2xl mb-6 text-blue-600">
                <BarChart3 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Demand Forecasting</h3>
              <p className="text-gray-600 leading-relaxed text-lg">Know exactly what to grow based on real-time pre-order data and historical purchasing trends from local buyers.</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-accent/50 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="p-5 bg-orange-50 rounded-2xl mb-6 text-orange-600">
                <Truck className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Guaranteed Freshness</h3>
              <p className="text-gray-600 leading-relaxed text-lg">Optimized farm-to-fork logistics ensure that businesses receive produce in under 24 hours from the exact moment of harvest.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-6">How It Works</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">A seamless process designed to bring the harvest directly to the kitchen.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-white/20 -translate-y-1/2 z-0" />
            
            {[
              { step: "01", title: "Sign Up", desc: "Create a free profile as a farmer or a business buyer." },
              { step: "02", title: "List or Request", desc: "Farmers list their upcoming harvest. Buyers submit pre-order intents." },
              { step: "03", title: "Match & Confirm", desc: "Our system automatically matches supply with local demand." },
              { step: "04", title: "Deliver", desc: "Produce is harvested and delivered directly the next morning." }
            ].map((col, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10"
              >
                <div className="w-20 h-20 mx-auto bg-accent text-primary rounded-full flex items-center justify-center text-2xl font-black mb-6 shadow-xl border-4 border-primary">
                  {col.step}
                </div>
                <h3 className="text-2xl font-bold mb-3">{col.title}</h3>
                <p className="text-white/80 leading-relaxed">{col.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white text-center px-6">
        <h2 className="text-4xl font-extrabold text-primary mb-6">Ready to revolutionize your supply chain?</h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Join thousands of farmers and restaurants already experiencing the benefits of direct trade.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register-farmer" className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-full font-bold transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
            Start Selling
          </Link>
          <Link to="/register-buyer" className="bg-white border-2 border-primary hover:bg-gray-50 text-primary px-8 py-4 rounded-full font-bold transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
            Start Sourcing
          </Link>
        </div>
      </section>
    </div>
  );
}
