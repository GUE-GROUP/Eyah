import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, ToggleLeft, ToggleRight } from 'lucide-react';
import { rooms as roomsData } from '../../data/rooms';
import type { Room } from '../../types';

const AdminRooms: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Add availability status to rooms
    const roomsWithStatus = roomsData.map(room => ({
      ...room,
      isAvailable: true
    }));
    setRooms(roomsWithStatus as any);
  }, [navigate]);

  const toggleAvailability = (roomId: string) => {
    setRooms(prev =>
      prev.map(room =>
        room.id === roomId ? { ...room, isAvailable: !(room as any).isAvailable } : room
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-dark">Rooms Management</h1>
              <p className="text-sm text-gray-600">Manage room availability and details</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room: any) => (
            <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-dark mb-1">{room.name}</h3>
                    <p className="text-2xl font-bold text-accent">₦{room.price.toLocaleString()}/night</p>
                  </div>
                  <button
                    onClick={() => toggleAvailability(room.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    {room.isAvailable ? (
                      <ToggleRight size={32} className="text-green-500" />
                    ) : (
                      <ToggleLeft size={32} className="text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">{room.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    room.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {room.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                  </span>
                  <button className="flex items-center gap-2 text-accent hover:text-accent-dark font-semibold">
                    <Edit size={16} />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminRooms;
