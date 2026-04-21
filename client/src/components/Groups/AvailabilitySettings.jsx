import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AvailabilitySettings = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      const data = await api.availability.get();
      const availMap = {};
      data.forEach(a => {
        availMap[a.dayOfWeek] = a.timeSlots || [];
      });
      setAvailability(availMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotChange = (day, index, field, value) => {
    setAvailability(prev => {
      const updated = { ...prev };
      if (!updated[day]) updated[day] = [];
      updated[day] = [...(updated[day] || [])];
      updated[day][index] = { ...updated[day][index], [field]: value };
      return updated;
    });
  };

  const addSlot = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), { start: '06:00', end: '08:00' }],
    }));
  };

  const removeSlot = (day, index) => {
    setAvailability(prev => {
      const updated = { ...prev };
      updated[day] = (updated[day] || []).filter((_, i) => i !== index);
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = Object.entries(availability).map(([day, slots]) => ({
        dayOfWeek: parseInt(day),
        timeSlots: slots,
      }));
      await api.availability.set(payload);
      alert('Availability saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Your Availability</h3>
      <p className="text-sm text-gray-600">Set your available times for each day</p>

      {DAYS.map((dayName, dayIndex) => (
        <div key={dayIndex} className="border rounded p-3">
          <div className="font-medium mb-2">{dayName}</div>
          <div className="space-y-2">
            {(availability[dayIndex] || []).map((slot, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="time"
                  value={slot.start}
                  onChange={(e) => handleSlotChange(dayIndex, index, 'start', e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  value={slot.end}
                  onChange={(e) => handleSlotChange(dayIndex, index, 'end', e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <button
                  onClick={() => removeSlot(dayIndex, index)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => addSlot(dayIndex)}
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            + Add time slot
          </button>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Availability'}
      </button>
    </div>
  );
};

export default AvailabilitySettings;