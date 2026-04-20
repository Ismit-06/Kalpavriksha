import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 justify-end text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="text-primary w-6 h-6" />
              <span className="font-extrabold text-xl text-white tracking-tight">Kalpavriksha</span>
            </Link>
            <p className="text-sm text-gray-400">
              Transforming the agricultural supply chain by connecting farmers directly to commercial kitchens and retail spaces.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="w-5 h-5"/></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5"/></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5"/></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5"/></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/#how-it-works" className="hover:text-primary transition-colors">How it Works</a></li>
              <li><a href="/#benefits" className="hover:text-primary transition-colors">Benefits</a></li>
              <li><Link to="/register-farmer" className="hover:text-primary transition-colors">For Farmers</Link></li>
              <li><Link to="/register-buyer" className="hover:text-primary transition-colors">For Businesses</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>123 AgriTech Valley,<br/>Innovation Park, 94043</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+1 (800) 555-0199</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>support@kalpavriksha.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Kalpavriksha. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed for a sustainable future.</p>
        </div>
      </div>
    </footer>
  );
}
