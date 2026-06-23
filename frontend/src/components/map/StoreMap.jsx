import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

const STORES = [
  { id: 1, name: 'Alexan Commercial', type: 'Electronics Supplier', lat: 14.5995, lng: 120.9842, stock: 'High' },
  { id: 2, name: 'Deeco Electronics', type: 'Components & Tools', lat: 14.6010, lng: 120.9830, stock: 'Medium' },
  { id: 3, name: 'DataBlitz SM North', type: 'Consumer Tech', lat: 14.6568, lng: 121.0289, stock: 'Low' },
  { id: 4, name: 'MakerLab Electronics', type: 'DIY Maker Kits', lat: 14.6300, lng: 121.0425, stock: 'High' },
  { id: 5, name: 'E-Gizmo Mechatronix', type: 'Robotics Parts', lat: 14.5645, lng: 120.9934, stock: 'High' }
];

// Dark mode tile layer (CartoDB Dark Matter)
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export default function StoreMap() {
  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl relative z-0">
      <MapContainer 
        center={[14.6091, 121.0223]} 
        zoom={12} 
        style={{ height: '100%', width: '100%', minHeight: '400px', background: '#0A0A0A' }}
        zoomControl={false}
      >
        <TileLayer
          url={TILE_URL}
          attribution={ATTRIBUTION}
        />
        {STORES.map((store) => (
          <Marker 
            key={store.id} 
            position={[store.lat, store.lng]}
            icon={store.stock === 'High' ? iconGreen : iconBlue}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <h3 className="font-bold text-gray-900 text-sm mb-1">{store.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{store.type}</p>
                <div className="flex items-center text-xs font-semibold">
                  <span className={`px-2 py-0.5 rounded-full ${store.stock === 'High' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {store.stock} Stock Match
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
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
