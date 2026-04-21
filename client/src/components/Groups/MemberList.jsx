const MemberList = ({ members, isAdmin, onRemove }) => {
  if (!members || members.length === 0) {
    return <p className="text-gray-500 text-sm">No members yet</p>;
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div key={member.uid} className="flex items-center justify-between bg-gray-50 p-2 rounded">
          <div>
            <span className="font-medium">{member.displayName}</span>
            {member.role === 'admin' && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                Admin
              </span>
            )}
          </div>
          {isAdmin && member.role !== 'admin' && onRemove && (
            <button
              onClick={() => onRemove(member.uid)}
              className="text-red-500 text-sm hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MemberList;