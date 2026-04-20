import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [todayData, setTodayData] = useState({
    foods: [],
    workouts: [],
    sleep: [],
  });
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foods, workouts, sleep] = await Promise.all([
          api.foods.get(today),
          api.workouts.get(today),
          api.sleep.get(today),
        ]);
        setTodayData({ foods, workouts, sleep });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [today]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('firebaseToken');
    navigate('/login');
  };

  const totalCalories = todayData.foods.reduce((sum, f) => sum + (f.calories || 0), 0);
  const totalProtein = todayData.foods.reduce((sum, f) => sum + (f.protein || 0), 0);
  const totalCarbs = todayData.foods.reduce((sum, f) => sum + (f.carbs || 0), 0);
  const totalFat = todayData.foods.reduce((sum, f) => sum + (f.fat || 0), 0);

  const prCount = todayData.workouts.filter(w => w.isPR).length;

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
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Daily Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.displayName || user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Today's Overview - {today}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/food" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2">🍽️ Food</h3>
              <p className="text-3xl font-bold text-blue-600">{totalCalories}</p>
              <p className="text-gray-500">calories</p>
              <div className="mt-2 text-sm text-gray-600">
                <span>P: {totalProtein}g</span>
                <span className="mx-2">|</span>
                <span>C: {totalCarbs}g</span>
                <span className="mx-2">|</span>
                <span>F: {totalFat}g</span>
              </div>
            </div>
          </Link>

          <Link to="/workout" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2">🏋️ Workout</h3>
              <p className="text-3xl font-bold text-green-600">{todayData.workouts.length}</p>
              <p className="text-gray-500">exercises</p>
              {prCount > 0 && (
                <p className="mt-2 text-sm text-yellow-600 font-semibold">⭐ {prCount} PR{prCount > 1 ? 's' : ''} today!</p>
              )}
            </div>
          </Link>

          <Link to="/sleep" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2">😴 Sleep</h3>
              {todayData.sleep.length > 0 ? (
                <>
                  <p className="text-3xl font-bold text-purple-600">{todayData.sleep[0].duration}h</p>
                  <p className="text-gray-500">duration</p>
                  <p className="mt-2 text-sm text-gray-600">Quality: {todayData.sleep[0].quality}</p>
                </>
              ) : (
                <p className="text-gray-500">No data yet</p>
              )}
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Meals</h3>
            {todayData.foods.length === 0 ? (
              <p className="text-gray-500">No meals logged today</p>
            ) : (
              <ul className="space-y-2">
                {todayData.foods.slice(0, 5).map(food => (
                  <li key={food.id} className="flex justify-between border-b pb-2">
                    <span>{food.name}</span>
                    <span className="text-gray-600">{food.calories} cal</span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/food" className="block mt-4 text-blue-500 hover:underline">View all →</Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Workouts</h3>
            {todayData.workouts.length === 0 ? (
              <p className="text-gray-500">No workouts logged today</p>
            ) : (
              <ul className="space-y-2">
                {todayData.workouts.slice(0, 5).map(workout => (
                  <li key={workout.id} className="flex justify-between border-b pb-2">
                    <span>
                      {workout.exerciseName}
                      {workout.isPR && <span className="ml-2 text-yellow-500">⭐</span>}
                    </span>
                    <span className="text-gray-600">{workout.weight}kg × {workout.reps}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/workout" className="block mt-4 text-blue-500 hover:underline">View all →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;