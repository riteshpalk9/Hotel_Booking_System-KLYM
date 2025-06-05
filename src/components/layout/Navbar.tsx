import { Link, useLocation } from 'react-router-dom';
import { Hotel, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-primary-800 font-semibold">
            <Hotel size={24} className="text-primary-600" />
            <span className="text-xl">Majestic Haven</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`text-sm transition-colors duration-200 ${
                isActive('/') 
                ? 'text-primary-700 font-semibold' 
                : 'text-neutral-600 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/rooms"
              className={`text-sm transition-colors duration-200 ${
                isActive('/rooms') 
                ? 'text-primary-700 font-semibold' 
                : 'text-neutral-600 hover:text-primary-600'
              }`}
            >
              Rooms
            </Link>
            <Link
              to="/bookings"
              className={`text-sm transition-colors duration-200 ${
                isActive('/bookings') 
                ? 'text-primary-700 font-semibold' 
                : 'text-neutral-600 hover:text-primary-600'
              }`}
            >
              Manage Bookings
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-neutral-700 focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white mt-4 py-4 px-2 rounded-lg shadow-lg animate-slideUp">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`px-4 py-2 rounded-md ${
                  isActive('/') 
                  ? 'bg-primary-50 text-primary-700 font-semibold' 
                  : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/rooms"
                className={`px-4 py-2 rounded-md ${
                  isActive('/rooms') 
                  ? 'bg-primary-50 text-primary-700 font-semibold' 
                  : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Rooms
              </Link>
              <Link
                to="/bookings"
                className={`px-4 py-2 rounded-md ${
                  isActive('/bookings') 
                  ? 'bg-primary-50 text-primary-700 font-semibold' 
                  : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Manage Bookings
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;