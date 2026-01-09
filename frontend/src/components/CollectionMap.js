import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './CollectionMap.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function CollectionMap({ dropOffs }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use API data or fallback to sample data
    if (dropOffs && dropOffs.length > 0) {
      setLocations(dropOffs);
    } else {
      // Sample locations in Philippines (Metro Manila area)
      setLocations([
        {
          id: 1,
          name: 'Burol 1 Barangay Hall',
          address: 'Main Street, Barangay',
          latitude: 14.3260,
          longitude: 120.9625,
          schedule: 'Friday - Saturday, 9:00 AM - 5:00 PM',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Burol 1 Community Center',
          address: 'Secondary Road, Barangay',
          latitude: 14.3260,
          longitude: 120.9625,
          schedule: 'Friday - Saturday, 10:00 AM - 4:00 PM',
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Burol 1 Market Area',
          address: 'Public Market, Market Street',
          latitude: 14.3260,
          longitude: 120.9625,
          schedule: 'Friday - Saturday, 8:00 AM - 6:00 PM',
          created_at: new Date().toISOString()
        }
      ]);
    }
    setLoading(false);
  }, [dropOffs]);

  const defaultCenter = [14.5994, 120.9842]; // Default to first location

  return (
    <section id="map" className="collection-map">
      <div className="container">
        <h2 className="section-title">Collection Schedule & Drop-off Map</h2>
        <p className="section-subtitle">
          Find the nearest drop-off point and check collection schedules
        </p>

        <div className="map-container">
          <div className="map-wrapper">
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <MapContainer center={defaultCenter} zoom={15} className="leaflet-map">
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
                      <div className="popup-content">
                        <h3>{location.name}</h3>
                        <p><strong>Address:</strong> {location.address}</p>
                        <p><strong>Schedule:</strong> {location.schedule}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          <div className="locations-list">
            <h3>Drop-off Locations</h3>
            <div className="locations-scroll">
              {locations.map((location) => (
                <div key={location.id} className="location-card">
                  <div className="location-header">
                    <h4>{location.name}</h4>
                    <span className="location-pin">📍</span>
                  </div>
                  <p className="location-address">{location.address}</p>
                  <p className="location-schedule">
                    <strong>Schedule:</strong> {location.schedule}
                  </p>
                </div>
              ))}
            </div>

            <div className="map-note">
              <p>
                <strong>📢 Note:</strong> Further updates on collection schedules and temporary closures will be posted on our Barangay Facebook page. Please check regularly for announcements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CollectionMap;
