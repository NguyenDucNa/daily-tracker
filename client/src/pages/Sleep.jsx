import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const Sleep = () => {
  const [sleepRecords, setSleepRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    bedtime: '',
    wakeTime: '',
    quality: 'good',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sleepData, statsData] = await Promise.all([
        api.sleep.get(date),
        api.sleep.getStats(),
      ]);
      setSleepRecords(sleepData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bedtimeDate = new Date(`${date}T${formData.bedtime}`);
      const wakeTimeDate = new Date(`${date}T${formData.wakeTime}`);
      
      await api.sleep.create({
        bedtime: bedtimeDate.toISOString(),
        wakeTime: wakeTimeDate.toISOString(),
        quality: formData.quality,
        date,
      });
      
      setFormData({ bedtime: '', wakeTime: '', quality: 'good' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating sleep record:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this sleep record?')) {
      try {
        await api.sleep.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting sleep record:', error);
      }
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">← Back</Link>
            <h1 className="text-xl font-bold">Sleep Tracker</h1>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-3 py-1"
          />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {stats && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="font-semibold mb-3">📊 7-Day Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.averageDuration}h</p>
                <p className="text-sm text-gray-500">Avg Duration</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.totalRecords}</p>
                <p className="text-sm text-gray-500">Days Logged</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {stats.qualityCounts?.good || 0}
                </p>
                <p className="text-sm text-gray-500">Good Sleep Days</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full bg-purple-500 text-white py-3 rounded-lg mb-6 hover:bg-purple-600"
        >
          {showForm ? 'Cancel' : '+ Add Sleep'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Bedtime</label>
                <input
                  type="time"
                  value={formData.bedtime}
                  onChange={(e) => setFormData({ ...formData, bedtime: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Wake Time</label>
                <input
                  type="time"
                  value={formData.wakeTime}
                  onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Quality</label>
                <select
                  value={formData.quality}
                  onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="good">Good</option>
                  <option value="medium">Medium</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 mt-5"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : sleepRecords.length === 0 ? (
          <p className="text-center text-gray-500">No sleep data for this day</p>
        ) : (
          <div className="space-y-2">
            {sleepRecords.map(record => (
              <div key={record.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-lg">{record.duration}h</span>
                    {record.quality === 'good' && <span className="text-green-500">✓</span>}
                    {record.quality === 'medium' && <span className="text-yellow-500">~</span>}
                    {record.quality === 'poor' && <span className="text-red-500">✗</span>}
                  </div>
                  <div className="text-gray-600 mt-1">
                    {formatTime(record.bedtime)} → {formatTime(record.wakeTime)}
                  </div>
                  <div className="text-sm text-gray-400 capitalize">
                    Quality: {record.quality}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sleep;