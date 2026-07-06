import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { parseQueryLog, parseForUserView, rowsToMarkdown } from './utils/parseJson';
import mockData from './mockData';
import UploadZone from './components/UploadZone';
import DataTable from './components/DataTable';
import FilterBar from './components/FilterBar';
import StatsBar from './components/StatsBar';
import UserView from './components/UserView';
import './App.css';

const LS_KEY = 'query_log_raw';
const LS_NAME = 'query_log_name';

function mergeJsonObjects(existing, incoming) {
  const merged = { ...existing };
  for (const [taskId, taskData] of Object.entries(incoming)) {
    if (!merged[taskId]) {
      // task_id 不存在，直接加入
      merged[taskId] = taskData;
    } else {
      // task_id 已存在，合并 queries（以 query_id 去重，旧的保留，新的追加）
      const existingQueryIds = new Set(
        (merged[taskId].queries ?? []).map((q) => q.query_id)
      );
      const newQueries = (taskData.queries ?? []).filter(
        (q) => !existingQueryIds.has(q.query_id)
      );
      merged[taskId] = {
        ...merged[taskId],
        queries: [...(merged[taskId].queries ?? []), ...newQueries],
      };
    }
  }
  return merged;
}

export default function App() {
  const [rows, setRows] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return parseQueryLog(JSON.parse(raw));
    } catch {}
    return [];
  });
  const [userData, setUserData] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return parseForUserView(JSON.parse(raw));
    } catch {}
    return {};
  });
  const [fileName, setFileName] = useState(() => localStorage.getItem(LS_NAME) || '');
  const [view, setView] = useState('table'); // 'table' | 'user'
  const [uvSelectedUser, setUvSelectedUser] = useState(null);
  const [uvSelectedTaskId, setUvSelectedTaskId] = useState(null);
  const [filters, setFilters] = useState({ status: '', baidu_cc_model: '', search: '' });
  const [sort, setSort] = useState({ key: 'query_id', dir: 'asc' });
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;
  const appendInputRef = useRef();

  const handleFile = useCallback((file) => {
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        localStorage.setItem(LS_KEY, e.target.result);
        localStorage.setItem(LS_NAME, file.name);
        setRows(parseQueryLog(json));
        setUserData(parseForUserView(json));
        setFileName(file.name);
        setFilters({ status: '', baidu_cc_model: '', search: '' });
        setPage(1);
        setView('table');
      } catch {
        setError('JSON 解析失败，请确认文件格式正确。');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleAppendFile = useCallback((file) => {
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const incoming = JSON.parse(e.target.result);
        const existingRaw = localStorage.getItem(LS_KEY);
        const existing = existingRaw ? JSON.parse(existingRaw) : {};
        const merged = mergeJsonObjects(existing, incoming);
        const mergedStr = JSON.stringify(merged);
        const mergedName = fileName ? `${fileName} + ${file.name}` : file.name;
        localStorage.setItem(LS_KEY, mergedStr);
        localStorage.setItem(LS_NAME, mergedName);
        setRows(parseQueryLog(merged));
        setUserData(parseForUserView(merged));
        setFileName(mergedName);
        setPage(1);
      } catch {
        setError('JSON 解析失败，请确认文件格式正确。');
      }
    };
    reader.readAsText(file);
  }, [fileName]);

  const handleDemo = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(LS_NAME);
    setRows(parseQueryLog(mockData));
    setUserData(parseForUserView(mockData));
    setFileName('Demo 数据');
    setFilters({ status: '', baidu_cc_model: '', search: '' });
    setPage(1);
    setView('table');
  }, []);

  const statusOptions = useMemo(() => {
    const s = new Set(rows.map((r) => r.status).filter(Boolean));
    return ['', ...Array.from(s)];
  }, [rows]);

  const modelOptions = useMemo(() => {
    const s = new Set(rows.map((r) => r.baidu_cc_model).filter(Boolean));
    return ['', ...Array.from(s)];
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filters.status && r.status !== filters.status) return false;
      if (filters.baidu_cc_model && r.baidu_cc_model !== filters.baidu_cc_model) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const target = `${r.task_id} ${r.query_id} ${r.query} ${r.error_message ?? ''}`.toLowerCase();
        if (!target.includes(q)) return false;
      }
      return true;
    });
  }, [rows, filters]);

  const sorted = useMemo(() => {
    const { key, dir } = sort;
    return [...filtered].sort((a, b) => {
      const av = a[key] ?? '';
      const bv = b[key] ?? '';
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
      return dir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sort]);

  useEffect(() => { setPage(1); }, [filters, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExportMd = () => {
    const md = rowsToMarkdown(sorted);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (fileName.replace(/\.json$/i, '') || 'query_log') + '_table.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasData = rows.length > 0;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Query Log Viewer</h1>
          </div>
          {hasData && (
            <div className="header-right">
              {/* View toggle */}
              <div className="view-toggle">
                <button
                  className={`view-tab ${view === 'table' ? 'active' : ''}`}
                  onClick={() => setView('table')}
                >
                  ⊞ 表格视图
                </button>
                <button
                  className={`view-tab ${view === 'user' ? 'active' : ''}`}
                  onClick={() => setView('user')}
                >
                  ◉ 用户视图
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {!hasData ? (
          <div className="upload-page">
            <UploadZone onFile={handleFile} onDemo={handleDemo} />
            {error && <p className="error-msg">{error}</p>}
          </div>
        ) : view === 'table' ? (
          <div className="table-view-scroll">
            <div className="toolbar">
              <div className="toolbar-left">
                <span className="file-badge">{fileName}</span>
                <StatsBar rows={rows} filtered={sorted} />
              </div>
              <div className="toolbar-right">
                <button className="btn btn-export" onClick={handleExportMd}>
                  ↓ 导出 Markdown
                </button>
                <button className="btn btn-ghost" onClick={() => appendInputRef.current.click()}>
                  + 继续上传
                </button>
                <input
                  ref={appendInputRef}
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) { handleAppendFile(f); e.target.value = ''; } }}
                />
                <button className="btn btn-ghost" onClick={() => { localStorage.removeItem(LS_KEY); localStorage.removeItem(LS_NAME); setRows([]); setUserData({}); setFileName(''); setUvSelectedUser(null); setUvSelectedTaskId(null); }}>
                  ✕ 重新上传
                </button>
              </div>
            </div>
            <FilterBar
              filters={filters}
              onFilters={setFilters}
              statusOptions={statusOptions}
              modelOptions={modelOptions}
            />
            {error && <p className="error-msg">{error}</p>}
            <DataTable rows={paged} sort={sort} onSort={setSort} />
            {totalPages > 1 && (
              <div className="pagination">
                <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(1)}>«</button>
                <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</button>
                <span className="page-info">第 <b>{page}</b> / <b>{totalPages}</b> 页 · 共 <b>{sorted.length}</b> 条</span>
                <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
                <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
              </div>
            )}
          </div>
        ) : (
          <UserView
            userData={userData}
            selectedUser={uvSelectedUser}
            onSelectUser={setUvSelectedUser}
            selectedTaskId={uvSelectedTaskId}
            onSelectTaskId={setUvSelectedTaskId}
          />
        )}
      </main>
    </div>
  );
}
