import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fallbackProvinces, Province } from './data/provinces';

// Configuración de iconos
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GymIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const UserIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Añadir nuevo icono para parques nacionales
const ParkIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Tipos de datos simplificados
interface Gym {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name: string;
  };
}

interface NationalPark {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name: string;
  };
}

interface Location {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name: string;
    description?: string;
    website?: string;
    opening_hours?: string;
    phone?: string;
  };
  osmDetails?: {
    address?: string;
    type?: string;
    rating?: number;
    reviews?: number;
  };
}

function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position, map]);
  return null;
}

function App() {
  const [position, setPosition] = useState<[number, number]>([40.4168, -3.7038]);
  const [gyms, setGyms] = useState<Location[]>([]);
  const [parks, setParks] = useState<NationalPark[]>([]);
  const [loading, setLoading] = useState({ gyms: false, parks: false });
  const [selectedProvince, setSelectedProvince] = useState<string>('28');

  const searchGyms = async () => {
    setLoading(prev => ({ ...prev, gyms: true }));
    try {
      const bounds = getProvinceBounds(selectedProvince);
      const [southWest, northEast] = bounds;
      const query = `
        [out:json];
        (
          node["leisure"="sports_centre"](${southWest[0]},${southWest[1]},${northEast[0]},${northEast[1]});
          way["leisure"="sports_centre"](${southWest[0]},${southWest[1]},${northEast[0]},${northEast[1]});
        );
        out center;
      `;
      
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );
      
      const data = await response.json();
      setGyms(data.elements.map((element: any) => ({
        id: element.id,
        lat: element.lat || element.center.lat,
        lon: element.lon || element.center.lon,
        tags: element.tags || {}
      })));
    } catch (error) {
      console.error("Error buscando gimnasios:", error);
    } finally {
      setLoading(prev => ({ ...prev, gyms: false }));
    }
  };

  const searchParks = async () => {
    setLoading(prev => ({ ...prev, parks: true }));
    try {
      const bounds = getProvinceBounds(selectedProvince);
      const [southWest, northEast] = bounds;
      const query = `
        [out:json];
        (
          node["leisure"="park"](${southWest[0]},${southWest[1]},${northEast[0]},${northEast[1]});
          way["leisure"="park"](${southWest[0]},${southWest[1]},${northEast[0]},${northEast[1]});
        );
        out center;
      `;
      
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );
      
      const data = await response.json();
      setParks(data.elements.map((element: any) => ({
        id: element.id,
        lat: element.lat || element.center.lat,
        lon: element.lon || element.center.lon,
        tags: element.tags || {}
      })));
    } catch (error) {
      console.error("Error buscando parques:", error);
    } finally {
      setLoading(prev => ({ ...prev, parks: false }));
    }
  };

  return (
    <div className="app-container">
      <h1>Gimnasios y Parques en España</h1>
      
      <div className="controls">
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
        >
          {fallbackProvinces.map(province => (
            <option key={province.codigo} value={province.codigo}>
              {province.nombre}
            </option>
          ))}
        </select>
        
        <button 
          onClick={searchGyms}
          disabled={loading.gyms}
        >
          {loading.gyms ? 'Buscando...' : 'Buscar Gimnasios'}
        </button>

        <button 
          onClick={searchParks}
          disabled={loading.parks}
        >
          {loading.parks ? 'Buscando...' : 'Buscar Parques'}
        </button>
      </div>

      <div className="map-container">
        <MapContainer 
          center={position} 
          zoom={10} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater position={position} />
          
          {gyms.map(gym => (
            <Marker 
              key={`gym-${gym.id}`}
              position={[gym.lat, gym.lon]}
              icon={GymIcon}
            >
              <Popup>
                <h3>{gym.tags.name || 'Gimnasio'}</h3>
              </Popup>
            </Marker>
          ))}

          {parks.map(park => (
            <Marker 
              key={`park-${park.id}`}
              position={[park.lat, park.lon]}
              icon={ParkIcon}
            >
              <Popup>
                <h3>{park.tags.name || 'Parque'}</h3>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

// Función auxiliar para coordenadas aproximadas
function getProvinceBounds(code: string): [[number, number], [number, number]] {
  const bounds: Record<string, [[number, number], [number, number]]> = {
    '28': [[40.35, -3.9], [40.55, -3.6]], // Madrid
    '08': [[41.3, 2.0], [41.5, 2.3]],     // Barcelona
    '46': [[39.4, -0.4], [39.5, -0.3]],   // Valencia
    '41': [[37.2, -6.2], [37.6, -5.8]],   // Sevilla
    '50': [[41.5, -1.2], [42.0, -0.7]],   // Zaragoza
    '03': [[38.2, -0.9], [38.8, -0.1]],   // Alicante
    '29': [[36.6, -4.6], [36.9, -4.3]],   // Málaga
    '48': [[43.1, -3.1], [43.4, -2.8]],   // Vizcaya
    '26': [[42.2, -2.6], [42.5, -2.3]],   // La Rioja
    '33': [[43.2, -6.1], [43.6, -5.5]],   // Asturias
    '35': [[27.8, -15.8], [29.3, -13.3]], // Las Palmas
    '38': [[28.0, -17.9], [28.5, -16.1]]  // Santa Cruz de Tenerife
  };
  return bounds[code] || [[40.0, -4.0], [41.0, -3.0]]; // Default para provincias no mapeadas
}

export default App;