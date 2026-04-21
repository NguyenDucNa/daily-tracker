import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ScheduleSuggest = ({ groupId }) => {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSuggestion = async () => {
      try {
        const data = await api.groups.suggest(groupId);
        setSuggestion(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSuggestion();
  }, [groupId]);

  if (loading) return <div className="p-4">Loading...</div>;

  if (!suggestion?.suggestedSlots?.length) {
    return (
      <div className="text-center p-4 text-gray-500">
        <p>No common time slots found.</p>
        <p className="text-sm mt-1">Ask members to set their availability.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Suggested Schedule</h3>
        <span className={`text-xs px-2 py-1 rounded ${
          suggestion.confidence === 'high' ? 'bg-green-100 text-green-700' :
          suggestion.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {suggestion.confidence} confidence
        </span>
      </div>

      <div className="space-y-2">
        {suggestion.suggestedSlots.map((slot, index) => (
          <div key={index} className="bg-green-50 border border-green-200 rounded p-3">
            <span className="font-medium">{DAYS[slot.dayOfWeek]}</span>
            <span className="text-gray-600">
              {' '}{slot.start} - {slot.end}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        Times when ALL members are available
      </p>
    </div>
  );
};

export default ScheduleSuggest;