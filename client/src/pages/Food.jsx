import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const Food = () => {
  const [foods, setFoods] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    mealType: 'breakfast',
  });

  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.foods.get(date);
      setFoods(data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.foods.create({ ...formData, date });
      setFormData({ name: '', calories: '', protein: '', carbs: '', fat: '', mealType: 'breakfast' });
      setShowForm(false);
      fetchFoods();
    } catch (error) {
      console.error('Error creating food:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this food entry?')) {
      try {
        await api.foods.delete(id);
        fetchFoods();
      } catch (error) {
        console.error('Error deleting food:', error);
      }
    }
  };

  const totalCalories = foods.reduce((sum, f) => sum + (f.calories || 0), 0);
  const totalProtein = foods.reduce((sum, f) => sum + (f.protein || 0), 0);
  const totalCarbs = foods.reduce((sum, f) => sum + (f.carbs || 0), 0);
  const totalFat = foods.reduce((sum, f) => sum + (f.fat || 0), 0);

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">← Back</Link>
            <h1 className="text-xl font-bold">Food Tracker</h1>
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
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{totalCalories}</p>
              <p className="text-sm text-gray-500">Calories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{totalProtein}g</p>
              <p className="text-sm text-gray-500">Protein</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">{totalCarbs}g</p>
              <p className="text-sm text-gray-500">Carbs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">{totalFat}g</p>
              <p className="text-sm text-gray-500">Fat</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full bg-blue-500 text-white py-3 rounded-lg mb-6 hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : '+ Add Food'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Food name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <input
                type="number"
                placeholder="Calories"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
              <select
                value={formData.mealType}
                onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              >
                {mealTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Protein (g)"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Carbs (g)"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Fat (g)"
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
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
        ) : foods.length === 0 ? (
          <p className="text-center text-gray-500">No food logged for this day</p>
        ) : (
          <div className="space-y-4">
            {mealTypes.map(mealType => {
              const mealFoods = foods.filter(f => f.mealType === mealType);
              if (mealFoods.length === 0) return null;
              return (
                <div key={mealType} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 font-semibold capitalize">
                    {mealType}
                  </div>
                  <ul>
                    {mealFoods.map(food => (
                      <li key={food.id} className="px-4 py-3 border-b last:border-b-0 flex justify-between items-center">
                        <div>
                          <span className="font-medium">{food.name}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            {food.calories} cal | P: {food.protein}g C: {food.carbs}g F: {food.fat}g
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(food.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Food;