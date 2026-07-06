import { useState } from 'react';

const COLUMNS = [
  { key: 'task_id', label: 'Task ID', width: '9%', nowrap: true },
  { key: 'query_id', label: 'Query ID', width: '9%', nowrap: true },
  { key: 'query', label: 'Query', width: '30%' },
  { key: 'status', label: 'Status', width: '12%' },
  { key: 'baidu_cc_model', label: 'Model', width: '14%' },
  { key: 'duration_ms', label: 'Duration (ms)', width: '12%', nowrap: true },
  { key: 'error_message', label: 'Error', width: '18%' },
];

function SortIcon({ active, dir }) {
  if (!active) return <span className="sort-icon inactive">↕</span>;
  return <span className="sort-icon active">{dir === 'asc' ? '↑' : '↓'}</span>;
}

function StatusBadge({ status }) {
  const cls = status === 'completed' ? 'badge-ok' : status === 'cancelled' ? 'badge-warn' : 'badge-err';
  return <span className={`badge ${cls}`}>{status}</span>;
}

function MobileCard({ row }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`mobile-card ${row.error_message ? 'mobile-card-err' : ''}`}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="mobile-card-top">
        <span className="mobile-card-ids">
          <span className="mono">{row.task_id}</span>
          <span className="mobile-card-sep">/</span>
          <span className="mono">{row.query_id}</span>
        </span>
        <StatusBadge status={row.status} />
      </div>
      <p className={`mobile-card-query ${expanded ? 'full' : ''}`}>{row.query}</p>
      {(row.baidu_cc_model || row.duration_ms != null) && (
        <div className="mobile-card-meta">
          {row.baidu_cc_model && <span className="qcard-chip qcard-chip-model"><span className="qcard-chip-label">模型</span>{row.baidu_cc_model}</span>}
          {row.duration_ms != null && <span className="qcard-chip qcard-chip-dur"><span className="qcard-chip-label">耗时</span>{row.duration_ms.toLocaleString()} ms</span>}
        </div>
      )}
      {row.error_message && (
        <div className="mobile-card-error">
          <span className="qcard-error-label">Error</span>
          {row.error_message}
        </div>
      )}
    </div>
  );
}

export default function DataTable({ rows, sort, onSort }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleSort = (key) => {
    onSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    );
  };

  if (rows.length === 0) {
    return <div className="empty-state">没有符合条件的数据</div>;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={sort.key === col.key ? 'sorted' : ''}
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="th-content">
                    {col.label}
                    <SortIcon active={sort.key === col.key} dir={sort.dir} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isExpanded = expandedRow === i;
              return (
                <>
                  <tr
                    key={row.query_id + '-' + i}
                    className={`data-row ${isExpanded ? 'expanded' : ''} ${row.error_message ? 'row-err' : ''}`}
                    onClick={() => setExpandedRow(isExpanded ? null : i)}
                  >
                    <td className="mono nowrap">{row.task_id}</td>
                    <td className="mono nowrap">{row.query_id}</td>
                    <td className="query-cell">
                      <span className={`query-preview ${isExpanded ? 'full' : ''}`}>
                        {row.query}
                      </span>
                    </td>
                    <td><StatusBadge status={row.status} /></td>
                    <td className="model-cell">{row.baidu_cc_model}</td>
                    <td className="mono right nowrap">
                      {row.duration_ms != null ? row.duration_ms.toLocaleString() : '—'}
                    </td>
                    <td className="error-cell">
                      {row.error_message
                        ? <span className="error-text" title={row.error_message}>{row.error_message}</span>
                        : <span className="null-val">—</span>}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={'expand-' + i} className="expand-row">
                      <td colSpan={COLUMNS.length}>
                        <div className="expand-content">
                          <pre className="query-full">{row.query}</pre>
                          {row.error_message && (
                            <p className="expand-error"><b>Error:</b> {row.error_message}</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mobile-cards">
        {rows.map((row, i) => <MobileCard key={row.query_id + '-m-' + i} row={row} />)}
      </div>
    </>
  );
}
