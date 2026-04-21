import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const Workout = () => {
  const [workouts, setWorkouts] = useState([]);
  const [prs, setPRs] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [showPRs, setShowPRs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    exerciseName: '',
    weight: '',
    reps: '',
    sets: '3',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [workoutsData, prsData] = await Promise.all([
        api.workouts.get(date),
        api.workouts.getPRs(),
      ]);
      setWorkouts(workoutsData);
      setPRs(prsData);
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
      const result = await api.workouts.create({ ...formData, date });
      if (result.isPR) {
        alert('🎉 New Personal Record! Congratulations!');
      }
      setFormData({ exerciseName: '', weight: '', reps: '', sets: '3' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating workout:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this workout entry?')) {
      try {
        await api.workouts.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting workout:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">← Back</Link>
            <h1 className="text-xl font-bold">Workout Tracker</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPRs(!showPRs)}
              className="px-3 py-1 border rounded hover:bg-gray-50"
            >
              {showPRs ? 'Hide PRs' : '⭐ PRs'}
            </button>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded px-3 py-1"
            />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {showPRs && prs.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-yellow-800 mb-3">🏆 Personal Records</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {prs.map(pr => (
                <div key={pr.exerciseName} className="bg-white rounded p-3 flex justify-between">
                  <span className="font-medium">{pr.exerciseName}</span>
                  <span className="text-gray-600">
                    {pr.maxWeight}kg × {pr.maxReps} = {pr.maxVolume} vol
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full bg-green-500 text-white py-3 rounded-lg mb-6 hover:bg-green-600"
        >
          {showForm ? 'Cancel' : '+ Add Workout'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Exercise name (e.g., Bench Press, Squat)"
                  value={formData.exerciseName}
                  onChange={(e) => setFormData({ ...formData, exerciseName: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <input
                type="number"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Reps"
                value={formData.reps}
                onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                required
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Sets"
                value={formData.sets}
                onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
              <button
                type="submit"
                className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : workouts.length === 0 ? (
          <p className="text-center text-gray-500">No workouts logged for this day</p>
        ) : (
          <div className="space-y-2">
            {workouts.map(workout => (
              <div key={workout.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                <div>
                  <span className="font-medium text-lg">{workout.exerciseName}</span>
                  {workout.isPR && <span className="ml-2 text-yellow-500 text-xl">⭐</span>}
                  <div className="text-gray-600 mt-1">
                    {workout.sets} sets × {workout.reps} reps @ {workout.weight}kg
                    <span className="ml-2 text-sm text-gray-400">
                      (Volume: {workout.volume})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(workout.id)}
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

export default Workout;