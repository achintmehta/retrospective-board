import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';

export function usePresence(boardId, ownUsername) {
  const { socket, connected } = useSocket();
  const [presenceList, setPresenceList] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Keep a ref so the stable listener closure always sees the latest ownUsername
  // without needing to re-register listeners when it changes
  const ownUsernameRef = useRef(ownUsername);
  useEffect(() => { ownUsernameRef.current = ownUsername; }, [ownUsername]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (!socket.current || !connected) return;
    const s = socket.current;

    const onPresenceUpdated = ({ users }) => {
      setPresenceList(users || []);
    };

    const onUserJoined = ({ username }) => {
      if (!username || username === ownUsernameRef.current) return;
      setToasts((prev) => {
        if (prev.length >= 3) return prev;
        const id = Date.now() + Math.random();
        setTimeout(() => removeToast(id), 3000);
        return [...prev, { id, username }];
      });
    };

    s.on('presence_updated', onPresenceUpdated);
    s.on('user_joined', onUserJoined);

    return () => {
      s.off('presence_updated', onPresenceUpdated);
      s.off('user_joined', onUserJoined);
    };
  }, [socket, connected, removeToast]); // ownUsername removed — read via ref instead

  return { presenceList, toasts, removeToast };
}
