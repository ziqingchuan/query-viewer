export default function StatsBar({ rows, filtered }) {
  const total = rows.length;
  const shown = filtered.length;
  const completed = filtered.filter((r) => r.status === 'completed').length;
  const cancelled = filtered.filter((r) => r.status === 'cancelled').length;
  const errored = filtered.filter((r) => r.error_message).length;

  return (
    <div className="stats-bar">
      <span className="stat">共 <b>{total}</b> 条</span>
      {shown !== total && <span className="stat filtered">筛选后 <b>{shown}</b> 条</span>}
      <span className="stat ok">✓ 完成 <b>{completed}</b></span>
      <span className="stat warn">↩ 取消 <b>{cancelled}</b></span>
      {errored > 0 && <span className="stat err">⚠ 有错误 <b>{errored}</b></span>}
    </div>
  );
}
