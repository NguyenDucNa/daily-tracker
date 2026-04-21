import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import MemberList from '../components/Groups/MemberList';
import AvailabilitySettings from '../components/Groups/AvailabilitySettings';
import ScheduleSuggest from '../components/Groups/ScheduleSuggest';

const GroupDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule');

  useEffect(() => {
    loadGroup();
  }, [id]);

  const loadGroup = async () => {
    try {
      const data = await api.groups.get(id);
      setGroup(data);
    } catch (err) {
      console.error('Error fetching group:', err);
      navigate('/groups');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => {
    const member = group?.members?.find(m => m.uid === user?.uid);
    return member?.role === 'admin';
  };

  const handleLeave = async () => {
    if (confirm('Are you sure you want to leave this group?')) {
      try {
        await api.groups.leave(id);
        navigate('/groups');
      } catch {
        alert('Failed to leave group');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Group not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/groups" className="text-gray-600 hover:text-gray-800">← Back</Link>
            <h1 className="text-xl font-bold text-gray-800">{group.name}</h1>
          </div>
          <div className="text-sm text-gray-500 font-mono">
            Code: {group.inviteCode}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow mb-4">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-3 px-4 ${activeTab === 'schedule' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            >
              Suggested Schedule
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 py-3 px-4 ${activeTab === 'members' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            >
              Members
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`flex-1 py-3 px-4 ${activeTab === 'availability' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            >
              My Availability
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'schedule' && (
              <ScheduleSuggest groupId={id} />
            )}

            {activeTab === 'members' && (
              <MemberList
                members={group.members}
                isAdmin={isAdmin()}
              />
            )}

            {activeTab === 'availability' && (
              <AvailabilitySettings />
            )}
          </div>
        </div>

        <button
          onClick={handleLeave}
          className="w-full bg-red-100 text-red-700 py-2 rounded hover:bg-red-200"
        >
          Leave Group
        </button>
      </div>
    </div>
  );
};

export default GroupDetail;