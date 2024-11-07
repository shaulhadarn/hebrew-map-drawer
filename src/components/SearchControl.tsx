import { useState } from 'react';
import { useMap } from 'react-leaflet';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { toast } from './ui/use-toast';

const SearchControl = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const map = useMap();

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        map.setView([parseFloat(lat), parseFloat(lon)], 16);
      } else {
        toast({
          title: "לא נמצאו תוצאות",
          description: "נסה לחפש מיקום אחר",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "שגיאה בחיפוש",
        description: "אירעה שגיאה בעת החיפוש, אנא נסה שוב",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] flex gap-2 bg-white p-2 rounded-md shadow-md">
      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="חפש מיקום..."
        className="w-64"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <Button onClick={handleSearch} variant="outline" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchControl;