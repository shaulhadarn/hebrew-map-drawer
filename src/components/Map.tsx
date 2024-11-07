import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-draw';
import { PolygonData } from '../types/polygon';
import { PolygonModal } from './PolygonModal';
import { SavedPolygonsPanel } from './SavedPolygonsPanel';
import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import SearchControl from './SearchControl';

const MapDrawControl = () => {
  const map = useMap();
  const [showModal, setShowModal] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState<PolygonData | null>(null);
  const [savedPolygons, setSavedPolygons] = useState<PolygonData[]>([]);
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  useEffect(() => {
    if (!map) return;

    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      if (featureGroupRef.current) {
        featureGroupRef.current.addLayer(layer);
      }
      
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
      map.off(L.Draw.Event.CREATED);
    };
  }, [map, savedPolygons.length]);

  const handleSavePolygon = (polygon: PolygonData) => {
    setSavedPolygons([...savedPolygons, polygon]);
    setShowModal(false);
  };

  return (
    <>
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topleft"
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            polygon: {
              allowIntersection: false,
              showArea: true,
            },
          }}
        />
      </FeatureGroup>
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
        className="absolute top-4 right-4 bg-white px-4 py-2 rounded-md shadow-md z-[1000] font-rubik hover:bg-gray-50"
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