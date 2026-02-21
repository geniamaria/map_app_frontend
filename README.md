# 🌍 Aplicação de Mapa em Tempo Real

## 📌 Descrição
Esta é uma aplicação web em tempo real que exibe as coordenadas geográficas (latitude e longitude) de todos os usuários conectados em um mapa ao vivo.

Cada usuário pode:

- Visualizar sua própria localização  
- Ver outros usuários conectados em tempo real  
- Observar atualizações ao vivo quando os usuários se conectam, se movem ou se desconectam  

O sistema utiliza **WebSockets** para comunicação em tempo real.

---

## 🚀 Demonstração ao Vivo
Frontend: [map-app-frontend-j0r1rkn8t-geniamarias-projects.vercel.app][https://map-app-frontend-j0r1rkn8t-geniamarias-projects.vercel.app/]
Backend: [https://map-app-realtime.onrender.com]
---

## 🛠 Tecnologias Utilizadas

### Frontend
- React  
- Leaflet  
- Socket.IO Client  

### Backend
- Node.js  
- Express  
- Socket.IO  

---

## 🧠 Como Funciona

1. O navegador solicita permissão para geolocalização.  
2. As coordenadas do usuário são enviadas para o servidor via WebSocket.  
3. O servidor armazena os usuários ativos na memória.  
4. Todos os clientes conectados recebem atualizações em tempo real.  
5. Marcadores são exibidos no mapa para cada usuário conectado.  

---

## ⚙️ Instalação (Configuração Local)

### Backend
```bash
cd backend
npm install
node server.js