import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Food from './pages/Food';
import Workout from './pages/Workout';
import Sleep from './pages/Sleep';
import Progress from './pages/Progress';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/food"
        element={
          <ProtectedRoute>
            <Food />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workout"
        element={
          <ProtectedRoute>
            <Workout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sleep"
        element={
          <ProtectedRoute>
            <Sleep />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;