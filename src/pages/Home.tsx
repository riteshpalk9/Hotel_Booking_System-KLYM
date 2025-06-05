import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { roomService, Room } from "../services/roomService";
import RoomFilter from "../components/room/RoomFilter";
import RoomCard from "../components/room/RoomCard";

const Home = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedRooms = async () => {
      try {
        const { data, error } = await roomService.getAllRooms();

        if (error) throw error;

        // Get a subset of rooms for featured display
        setFeaturedRooms(data?.slice(0, 3) || []);
      } catch (error) {
        console.error("Failed to load featured rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedRooms();
  }, []);

  const handleFilter = (filters: {
    checkIn: string;
    checkOut: string;
    guests: number;
    maxPrice?: number;
  }) => {
    // Navigate to rooms page with filter params
    navigate("/rooms", {
      state: {
        checkIn: filters.checkIn,
        checkOut: filters.checkOut,
        guests: filters.guests,
        maxPrice: filters.maxPrice,
      },
    });
  };

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat h-[80vh] flex items-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg')",
        }}
      >
        <div className="absolute inset-0"></div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Experience Luxury and Comfort
            </h1>
            <p className="text-xl text-primary-50 mb-8">
              Book your perfect stay with our premium accommodations and
              exceptional service.
            </p>
            <Link to="/rooms" className="btn-primary text-base">
              Explore Rooms
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container-custom -mt-16 relative z-20 mb-16">
        <RoomFilter onFilter={handleFilter} />
      </section>

      {/* Featured Rooms Section */}
      <section className="container-custom mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary-800 mb-3">
            Featured Rooms
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Experience the pinnacle of luxury with our carefully selected rooms,
            designed for your comfort and relaxation.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse bg-neutral-200 h-64 rounded-lg max-w-md mx-auto"></div>
            <div className="mt-4 animate-pulse bg-neutral-200 h-6 rounded max-w-xs mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/rooms" className="btn-outline inline-flex">
            View All Rooms
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-neutral-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-primary-800 mb-3">
              Why Choose Majestic Heaven
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              We pride ourselves on providing exceptional service and amenities
              that make your stay memorable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-card text-center">
              <div className="bg-primary-50 text-primary-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">
                Premium Locations
              </h3>
              <p className="text-neutral-600">
                Our properties are situated in the most desirable locations,
                offering convenience and stunning views.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-card text-center">
              <div className="bg-primary-50 text-primary-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">
                Exceptional Service
              </h3>
              <p className="text-neutral-600">
                Our dedicated staff is committed to providing personalized
                service that exceeds expectations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-card text-center">
              <div className="bg-primary-50 text-primary-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">
                Luxury Amenities
              </h3>
              <p className="text-neutral-600">
                From premium bedding to state-of-the-art facilities, we ensure
                your comfort at every touchpoint.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
