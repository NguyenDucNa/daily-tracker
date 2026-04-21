import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import GroupCard from '../components/Groups/GroupCard';
import CreateGroupModal from '../components/Groups/CreateGroupModal';
import JoinGroupModal from '../components/Groups/JoinGroupModal';

const Groups = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const loadGroups = useCallback(async () => {
    try {
      const data = await api.groups.getAll();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('firebaseToken');
    navigate('/login');
  };

  const handleCreateSuccess = () => {
    loadGroups();
  };

  const handleJoinSuccess = () => {
    loadGroups();
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
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="text-xl font-bold text-gray-800">Daily Tracker</Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">Dashboard</Link>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Groups</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowJoin(true)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Join Group
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Create Group
            </button>
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">You haven't joined any groups yet</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setShowJoin(true)}
                className="text-blue-500 hover:underline"
              >
                Join a group
              </button>
              <span className="text-gray-400">or</span>
              <button
                onClick={() => setShowCreate(true)}
                className="text-blue-500 hover:underline"
              >
                Create one
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </div>

      <CreateGroupModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={handleCreateSuccess}
      />

      <JoinGroupModal
        isOpen={showJoin}
        onClose={() => setShowJoin(false)}
        onSuccess={handleJoinSuccess}
      />
    </div>
  );
};

export default Groups;