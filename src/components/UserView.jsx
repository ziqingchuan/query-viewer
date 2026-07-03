import { useState, useMemo, useRef, useEffect } from 'react';

function formatDuration(ms) {
  if (ms == null) return null;
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

function StatusBadge({ status }) {
  const cls = status === 'completed' ? 'badge-ok' : status === 'cancelled' ? 'badge-warn' : 'badge-err';
  return <span className={`badge ${cls}`}>{status}</span>;
}

function QueryCard({ q }) {
  return (
    <div className={`qcard ${q.error_message ? 'qcard-err' : ''}`}>
      <div className="qcard-header">
        <span className="qcard-id">#{q.query_id}</span>
        <StatusBadge status={q.status} />
        {q.baidu_cc_model && (
          <span className="qcard-chip qcard-chip-model">
            <span className="qcard-chip-label">模型</span>
            {q.baidu_cc_model}
          </span>
        )}
        {q.duration_ms != null && (
          <span className="qcard-chip qcard-chip-dur">
            <span className="qcard-chip-label">耗时</span>
            {formatDuration(q.duration_ms)}
          </span>
        )}
      </div>
      <pre className="qcard-body">{q.query}</pre>
      {q.error_message && (
        <div className="qcard-error">
          <span className="qcard-error-label">Error</span>
          {q.error_message}
        </div>
      )}
    </div>
  );
}

export default function UserView({
  userData,
  selectedUser,
  onSelectUser,
  selectedTaskId,
  onSelectTaskId,
}) {
  const userNames = useMemo(() => Object.keys(userData).sort(), [userData]);
  const [userSearch, setUserSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Auto-select first user if none selected yet
  useEffect(() => {
    if (userNames.length > 0 && !selectedUser) {
      onSelectUser(userNames[0]);
    }
  }, [userNames]);

  // Auto-select first task when user changes and no task selected for this user
  useEffect(() => {
    if (selectedUser) {
      const tasks = userData[selectedUser]?.tasks ?? [];
      if (tasks.length > 0) {
        const stillValid = tasks.some((t) => t.task_id === selectedTaskId);
        if (!stillValid) onSelectTaskId(tasks[0].task_id);
      }
    }
  }, [selectedUser, userData]);

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filteredUsers = useMemo(() =>
    userNames.filter((n) => n.toLowerCase().includes(userSearch.toLowerCase())),
    [userNames, userSearch]
  );

  const tasks = selectedUser ? (userData[selectedUser]?.tasks ?? []) : [];
  const activeTask = tasks.find((t) => t.task_id === selectedTaskId) ?? tasks[0] ?? null;

  return (
    <div className="uv-layout">
      {/* ── User selector ── */}
      <div className="uv-user-bar">
        <div className="uv-user-selector" ref={dropdownRef}>
          <button
            className={`uv-user-trigger ${dropdownOpen ? 'open' : ''}`}
            onClick={() => setDropdownOpen((v) => !v)}
          >
            <span className="uv-user-avatar">{selectedUser?.[0]?.toUpperCase() ?? '?'}</span>
            <span className="uv-user-name">{selectedUser ?? '选择用户'}</span>
            <span className="uv-user-arrow">{dropdownOpen ? '▲' : '▼'}</span>
          </button>
          {dropdownOpen && (
            <div className="uv-user-dropdown">
              <input
                className="uv-user-search"
                placeholder="搜索用户名…"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                autoFocus
              />
              <div className="uv-user-list">
                {filteredUsers.length === 0 && <div className="uv-user-empty">无匹配用户</div>}
                {filteredUsers.map((name) => (
                  <div
                    key={name}
                    className={`uv-user-option ${name === selectedUser ? 'active' : ''}`}
                    onClick={() => { onSelectUser(name); setDropdownOpen(false); setUserSearch(''); }}
                  >
                    <span className="uv-user-avatar sm">{name[0].toUpperCase()}</span>
                    {name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <span className="uv-task-count">{tasks.length} 个任务</span>
      </div>

      {selectedUser && activeTask && (
        <div className="uv-body">
          {/* ── Left: task list ── */}
          <aside className="uv-sidebar">
            <div className="uv-sidebar-title">Tasks</div>
            <div className="uv-task-list">
              {tasks.map((t) => (
                <div
                  key={t.task_id}
                  className={`uv-task-item ${t.task_id === activeTask.task_id ? 'active' : ''}`}
                  onClick={() => onSelectTaskId(t.task_id)}
                >
                  <span className="uv-task-tid">#{t.task_id}</span>
                  <span className="uv-task-title">{t.task_title || '(无标题)'}</span>
                  <span className="uv-task-qcount">{t.queries.length}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Right: detail ── */}
          <div className="uv-detail">
            {/* Meta bar */}
            <div className="uv-meta-bar">
              <div className="uv-meta-item">
                <span className="uv-meta-label">挂载路径</span>
                <span className="uv-meta-val uv-meta-path">{activeTask.mount_directory_path || '—'}</span>
              </div>
              <div className="uv-meta-item">
                <span className="uv-meta-label">设备来源</span>
                <span className="uv-meta-val uv-meta-source">{activeTask.source || '—'}</span>
              </div>
            </div>

            {/* Task title */}
            <div className="uv-task-header">
              <span className="uv-task-header-id">Task {activeTask.task_id}</span>
              <h2 className="uv-task-header-title">{activeTask.task_title || '(无标题)'}</h2>
            </div>

            {/* Query cards */}
            <div className="uv-queries">
              {activeTask.queries.length === 0 && (
                <div className="uv-empty">该任务暂无 Query</div>
              )}
              {activeTask.queries.map((q) => (
                <QueryCard key={q.query_id} q={q} />
              ))}
            </div>
          </div>
        </div>
      )}

      {(!selectedUser || tasks.length === 0) && (
        <div className="uv-placeholder">请选择用户以查看任务详情</div>
      )}
    </div>
  );
}
