import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import io from "socket.io-client";
import L from "leaflet";

const socket = io("https://map-app-realtime.onrender.com");

const myIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const otherIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function MapComponent() {
  const [position, setPosition] = useState(null); 
  const [users, setUsers] = useState({}); 

  useEffect(() => {
    navigator.geolocation.watchPosition((pos) => {
      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setPosition(coords);
      socket.emit("send-location", coords); 
    });

   
    socket.on("users-update", (data) => {
      setUsers(data);
    });

   
    return () => {
      socket.off("users-update");
    };
  }, []);

  return (
    <MapContainer
      center={position || [-25.9653, 32.5892]} 
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

     
      {Object.entries(users).map(([id, user]) => (
        <Marker
          key={id}
          position={[user.lat, user.lng]}
          icon={id === socket.id ? myIcon : otherIcon} 
        >
          <Popup>
            Latitude: {user.lat} <br />
            Longitude: {user.lng}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;