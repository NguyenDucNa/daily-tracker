import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { api } from '../services/api';

const Progress = () => {
  const [foodData, setFoodData] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [sleepStats, setSleepStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [foods, workouts, sleep] = await Promise.all([
        api.foods.get(new Date().toISOString().split('T')[0]),
        api.workouts.getAll(),
        api.sleep.getStats(),
      ]);
      
      setFoodData(foods);
      setWorkoutData(workouts);
      setSleepStats(sleep);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLast7DaysFood = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayFoods = foodData.filter(f => f.date?.startsWith(dateStr));
      days.push({
        date: dateStr.slice(5),
        calories: dayFoods.reduce((sum, f) => sum + (f.calories || 0), 0),
        protein: dayFoods.reduce((sum, f) => sum + (f.protein || 0), 0),
      });
    }
    return days;
  };

  const getLast7DaysWorkout = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayWorkouts = workoutData.filter(w => w.date?.startsWith(dateStr));
      days.push({
        date: dateStr.slice(5),
        volume: dayWorkouts.reduce((sum, w) => sum + (w.volume || 0), 0),
        count: dayWorkouts.length,
      });
    }
    return days;
  };

  const getLast7DaysSleep = () => {
    if (!sleepStats?.records) return [];
    return sleepStats.records.slice(0, 7).map(r => ({
      date: new Date(r.date).toISOString().slice(5),
      duration: r.duration,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">← Back</Link>
            <h1 className="text-xl font-bold">Progress & Analytics</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">📈 Daily Calories (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={getLast7DaysFood()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calories" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">🥩 Protein Intake (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getLast7DaysFood()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="protein" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">🏋️ Workout Volume (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getLast7DaysWorkout()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">😴 Sleep Duration (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={getLast7DaysSleep()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 12]} />
                <Tooltip />
                <Line type="monotone" dataKey="duration" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Summary Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {foodData.reduce((sum, f) => sum + (f.calories || 0), 0)}
              </p>
              <p className="text-sm text-gray-600">Today's Calories</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-500">
                {foodData.reduce((sum, f) => sum + (f.protein || 0), 0)}g
              </p>
              <p className="text-sm text-gray-600">Today's Protein</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {workoutData.filter(w => w.isPR).length}
              </p>
              <p className="text-sm text-gray-600">Total PRs</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {sleepStats?.averageDuration || 0}h
              </p>
              <p className="text-sm text-gray-600">Avg Sleep (7 days)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;