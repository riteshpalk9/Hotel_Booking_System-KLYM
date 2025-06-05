import { Hotel, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Hotel size={24} className="text-gold-400" />
              <span className="text-xl font-semibold">Majestic Haven</span>
            </div>
            <p className="text-primary-100 text-sm mt-2">
              Where luxury meets exceptional hospitality. Experience the epitome of refined comfort.
            </p>
            <div className="flex items-center gap-2 mt-4 text-primary-100">
              <Mail size={16} />
              <span className="text-sm">contact@majestichaven.com</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-primary-100">
              <Phone size={16} />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-100 hover:text-white text-sm transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-primary-100 hover:text-white text-sm transition-colors duration-200">
                  Rooms
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="text-primary-100 hover:text-white text-sm transition-colors duration-200">
                  Manage Bookings
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-primary-100 hover:text-white text-sm transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-primary-100 hover:text-white text-sm transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-primary-100 hover:text-white text-sm transition-colors duration-200">
                  Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-primary-100 text-sm mb-4">
              Subscribe to receive exclusive offers and updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 text-sm rounded-l-md bg-primary-800 border-primary-700 text-white placeholder-primary-300 focus:outline-none flex-grow"
              />
              <button className="bg-gold-500 hover:bg-gold-600 text-primary-900 px-3 py-2 text-sm font-medium rounded-r-md transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-8 pt-8 text-center text-primary-200 text-sm">
          <p>© {currentYear} Majestic Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;