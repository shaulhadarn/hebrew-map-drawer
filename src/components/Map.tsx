import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-draw';
import { PolygonData } from '../types/polygon';
import { PolygonModal } from './PolygonModal';
import { SavedPolygonsPanel } from './SavedPolygonsPanel';

const Map = () => {
  const mapRef = useRef<L.Map | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState<PolygonData | null>(null);
  const [savedPolygons, setSavedPolygons] = useState<PolygonData[]>([]);
  const [showSavedPanel, setShowSavedPanel] = useState(false);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map').setView([31.7683, 35.2137], 8);

      L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }).addTo(map);

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      const drawControl = new L.Control.Draw({
        draw: {
          marker: false,
          circle: false,
          circlemarker: false,
          rectangle: false,
          polyline: false,
          polygon: {
            allowIntersection: false,
            showArea: true,
          },
        },
        edit: {
          featureGroup: drawnItems,
        },
      });

      map.addControl(drawControl);

      map.on(L.Draw.Event.CREATED, (e: any) => {
        const layer = e.layer;
        drawnItems.addLayer(layer);
        
        const coordinates = layer.getLatLngs()[0].map((latLng: L.LatLng) => [
          latLng.lat,
          latLng.lng,
        ]);
        
        const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        const estimatedPrice = area * 0.5; // Example price calculation

        const newPolygon: PolygonData = {
          id: Date.now().toString(),
          coordinates,
          area,
          estimatedPrice,
          createdAt: new Date().toISOString(),
          name: `פוליגון ${savedPolygons.length + 1}`,
        };

        setCurrentPolygon(newPolygon);
        setShowModal(true);
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [savedPolygons.length]);

  const handleSavePolygon = (polygon: PolygonData) => {
    setSavedPolygons([...savedPolygons, polygon]);
    setShowModal(false);
  };

  const handleDeletePolygon = (id: string) => {
    setSavedPolygons(savedPolygons.filter((p) => p.id !== id));
  };

  return (
    <div className="relative h-screen">
      <div id="map" className="h-full" />
      
      <button
        onClick={() => setShowSavedPanel(true)}
        className="absolute top-4 right-4 bg-white px-4 py-2 rounded-md shadow-md z-[1000] font-rubik"
      >
        פוליגונים שמורים
      </button>

      {showModal && currentPolygon && (
        <PolygonModal
          polygon={currentPolygon}
          onClose={() => setShowModal(false)}
          onSave={handleSavePolygon}
        />
      )}

      {showSavedPanel && (
        <SavedPolygonsPanel
          polygons={savedPolygons}
          onClose={() => setShowSavedPanel(false)}
          onDelete={handleDeletePolygon}
        />
      )}
    </div>
  );
};

export default Map;