import Select from './Select';

export default function FilterBar({ filters, onFilters, statusOptions, modelOptions }) {
  const set = (key) => (val) => onFilters((prev) => ({ ...prev, [key]: val }));

  const statusOpts = statusOptions.map((s) => ({ value: s, label: s === '' ? '全部状态' : s }));
  const modelOpts = modelOptions.map((m) => ({ value: m, label: m === '' ? '全部模型' : m }));

  return (
    <div className="filter-bar">
      <input
        className="filter-input"
        type="text"
        placeholder="搜索 task_id / query_id / query 内容…"
        value={filters.search}
        onChange={(e) => onFilters((prev) => ({ ...prev, search: e.target.value }))}
      />
      <Select
        value={filters.status}
        onChange={set('status')}
        options={statusOpts}
        placeholder="全部状态"
      />
      <Select
        value={filters.baidu_cc_model}
        onChange={set('baidu_cc_model')}
        options={modelOpts}
        placeholder="全部模型"
        align="right"
      />
      {(filters.search || filters.status || filters.baidu_cc_model) && (
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onFilters({ status: '', baidu_cc_model: '', search: '' })}
        >
          清除筛选
        </button>
      )}
    </div>
  );
}
