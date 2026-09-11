import './PresencePopover.css';

export default function PresencePopover({ presenceList, ownUsername, connected }) {
  if (!connected) return null;

  const named = presenceList.filter((u) => !u.isAnonymous);
  const anonCount = presenceList.filter((u) => u.isAnonymous).length;
  const total = presenceList.length;

  return (
    <div className="presence-popover">
      <div className="presence-popover-title">
        {total} {total === 1 ? 'person' : 'people'} online
      </div>
      <div className="presence-list">
        {named.map((u, i) => (
          <div key={i} className="presence-user">
            <span className="presence-user-dot" />
            <span className="presence-user-name">
              {u.username}
              {u.username === ownUsername && <span className="presence-you"> (you)</span>}
            </span>
          </div>
        ))}
        {anonCount > 0 && (
          <div className="presence-anon">
            + {anonCount} anonymous
          </div>
        )}
      </div>
    </div>
  );
}
