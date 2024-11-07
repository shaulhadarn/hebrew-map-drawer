import { useState } from 'react';
import { PolygonData } from '../types/polygon';

interface PolygonModalProps {
  polygon: PolygonData;
  onClose: () => void;
  onSave: (polygon: PolygonData) => void;
}

export const PolygonModal = ({ polygon, onClose, onSave }: PolygonModalProps) => {
  const [name, setName] = useState(polygon.name);

  const handleSubmit = () => {
    onSave({ ...polygon, name });
  };

  const handleSendToDrone = () => {
    alert('נשלח לחברת הרחפנים בהצלחה!');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content font-rubik">
        <h2 className="text-2xl font-bold mb-4">פרטי פוליגון</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">שם</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">שטח</label>
            <p className="p-2 bg-gray-50 rounded-md">
              {polygon.area.toFixed(2)} מ"ר
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">מחיר משוער</label>
            <p className="p-2 bg-gray-50 rounded-md">
              ₪{polygon.estimatedPrice.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4 space-x-reverse">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            ביטול
          </button>
          <button
            onClick={handleSendToDrone}
            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90"
          >
            שלח לחברת רחפנים
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            שמור פוליגון
          </button>
        </div>
      </div>
    </div>
  );
};