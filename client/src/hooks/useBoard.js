import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';

export function useBoard(boardId) {
  const { socket, connected } = useSocket();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial state via REST
  useEffect(() => {
    if (!boardId) return;
    setLoading(true);
    fetch(`${SERVER_URL}/api/boards/${boardId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Board not found');
        return r.json();
      })
      .then((data) => {
        setBoard(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [boardId]);

  // Join board room and subscribe to socket events
  useEffect(() => {
    if (!boardId || !socket.current) return;
    const s = socket.current;
    s.emit('join_board', boardId);

    const onBoardState = (state) => setBoard(state);

    const onColumnAdded = (column) => {
      setBoard((prev) => prev ? { ...prev, columns: [...prev.columns, { ...column, cards: [] }] } : prev);
    };

    const onColumnDeleted = ({ columnId }) => {
      setBoard((prev) => prev ? { ...prev, columns: prev.columns.filter((c) => c.id !== columnId) } : prev);
    };

    const onCardAdded = (card) => {
      setBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns.map((col) => {
            if (col.id !== card.column_id) return col;
            
            // Filter out optimistic cards with same content to prevent dupes
            const filteredCards = col.cards.filter(c => 
              !(c.id.startsWith('temp-') && c.content === card.content) && c.id !== card.id
            );
            
            return { ...col, cards: [...filteredCards, { ...card, reactions: [], replies: [] }] };
          }),
        };
      });
    };

    const onCardDeleted = ({ cardId }) => {
      setBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns.map((col) => ({
            ...col,
            cards: col.cards.filter((c) => c.id !== cardId),
          })),
        };
      });
    };

    const onReplyAdded = (reply) => {
      setBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns.map((col) => ({
            ...col,
            cards: col.cards.map((card) => {
              if (card.id !== reply.card_id) return card;
              const filteredReplies = (card.replies || []).filter(r => 
                !(r.id.startsWith('temp-') && r.content === reply.content) && r.id !== reply.id
              );
              return { ...card, replies: [...filteredReplies, reply] };
            }),
          })),
        };
      });
    };

    const onReplyDeleted = ({ cardId, replyId }) => {
      setBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns.map((col) => ({
            ...col,
            cards: col.cards.map((card) =>
              card.id === cardId
                ? { ...card, replies: (card.replies || []).filter((r) => r.id !== replyId) }
                : card
            ),
          })),
        };
      });
    };

    const onReactionUpdated = (reaction) => {
      setBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns.map((col) => ({
            ...col,
            cards: col.cards.map((card) => {
              if (card.id !== reaction.card_id) return card;
              let existing = (card.reactions || []).filter((r) => r.emoji !== reaction.emoji);
              if (reaction.count > 0) {
                existing.push(reaction);
              }
              return { ...card, reactions: existing };
            }),
          })),
        };
      });
    };

    s.on('board_state', onBoardState);
    s.on('column_added', onColumnAdded);
    s.on('column_deleted', onColumnDeleted);
    s.on('card_added', onCardAdded);
    s.on('card_deleted', onCardDeleted);
    s.on('reply_added', onReplyAdded);
    s.on('reply_deleted', onReplyDeleted);
    s.on('reaction_added', onReactionUpdated);
    s.on('reaction_updated', onReactionUpdated);

    return () => {
      s.emit('leave_board', boardId);
      s.off('board_state', onBoardState);
      s.off('column_added', onColumnAdded);
      s.off('column_deleted', onColumnDeleted);
      s.off('card_added', onCardAdded);
      s.off('card_deleted', onCardDeleted);
      s.off('reply_added', onReplyAdded);
      s.off('reply_deleted', onReplyDeleted);
      s.off('reaction_added', onReactionUpdated);
      s.off('reaction_updated', onReactionUpdated);
    };
  }, [boardId, socket, connected]);

  // Actions
  const addColumn = useCallback((title) => {
    socket.current?.emit('add_column', { boardId, title });
  }, [boardId, socket]);

  const deleteColumn = useCallback((columnId) => {
    socket.current?.emit('delete_column', { boardId, columnId });
  }, [boardId, socket]);

  const addCard = useCallback((columnId, content, author, imageUrl) => {
    const tempId = `temp-${Date.now()}`;
    const tempCard = {
      id: tempId,
      column_id: columnId,
      content,
      author,
      image_url: imageUrl,
      position: 9999, // push to bottom optimistically
      reactions: [],
      replies: []
    };

    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === columnId ? { ...col, cards: [...col.cards, tempCard] } : col
        ),
      };
    });

    socket.current?.emit('add_card', { boardId, columnId, content, author, imageUrl });
  }, [boardId, socket]);

  const moveCard = useCallback((cardId, toColumnId, toPosition) => {
    socket.current?.emit('move_card', { boardId, cardId, toColumnId, toPosition });
  }, [boardId, socket]);

  const deleteCard = useCallback((cardId) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns.map((col) => ({
          ...col,
          cards: col.cards.filter((c) => c.id !== cardId),
        })),
      };
    });

    socket.current?.emit('delete_card', { boardId, cardId });
  }, [boardId, socket]);

  const addReply = useCallback((cardId, content, author, imageUrl) => {
    const tempReply = {
      id: `temp-${Date.now()}`,
      card_id: cardId,
      content,
      author,
      image_url: imageUrl,
      created_at: new Date().toISOString()
    };
    
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns.map((col) => ({
          ...col,
          cards: col.cards.map((card) =>
            card.id === cardId
              ? { ...card, replies: [...(card.replies || []), tempReply] }
              : card
          ),
        })),
      };
    });

    socket.current?.emit('add_reply', { boardId, cardId, content, author, imageUrl });
  }, [boardId, socket]);

  const deleteReply = useCallback((cardId, replyId) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns.map((col) => ({
          ...col,
          cards: col.cards.map((card) =>
            card.id === cardId
              ? { ...card, replies: (card.replies || []).filter((r) => r.id !== replyId) }
              : card
          ),
        })),
      };
    });

    socket.current?.emit('delete_reply', { boardId, cardId, replyId });
  }, [boardId, socket]);

  const toggleReaction = useCallback((cardId, emoji, isRemoving) => {
    const event = isRemoving ? 'remove_reaction' : 'add_reaction';
    
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: prev.columns.map((col) => ({
          ...col,
          cards: col.cards.map((card) => {
            if (card.id !== cardId) return card;
            let existing = (card.reactions || []).find(r => r.emoji === emoji);
            let updatedReactions = (card.reactions || []).filter(r => r.emoji !== emoji);
            
            if (isRemoving) {
              if (existing && existing.count > 1) {
                updatedReactions.push({ ...existing, count: existing.count - 1 });
              }
            } else {
              if (existing) {
                updatedReactions.push({ ...existing, count: existing.count + 1 });
              } else {
                updatedReactions.push({ id: `temp-${Date.now()}`, card_id: cardId, emoji, count: 1 });
              }
            }
            return { ...card, reactions: updatedReactions };
          }),
        })),
      };
    });

    socket.current?.emit(event, { boardId, cardId, emoji });
  }, [boardId, socket]);

  return { board, setBoard, loading, error, addColumn, deleteColumn, addCard, moveCard, deleteCard, addReply, deleteReply, toggleReaction };
}
