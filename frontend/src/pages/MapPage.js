import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FaMapMarkerAlt, FaClock, FaPhone } from 'react-icons/fa';
import './MapPage.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapPage({ dropOffs }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dropOffs && dropOffs.length > 0) {
      setLocations(dropOffs);
    } else {
      setLocations([
        {
          id: 1,
          name: 'Burol 1 Barangay Hall',
          address: 'Burol 1, Dasmariñas Cavite, Zone A',
          latitude: 14.3260,
          longitude: 120.9625,
          schedule: 'Friday - Saturday, 9:00 AM - 5:00 PM',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Burol 1 Community Center',
          address: 'Burol 1, Dasmariñas Cavite, Zone B',
          latitude: 14.3260,
          longitude: 120.9625,
          schedule: 'Friday - Saturday, 10:00 AM - 4:00 PM',
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Burol 1 Market Area',
          address: 'Burol 1, Dasmariñas Cavite, Zone C',
          latitude: 14.3260,
          longitude: 120.9625,
          schedule: 'Friday - Saturday, 8:00 AM - 6:00 PM',
          created_at: new Date().toISOString()
        }
      ]);
    }
    setLoading(false);
  }, [dropOffs]);

  const defaultCenter = [14.3260, 120.9625]; // Burol 1, Dasmariñas Cavite

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Drop-off Locations</h1>
          <p className="text-emerald-100 text-lg">Find the nearest collection point and check schedules</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {loading ? (
                <div className="h-96 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    <p className="mt-4 text-gray-600">Loading map...</p>
                  </div>
                </div>
              ) : (
                <MapContainer center={defaultCenter} zoom={15} className="h-96 sm:h-[500px] w-full">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  {locations.map((location) => (
                    <Marker
                      key={location.id}
                      position={[location.latitude, location.longitude]}
                    >
                      <Popup>
                        <div className="p-2">
                          <h4 className="font-bold text-gray-900 mb-2">{location.name}</h4>
                          <p className="text-sm text-gray-700 mb-1"><strong>📍 Address:</strong> {location.address}</p>
                          <p className="text-sm text-gray-700"><strong>🕐 Schedule:</strong> {location.schedule}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>
          </div>

          {/* Locations List Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Locations</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {locations.map((location, index) => (
                  <div key={location.id} className="p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-600 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="text-emerald-600 text-xl mt-1">
                        <FaMapMarkerAlt />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">{location.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{location.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700 mt-3 pt-3 border-t border-gray-200">
                      <FaClock className="text-emerald-600" />
                      <span>{location.schedule}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>📢 Tip:</strong> Check our updates page for schedule changes and announcements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View - Locations Cards */}
        <div className="lg:hidden mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Locations</h2>
          <div className="space-y-4">
            {locations.map((location) => (
              <div key={location.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-emerald-600 text-2xl">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{location.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 mt-4 pt-4 border-t border-gray-200">
                  <FaClock className="text-emerald-600" />
                  <span>{location.schedule}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
