import { Link } from 'react-router-dom';
import { Users, Wifi, Coffee, Tv } from 'lucide-react';
import { Room } from '../../services/roomService';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  // Function to render amenity icons
  const renderAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wi-fi':
        return <Wifi size={16} className="text-primary-600" />;
      case 'coffee maker':
        return <Coffee size={16} className="text-primary-600" />;
      case 'tv':
        return <Tv size={16} className="text-primary-600" />;
      default:
        return null;
    }
  };

  // Get the first 3 amenities to display as icons
  const displayAmenities = room.amenities.slice(0, 3);

  return (
    <div className="card group animate-enter h-full flex flex-col">
      {/* Room Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={room.image_url}
          alt={`${room.type} room`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-0 right-0 bg-primary-800 text-white px-3 py-1 text-sm font-medium">
          ${room.price.toFixed(2)}/night
        </div>
      </div>

      {/* Room Details */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-primary-800">{room.type} Room</h3>
          <div className="flex items-center gap-1 text-neutral-600">
            <Users size={16} />
            <span className="text-sm">Up to {room.capacity}</span>
          </div>
        </div>
        
        <p className="text-sm text-neutral-600 mb-4 flex-grow">{room.description}</p>
        
        {/* Amenities */}
        <div className="flex items-center gap-3 mb-4">
          {displayAmenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-1 text-xs text-neutral-500">
              {renderAmenityIcon(amenity)}
              <span>{amenity}</span>
            </div>
          ))}
          {room.amenities.length > 3 && (
            <div className="text-xs text-neutral-500">
              +{room.amenities.length - 3} more
            </div>
          )}
        </div>

        {/* Book Now Button */}
        <div className="mt-auto">
          <Link
            to={`/rooms/${room.id}`}
            className="btn-primary w-full text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;