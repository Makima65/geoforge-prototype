import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiMapPin } from 'react-icons/fi';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;

const createCustomIcon = (color) => {
  const iconMarkup = renderToStaticMarkup(
    <div style={{ color: color, filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.5))' }}>
      <FiMapPin size={32} />
    </div>
  );
  return L.divIcon({
    html: iconMarkup,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const iconGreen = createCustomIcon('#3ecf8e');
const iconBlue = createCustomIcon('#3b82f6');
const iconTarget = createCustomIcon('#eab308'); // Yellow target

const STORES = [
  { id: 1, name: 'Alexan Commercial', type: 'Electronics Supplier', lat: 14.5995, lng: 120.9842, stock: 'High' },
  { id: 2, name: 'Deeco Electronics', type: 'Components & Tools', lat: 14.6010, lng: 120.9830, stock: 'Medium' },
  { id: 3, name: 'DataBlitz SM North', type: 'Consumer Tech', lat: 14.6568, lng: 121.0289, stock: 'Low' },
  { id: 4, name: 'MakerLab Electronics', type: 'DIY Maker Kits', lat: 14.6300, lng: 121.0425, stock: 'High' },
  { id: 5, name: 'E-Gizmo Mechatronix', type: 'Robotics Parts', lat: 14.5645, lng: 120.9934, stock: 'High' },
  { id: 6, name: 'Circuitrocks', type: 'Arduino & Sensors', lat: 14.6288, lng: 121.0336, stock: 'Medium' },
  { id: 7, name: 'Circuit Help', type: '3D Printing & Electronics', lat: 14.6360, lng: 121.1000, stock: 'Low' },
  { id: 8, name: 'PC Express Gilmore', type: 'Computer Hardware', lat: 14.6158, lng: 121.0333, stock: 'Medium' },
  { id: 9, name: 'RS Components (Makati)', type: 'Industrial Electronics', lat: 14.5547, lng: 121.0244, stock: 'High' },
  { id: 10, name: 'Octagon Megamall', type: 'Cables & Peripherals', lat: 14.5843, lng: 121.0571, stock: 'Low' }
];

// Dark mode tile layer (CartoDB Dark Matter)
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export default function StoreMap({ locationQuery, pinType = 'maker' }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;
    
    // Initialize map once
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: [14.6091, 121.0223],
        zoom: 12,
        zoomControl: false
      });

      L.tileLayer(TILE_URL, {
        attribution: ATTRIBUTION
      }).addTo(mapInstance.current);
    }

    const map = mapInstance.current;

    // Clear existing markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    if (pinType === 'maker') {
      map.setView([14.6091, 121.0223], 12);
      STORES.forEach((store) => {
        const icon = store.stock === 'High' ? iconGreen : iconBlue;
        const marker = L.marker([store.lat, store.lng], { icon }).addTo(map);
        markersRef.current.push(marker);
        
        const badgeColor = store.stock === 'High' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';
        
        marker.bindPopup(`
          <div class="p-1">
            <h3 class="font-bold text-gray-900 text-sm mb-1">${store.name}</h3>
            <p class="text-xs text-gray-600 mb-2">${store.type}</p>
            <div class="flex items-center text-xs font-semibold">
              <span class="px-2 py-0.5 rounded-full ${badgeColor}">
                ${store.stock} Stock Match
              </span>
            </div>
          </div>
        `, { className: 'custom-popup' });
      });
    } else if (pinType === 'ngo' && locationQuery) {
      // Dynamic Target Location Fetching via Nominatim
      const query = encodeURIComponent(`${locationQuery}, Philippines`);
      fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            map.setView([lat, lon], 13);
            
            const marker = L.marker([lat, lon], { icon: iconTarget }).addTo(map);
            markersRef.current.push(marker);
            
            marker.bindPopup(`
              <div class="p-1 text-center">
                <h3 class="font-bold text-gray-900 text-sm mb-1 uppercase text-yellow-600">TARGET ZONE</h3>
                <p class="text-xs text-gray-600">${locationQuery}</p>
              </div>
            `, { className: 'custom-popup' }).openPopup();
          } else {
            console.warn("Location not found via Nominatim.");
          }
        })
        .catch(err => console.error("Geocoding failed:", err));
    }

  }, [locationQuery, pinType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl relative z-0">
      <div ref={mapRef} style={{ height: '100%', width: '100%', minHeight: '400px', background: '#0A0A0A' }} />
      <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
        }
        .leaflet-popup-tip {
          background: white;
        }
        .custom-leaflet-icon {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}
