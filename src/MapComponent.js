import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import io from "socket.io-client";

const socket = io("https://map-app-realtime.onrender.com");

function MapComponent() {
  const [position, setPosition] = useState(null);
  const [users, setUsers] = useState({});

  useEffect(() => {
    // Pegar localização do utilizador
    navigator.geolocation.watchPosition((pos) => {
      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      setPosition(coords);
      socket.emit("send-location", coords);
    });

    // Receber utilizadores conectados
    socket.on("users-update", (data) => {
      setUsers(data);
    });

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

      {Object.values(users).map((user, index) => (
        <Marker key={index} position={[user.lat, user.lng]}>
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