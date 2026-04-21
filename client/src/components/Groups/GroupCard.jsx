import { useNavigate } from 'react-router-dom';

const GroupCard = ({ group }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/groups/${group.id}`)}
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
    >
      <h3 className="font-semibold text-lg">{group.name}</h3>
      <p className="text-gray-600 text-sm">
        {group.members?.length || 0} members
      </p>
      <div className="mt-2 text-xs text-gray-500">
        Code: <span className="font-mono bg-gray-100 px-1 rounded">{group.inviteCode}</span>
      </div>
    </div>
  );
};

export default GroupCard;