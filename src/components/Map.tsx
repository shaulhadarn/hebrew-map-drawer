import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-draw';
import { PolygonData } from '../types/polygon';
import { PolygonModal } from './PolygonModal';
import { SavedPolygonsPanel } from './SavedPolygonsPanel';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import SearchControl from './SearchControl';

// Configure Leaflet Draw measurement formatting
L.drawLocal.draw.handlers.polygon.tooltip.start = 'לחץ כדי להתחיל לצייר פוליגון';
L.drawLocal.draw.handlers.polygon.tooltip.cont = 'לחץ להמשך ציור הפוליגון';
L.drawLocal.draw.handlers.polygon.tooltip.end = 'לחץ על הנקודה הראשונה לסיום';

// Add area measurement formatting
L.GeometryUtil.readableArea = (area: number) => {
  const dunams = area / 10000;
  return dunams.toFixed(2) + ' דונם';
};

const MapDrawControl = () => {
  const map = useMap();
  const [showModal, setShowModal] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState<PolygonData | null>(null);
  const [savedPolygons, setSavedPolygons] = useState<PolygonData[]>([]);

  useEffect(() => {
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
          metric: true,
          feet: false,
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
      const estimatedPrice = area * 0.5;

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

    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED);
    };
  }, [map, savedPolygons.length]);

  const handleSavePolygon = (polygon: PolygonData) => {
    setSavedPolygons([...savedPolygons, polygon]);
    setShowModal(false);
  };

  const handleDeletePolygon = (id: string) => {
    setSavedPolygons(savedPolygons.filter((p) => p.id !== id));
  };

  return (
    <>
      {showModal && currentPolygon && (
        <PolygonModal
          polygon={currentPolygon}
          onClose={() => setShowModal(false)}
          onSave={handleSavePolygon}
        />
      )}
    </>
  );
};

const Map = () => {
  const [savedPolygons, setSavedPolygons] = useState<PolygonData[]>([]);
  const [showSavedPanel, setShowSavedPanel] = useState(false);

  const handleDeletePolygon = (id: string) => {
    setSavedPolygons(savedPolygons.filter((p) => p.id !== id));
  };

  return (
    <div className="relative h-screen">
      <MapContainer center={[31.7683, 35.2137]} zoom={8} className="h-full">
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={20}
        />
        <SearchControl />
        <MapDrawControl />
      </MapContainer>
      
      <button
        onClick={() => setShowSavedPanel(true)}
        className="absolute top-4 right-4 bg-white px-4 py-2 rounded-md shadow-md z-[1000] font-rubik"
      >
        פוליגונים שמורים
      </button>

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