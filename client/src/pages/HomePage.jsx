import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useSocket } from '../contexts/SocketContext';
import { useSettings } from '../contexts/SettingsContext';
import SettingsModal from '../components/SettingsModal';
import './HomePage.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';

export default function HomePage() {
  const { socket, connected } = useSocket();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [groups, setGroups] = useState([]);
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [newBoardName, setNewBoardName] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [creating, setCreating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('classic-dark');
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { settings, updateSettings } = useSettings();

  // Load board list
  useEffect(() => {
    fetch(`${SERVER_URL}/api/boards`)
      .then((r) => r.json())
      .then(setBoards)
      .catch(console.error);

    fetch(`${SERVER_URL}/api/groups`)
      .then((r) => r.json())
      .then(setGroups)
      .catch(console.error);
  }, []);

  // Live board creation/deletion events
  useEffect(() => {
    if (!socket.current) return;
    const s = socket.current;
    const onCreated = (board) => setBoards((prev) => [board, ...prev]);
    const onDeleted = ({ boardId }) => setBoards((prev) => prev.filter((b) => b.id !== boardId));
    
    const onGroupCreated = (group) => setGroups((prev) => [...prev, group]);
    const onGroupDeleted = ({ groupId }) => {
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
      // Boards belonging to this group will now have NULL group_id on server.
      // We should update our local state too.
      setBoards((prev) => prev.map(b => b.group_id === groupId ? { ...b, group_id: null } : b));
    };
    const onBoardMoved = ({ boardId, groupId }) => {
      setBoards((prev) => prev.map(b => b.id === boardId ? { ...b, group_id: groupId } : b));
    };
    const onSettingsUpdated = (newSettings) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    s.on('board_created', onCreated);
    s.on('board_deleted', onDeleted);
    s.on('group_created', onGroupCreated);
    s.on('group_deleted', onGroupDeleted);
    s.on('board_moved_to_group', onBoardMoved);
    s.on('settings_updated', onSettingsUpdated);

    return () => {
      s.off('board_created', onCreated);
      s.off('board_deleted', onDeleted);
      s.off('group_created', onGroupCreated);
      s.off('group_deleted', onGroupDeleted);
      s.off('board_moved_to_group', onBoardMoved);
      s.off('settings_updated', onSettingsUpdated);
    };
  }, [socket, connected]);

  const handleCreate = (e) => {
    e.preventDefault();
    const name = newBoardName.trim() || 'Retro Board';
    if (!socket.current) return;
    setCreating(true);
    socket.current.emit('create_board', { name, theme: selectedTheme }, ({ ok, board }) => {
      setCreating(false);
      if (ok) {
        setNewBoardName('');
        setSelectedTheme('classic-dark');
        navigate(`/board/${board.id}`);
      }
    });
  };

  const handleDelete = (e, boardId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this board permanently?')) return;
    socket.current?.emit('delete_board', { boardId });
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    const name = newGroupName.trim();
    if (!name || !socket.current) return;
    socket.current.emit('create_group', { name }, ({ ok }) => {
      if (ok) setNewGroupName('');
    });
  };

  const handleDeleteGroup = (groupId) => {
    if (!window.confirm('Delete this group? Boards inside will be preserved and moved to the "General" section.')) return;
    socket.current?.emit('delete_group', { groupId });
  };

  const handleRemoveFromGroup = (e, boardId) => {
    e.preventDefault();
    e.stopPropagation();
    socket.current?.emit('move_board_to_group', { boardId, groupId: null });
  };

  const toggleGroupCollapse = (groupId) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const onDragEnd = (result) => {
    const { draggableId, destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const boardId = draggableId;
    const toGroupId = destination.droppableId === 'ungrouped' ? null : destination.droppableId.replace('group-', '');

    // Optimistic UI update
    setBoards((prev) => prev.map(b => b.id === boardId ? { ...b, group_id: toGroupId } : b));

    // Emit to server
    socket.current?.emit('move_board_to_group', { boardId, groupId: toGroupId });
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleSaveSettings = async (newSettings) => {
    try {
      await updateSettings(newSettings);
      setShowSettings(false);
    } catch (err) {
      alert('Error saving settings.');
    }
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-header-inner">
          <div className="home-logo">
            {settings.app_icon_type === 'emoji' ? (
              <span className="logo-icon">{settings.app_icon_value}</span>
            ) : (
              <img src={`${SERVER_URL}${settings.app_icon_value}`} alt="Logo" className="logo-img" />
            )}
            <div>
              <h1 className="logo-title">{settings.app_title}</h1>
              <p className="logo-sub">{settings.app_subtitle}</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-ghost settings-btn" 
              onClick={() => setShowSettings(true)}
              title="Application Settings"
            >
              <span className="icon-inner">⚙️</span>
            </button>
            <div className="header-divider"></div>
            <div className="header-status">
              <span className={`connection-dot ${connected ? 'online' : ''}`} />
              <span className="status-text">{connected ? 'Live' : 'Connecting…'}</span>
            </div>
          </div>
        </div>
      </header>

      {showSettings && (
        <SettingsModal 
          settings={settings} 
          onSave={handleSaveSettings} 
          onClose={() => setShowSettings(false)} 
        />
      )}

      <main className="home-main">
        <section className="create-section">
          <div className="create-grid">
            <div className="create-box">
              <h2 className="section-title">New Board</h2>
              <form className="create-form-board" onSubmit={handleCreate}>
                <div className="create-board-row">
                  <input
                    type="text"
                    placeholder="Sprint 42 Retrospective…"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" disabled={creating}>
                    {creating ? 'Creating…' : '+ Board'}
                  </button>
                </div>
                <div className="theme-picker">
                  <button
                    type="button"
                    className="theme-picker-toggle"
                    onClick={() => setThemePickerOpen((v) => !v)}
                  >
                    <span className="theme-picker-toggle-swatch" style={{ background: {
                      'classic-dark': 'linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)',
                      'classic-light': 'linear-gradient(135deg, #e8ecf5 0%, #f5f7fb 100%)',
                      'cyberpunk-dark': 'radial-gradient(ellipse at 20% 50%, #1a0030 0%, #0a0010 60%, #001020 100%)',
                      'cyberpunk-light': 'linear-gradient(135deg, #dff0ff 0%, #eef8ff 100%)',
                      'vaporwave-dark': 'linear-gradient(160deg, #1a0533 0%, #2d0d5c 50%, #0d1a4a 100%)',
                      'vaporwave-light': 'linear-gradient(150deg, #fce8ff 0%, #f5e6ff 100%)',
                      'sunset-dark': 'linear-gradient(160deg, #1a0800 0%, #2d1200 50%, #1a0a10 100%)',
                      'sunset-light': 'linear-gradient(150deg, #fff0e0 0%, #fff8f0 100%)',
                      'desert-dark': 'linear-gradient(145deg, #1a1200 0%, #2d2000 100%)',
                      'desert-light': 'linear-gradient(145deg, #faf2df 0%, #fdf8ef 100%)',
                      'artnouveau-dark': 'linear-gradient(150deg, #0e1a0f 0%, #1a2e1a 100%)',
                      'artnouveau-light': 'linear-gradient(150deg, #f5f0e0 0%, #f8f4e8 100%)',
                      'renaissance-dark': 'linear-gradient(145deg, #1a0808 0%, #2e1010 100%)',
                      'renaissance-light': 'linear-gradient(145deg, #faf0dc 0%, #fdf5e8 100%)',
                      'highcontrast-dark': 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
                      'highcontrast-light': 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)',
                      'gruvbox-dark': 'linear-gradient(135deg, #282828 0%, #32302f 100%)',
                      'gruvbox-light': 'linear-gradient(135deg, #f9f5d7 0%, #fbf1c7 100%)',
                      'nord-dark': 'linear-gradient(135deg, #2e3440 0%, #3b4252 100%)',
                      'nord-light': 'linear-gradient(135deg, #eceff4 0%, #e5e9f0 100%)',
                      'solarized-dark': 'linear-gradient(135deg, #002b36 0%, #073642 100%)',
                      'solarized-light': 'linear-gradient(135deg, #fdf6e3 0%, #eee8d5 100%)',
                    }[selectedTheme] || '' }} />
                    <span className="theme-picker-toggle-label">
                      Theme: <strong>{selectedTheme.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</strong>
                    </span>
                    <span className={`theme-picker-chevron${themePickerOpen ? ' open' : ''}`}>▾</span>
                  </button>
                  <div className={`theme-picker-panel${themePickerOpen ? ' open' : ''}`}>
                  <div><div>{[
                    {
                      group: 'Classic',
                      themes: [
                        { id: 'classic-dark',  label: 'Dark',  bg: 'linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)' },
                        { id: 'classic-light', label: 'Light', bg: 'linear-gradient(135deg, #e8ecf5 0%, #f5f7fb 100%)' },
                      ],
                    },
                    {
                      group: 'Cyberpunk',
                      themes: [
                        { id: 'cyberpunk-dark',  label: 'Dark',  bg: 'radial-gradient(ellipse at 20% 50%, #1a0030 0%, #0a0010 60%, #001020 100%)' },
                        { id: 'cyberpunk-light', label: 'Light', bg: 'linear-gradient(135deg, #dff0ff 0%, #eef8ff 100%)' },
                      ],
                    },
                    {
                      group: 'Vaporwave',
                      themes: [
                        { id: 'vaporwave-dark',  label: 'Dark',  bg: 'linear-gradient(160deg, #1a0533 0%, #2d0d5c 50%, #0d1a4a 100%)' },
                        { id: 'vaporwave-light', label: 'Light', bg: 'linear-gradient(150deg, #fce8ff 0%, #f5e6ff 100%)' },
                      ],
                    },
                    {
                      group: 'Sunset',
                      themes: [
                        { id: 'sunset-dark',  label: 'Dark',  bg: 'linear-gradient(160deg, #1a0800 0%, #2d1200 50%, #1a0a10 100%)' },
                        { id: 'sunset-light', label: 'Light', bg: 'linear-gradient(150deg, #fff0e0 0%, #fff8f0 100%)' },
                      ],
                    },
                    {
                      group: 'Desert',
                      themes: [
                        { id: 'desert-dark',  label: 'Dark',  bg: 'linear-gradient(145deg, #1a1200 0%, #2d2000 100%)' },
                        { id: 'desert-light', label: 'Light', bg: 'linear-gradient(145deg, #faf2df 0%, #fdf8ef 100%)' },
                      ],
                    },
                    {
                      group: 'Art Nouveau',
                      themes: [
                        { id: 'artnouveau-dark',  label: 'Dark',  bg: 'linear-gradient(150deg, #0e1a0f 0%, #1a2e1a 100%)' },
                        { id: 'artnouveau-light', label: 'Light', bg: 'linear-gradient(150deg, #f5f0e0 0%, #f8f4e8 100%)' },
                      ],
                    },
                    {
                      group: 'Renaissance',
                      themes: [
                        { id: 'renaissance-dark',  label: 'Dark',  bg: 'linear-gradient(145deg, #1a0808 0%, #2e1010 100%)' },
                        { id: 'renaissance-light', label: 'Light', bg: 'linear-gradient(145deg, #faf0dc 0%, #fdf5e8 100%)' },
                      ],
                    },
                    {
                      group: 'High Contrast',
                      themes: [
                        { id: 'highcontrast-dark',  label: 'Dark',  bg: 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)' },
                        { id: 'highcontrast-light', label: 'Light', bg: 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)' },
                      ],
                    },
                    {
                      group: 'Gruvbox',
                      themes: [
                        { id: 'gruvbox-dark',  label: 'Dark',  bg: 'linear-gradient(135deg, #282828 0%, #32302f 100%)' },
                        { id: 'gruvbox-light', label: 'Light', bg: 'linear-gradient(135deg, #f9f5d7 0%, #fbf1c7 100%)' },
                      ],
                    },
                    {
                      group: 'Nord',
                      themes: [
                        { id: 'nord-dark',  label: 'Dark',  bg: 'linear-gradient(135deg, #2e3440 0%, #3b4252 100%)' },
                        { id: 'nord-light', label: 'Light', bg: 'linear-gradient(135deg, #eceff4 0%, #e5e9f0 100%)' },
                      ],
                    },
                    {
                      group: 'Solarized',
                      themes: [
                        { id: 'solarized-dark',  label: 'Dark',  bg: 'linear-gradient(135deg, #002b36 0%, #073642 100%)' },
                        { id: 'solarized-light', label: 'Light', bg: 'linear-gradient(135deg, #fdf6e3 0%, #eee8d5 100%)' },
                      ],
                    },
                  ].map(({ group, themes }) => (
                    <div key={group} className="theme-group">
                      <span className="theme-group-label">{group}</span>
                      <div className="theme-group-swatches">
                        {themes.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            className={`theme-swatch${selectedTheme === t.id ? ' theme-swatch--active' : ''}`}
                            onClick={() => setSelectedTheme(t.id)}
                            title={`${group} ${t.label}`}
                            style={{ background: t.bg }}
                          >
                            <span className="theme-swatch-label">{t.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  </div></div>
                  </div>
                </div>
              </form>
            </div>
            <div className="create-box">
              <h2 className="section-title">New Group</h2>
              <form className="create-form" onSubmit={handleCreateGroup}>
                <input
                  type="text"
                  placeholder="Design Team, Project Oasis…"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary">
                  + Group
                </button>
              </form>
            </div>
          </div>
        </section>

        <div className="dashboard-content">
          <DragDropContext onDragEnd={onDragEnd}>
            {groups.map((group) => {
              const groupBoards = boards.filter((b) => b.group_id === group.id);
              const isCollapsed = collapsedGroups.has(group.id);
              return (
                <section key={group.id} className={`boards-section group-section ${isCollapsed ? 'collapsed' : ''}`}>
                  <div className="group-header" onClick={() => toggleGroupCollapse(group.id)} style={{ cursor: 'pointer' }}>
                    <h2 className="section-title">
                      <span className={`collapse-chevron ${isCollapsed ? '' : 'expanded'}`}>▶</span>
                      <span className="group-icon">📁</span>
                      {group.name}
                      <span className="badge badge-count">{groupBoards.length}</span>
                    </h2>
                    <button 
                      className="btn btn-ghost btn-sm group-delete-btn" 
                      onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}
                      title="Delete group"
                    >
                      Remove Group
                    </button>
                  </div>
                  
                  {!isCollapsed && (
                    <Droppable droppableId={`group-${group.id}`} direction="horizontal">
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef} 
                          {...provided.droppableProps}
                          className={`boards-grid ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                          style={{ minHeight: groupBoards.length === 0 ? '100px' : 'auto' }}
                        >
                          {groupBoards.length === 0 && !snapshot.isDraggingOver && (
                            <div className="empty-state mini">
                              <p>No boards here. Drag a board into this group.</p>
                            </div>
                          )}
                          {groupBoards.map((board, index) => (
                            <BoardCard 
                              key={board.id} 
                              board={board} 
                              index={index}
                              onDelete={handleDelete} 
                              onRemoveFromGroup={handleRemoveFromGroup}
                              formatDate={formatDate}
                              navigate={navigate}
                            />
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                </section>
              );
            })}

            <section className="boards-section ungrouped-section">
              <h2 className="section-title">
                {groups.length > 0 ? 'General Boards' : 'All Boards'}
                <span className="badge badge-count">
                  {boards.filter((b) => !b.group_id).length}
                </span>
              </h2>
              
              <Droppable droppableId="ungrouped" direction="horizontal">
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className={`boards-grid ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    style={{ minHeight: boards.filter((b) => !b.group_id).length === 0 ? '100px' : 'auto' }}
                  >
                    {boards.filter((b) => !b.group_id).length === 0 && !snapshot.isDraggingOver && (
                      <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <p>No boards yet. Create your first retrospective board above.</p>
                      </div>
                    )}
                    {boards
                      .filter((b) => !b.group_id)
                      .map((board, index) => (
                        <BoardCard 
                          key={board.id} 
                          board={board} 
                          index={index}
                          onDelete={handleDelete} 
                          formatDate={formatDate}
                          navigate={navigate}
                        />
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </section>
          </DragDropContext>
        </div>
      </main>
    </div>
  );
}

function BoardCard({ board, index, onDelete, onRemoveFromGroup, formatDate, navigate }) {
  return (
    <Draggable draggableId={board.id} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`board-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
          onClick={() => !snapshot.isDragging && navigate(`/board/${board.id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate(`/board/${board.id}`)}
        >
          <div className="board-card-icon">📋</div>
          <div className="board-card-info">
            <span className="board-card-name">{board.name}</span>
            <span className="board-card-date">{formatDate(board.created_at)}</span>
          </div>
          <div className="board-card-actions">
            {onRemoveFromGroup && (
              <button
                type="button"
                className="btn btn-icon board-remove-group-btn"
                onClick={(e) => onRemoveFromGroup(e, board.id)}
                title="Move out of group"
                aria-label="Move out of group"
              >
                📂
              </button>
            )}
            <button
              type="button"
              className="btn btn-icon board-delete-btn"
              onClick={(e) => onDelete(e, board.id)}
              title="Delete board"
              aria-label="Delete board"
            >
              🗑
            </button>
          </div>
        </li>
      )}
    </Draggable>
  );
}
