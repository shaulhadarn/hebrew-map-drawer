import { PolygonData } from '../types/polygon';

interface SavedPolygonsPanelProps {
  polygons: PolygonData[];
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const SavedPolygonsPanel = ({
  polygons,
  onClose,
  onDelete,
}: SavedPolygonsPanelProps) => {
  return (
    <div className="absolute top-0 left-0 h-full w-80 bg-white shadow-lg z-[1000] font-rubik">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">פוליגונים שמורים</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {polygons.length === 0 ? (
          <p className="text-gray-500 text-center mt-8">
            אין פוליגונים שמורים עדיין
          </p>
        ) : (
          <div className="space-y-4">
            {polygons.map((polygon) => (
              <div
                key={polygon.id}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-medium">{polygon.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  שטח: {(polygon.area / 10000).toFixed(2)} דונם
                </p>
                <p className="text-sm text-gray-600">
                  מחיר: ₪{polygon.estimatedPrice.toFixed(2)}
                </p>
                <div className="mt-2 flex justify-end space-x-2 space-x-reverse">
                  <button
                    onClick={() => onDelete(polygon.id)}
                    className="text-red-600 text-sm hover:text-red-700"
                  >
                    מחק
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};