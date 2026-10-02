"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet marker icons in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type Location = { lat: number; lng: number };

function LocationMarker({ location, setLocation }: { location: Location | null, setLocation: (loc: Location) => void }) {
  const map = useMapEvents({
    click(e) {
      setLocation(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return location === null ? null : (
    <Marker position={location} icon={customIcon}></Marker>
  );
}

function MapUpdater({ location }: { location: Location | null }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location, 16);
    }
  }, [location, map]);
  return null;
}

export default function LocationPicker({ 
  onLocationSelect 
}: { 
  onLocationSelect: (lat: number, lng: number) => void 
}) {
  const [position, setPosition] = useState<Location | null>(null);
  
  // Center default to Malang, Indonesia
  const defaultCenter: [number, number] = [-7.9797, 112.6304];

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(newLoc);
          onLocationSelect(newLoc.lat, newLoc.lng);
        },
        (err) => {
          console.warn("Gagal mendapatkan lokasi otomatis: " + err.message);
        }
      );
    } else {
      console.warn("Browser Anda tidak mendukung Geolocation.");
    }
  };

  // Automatically request location on component mount
  useEffect(() => {
    handleGetCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocationUpdate = (loc: Location) => {
    setPosition(loc);
    onLocationSelect(loc.lat, loc.lng);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block font-medium">Pin Lokasi Penjemputan / Pengantaran</label>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
        >
          📍 Gunakan Lokasi Saat Ini
        </button>
      </div>
      
      <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300 z-0 relative">
        {/* We use position: relative and z-index 0 to keep the map behind popups/dropdowns */}
        <MapContainer 
          center={defaultCenter} 
          zoom={13} 
          scrollWheelZoom={true} 
          style={{ height: "100%", width: "100%", zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker location={position} setLocation={handleLocationUpdate} />
          <MapUpdater location={position} />
        </MapContainer>
      </div>
    </div>
  );
}
