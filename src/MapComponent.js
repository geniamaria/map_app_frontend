import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import io from "socket.io-client";
import L from "leaflet";

const socket = io("https://map-app-realtime.onrender.com");

// Ícone do utilizador atual
const myIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Ícone dos outros utilizadores
const otherIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Componente para recentralizar o mapa
function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], 15);
    }
  }, [position, map]);

  return null;
}

function MapComponent() {
  const [position, setPosition] = useState(null);
  const [users, setUsers] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada pelo navegador.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setPosition(coords);
        socket.emit("send-location", coords);
      },
      (err) => {
        setError("Permissão de localização negada ou erro ao obter posição.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    socket.on("users-update", (data) => {
      setUsers(data);
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.off("users-update");
    };
  }, []);

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  if (!position) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h2>A obter localização...</h2>
      </div>
    );
  }

  return (
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap position={position} />

      {Object.entries(users).map(([id, user]) => (
        <Marker
          key={id}
          position={[user.lat, user.lng]}
          icon={id === socket.id ? myIcon : otherIcon}
        >
          <Popup>
            <strong>{id === socket.id ? "Você" : "Outro utilizador"}</strong>
            <br />
            Latitude: {user.lat}
            <br />
            Longitude: {user.lng}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;