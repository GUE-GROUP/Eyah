import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, ToggleLeft, ToggleRight, Plus, Trash2, X, Upload, Loader2 } from 'lucide-react';
import { useToast } from '../../components/ToastContainer';
import { supabase } from '../../lib/supabase';
import type { Room } from '../../types';

interface RoomFormData {
  name: string;
  description: string;
  price: number;
  image: string;
  features: string[];
  capacity: number;
  is_available: boolean;
}

const AdminRooms: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    description: '',
    price: 0,
    image: '',
    features: [],
    capacity: 2,
    is_available: true
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadRooms();
  }, [navigate]);

  const loadRooms = async () => {
    console.group('🏨 Admin Rooms - Loading');
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('✅ Rooms loaded:', data?.length);
      setRooms(data || []);
    } catch (error: any) {
      console.error('❌ Error loading rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  const toggleAvailability = async (roomId: string, currentStatus: boolean) => {
    console.log('🔄 Toggling availability for room:', roomId);
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ is_available: !currentStatus })
        .eq('id', roomId);

      if (error) throw error;

      setRooms(prev =>
        prev.map(room =>
          room.id === roomId ? { ...room, is_available: !currentStatus } : room
        )
      );
      
      toast.success(`Room ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      console.log('✅ Availability toggled');
    } catch (error: any) {
      console.error('❌ Error toggling availability:', error);
      toast.error('Failed to update room status');
    }
  };

  const openAddModal = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      features: [],
      capacity: 2,
      is_available: true
    });
    setShowModal(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description || '',
      price: room.price,
      image: room.image || '',
      features: room.features || [],
      capacity: room.capacity,
      is_available: room.is_available
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRoom(null);
    setFeatureInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'capacity' ? Number(value) : value
    }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast.warning('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    console.group(editingRoom ? '✏️ Updating Room' : '➕ Adding Room');
    console.log('Form data:', formData);

    try {
      if (editingRoom) {
        // Update existing room
        const { error } = await supabase
          .from('rooms')
          .update({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            image: formData.image,
            features: formData.features,
            capacity: formData.capacity,
            is_available: formData.is_available,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingRoom.id);

        if (error) throw error;
        
        toast.success('Room updated successfully!');
        console.log('✅ Room updated');
      } else {
        // Add new room
        const { error } = await supabase
          .from('rooms')
          .insert([{
            name: formData.name,
            description: formData.description,
            price: formData.price,
            image: formData.image,
            features: formData.features,
            capacity: formData.capacity,
            is_available: formData.is_available
          }]);

        if (error) throw error;
        
        toast.success('Room added successfully!');
        console.log('✅ Room added');
      }

      closeModal();
      loadRooms(); // Reload rooms
    } catch (error: any) {
      console.error('❌ Error saving room:', error);
      toast.error(error.message || 'Failed to save room');
    } finally {
      setSubmitting(false);
      console.groupEnd();
    }
  };

  const deleteRoom = async (roomId: string, roomName: string) => {
    if (!confirm(`Are you sure you want to delete "${roomName}"? This action cannot be undone.`)) {
      return;
    }

    console.log('🗑️ Deleting room:', roomId);
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;

      setRooms(prev => prev.filter(room => room.id !== roomId));
      toast.success('Room deleted successfully');
      console.log('✅ Room deleted');
    } catch (error: any) {
      console.error('❌ Error deleting room:', error);
      toast.error('Failed to delete room');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <Plus size={20} />
              Add New Room
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No rooms found. Add your first room!</p>
            <button onClick={openAddModal} className="btn-primary">
              <Plus className="inline mr-2" size={20} />
              Add Room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img src={room.image || '/images/img (7).jpg'} alt={room.name} className="w-full h-48 object-cover" />
                  <button
                    onClick={() => toggleAvailability(room.id, room.is_available)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
                  >
                    {room.is_available ? (
                      <ToggleRight size={28} className="text-green-500" />
                    ) : (
                      <ToggleLeft size={28} className="text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-dark mb-1">{room.name}</h3>
                    <p className="text-2xl font-bold text-accent">₦{room.price.toLocaleString()}/night</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{room.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {room.features?.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                    {room.features && room.features.length > 3 && (
                      <span className="text-xs text-gray-500">+{room.features.length - 3}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      room.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {room.is_available ? 'AVAILABLE' : 'UNAVAILABLE'}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(room)}
                        className="flex items-center gap-1 text-accent hover:text-accent-dark font-semibold text-sm"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteRoom(room.id, room.name)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold text-sm"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Room Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Room Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g., COMFY DELUX"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  placeholder="Describe the room..."
                />
              </div>

              {/* Price and Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price per Night (₦) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="40000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Capacity (Guests) *
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="2"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="https://example.com/image.jpg or /images/room.jpg"
                  />
                  <button
                    type="button"
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    title="Upload image"
                  >
                    <Upload size={20} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter image URL or upload an image</p>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Features
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="e.g., Free WiFi"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-700">Room Availability</p>
                  <p className="text-sm text-gray-500">Set if this room is available for booking</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, is_available: !prev.is_available }))}
                  className="p-2"
                >
                  {formData.is_available ? (
                    <ToggleRight size={40} className="text-green-500" />
                  ) : (
                    <ToggleLeft size={40} className="text-gray-400" />
                  )}
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Saving...' : (editingRoom ? 'Update Room' : 'Add Room')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
