import { useState } from 'react';
import { api } from '../../services/api';

const JoinGroupModal = ({ isOpen, onClose, onSuccess }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await api.groups.join(inviteCode);
      onSuccess(result);
      setInviteCode('');
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid invite code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Join Group</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Invite Code (e.g., ABC123)"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            required
            maxLength={6}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Joining...' : 'Join'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinGroupModal;