/**
 * Parse JSON into flat rows for the table view.
 * Only exposes table fields; task-level metadata excluded.
 */
export function parseQueryLog(json) {
  const rows = [];
  for (const [taskId, taskData] of Object.entries(json)) {
    const queries = taskData.queries ?? [];
    for (const q of queries) {
      rows.push({
        task_id: taskId,
        user_name: taskData.user_name ?? '',
        query_id: q.query_id ?? '',
        query: q.query ?? '',
        status: q.status ?? '',
        baidu_cc_model: q.baidu_cc_model ?? '',
        duration_ms: q.duration_ms ?? null,
        error_message: q.error_message ?? null,
      });
    }
  }
  return rows;
}

/**
 * Parse JSON into a user-keyed structure for the user view.
 * Returns: { [user_name]: { tasks: [ { task_id, task_title, mount_directory_path, source, queries: [...] } ] } }
 */
export function parseForUserView(json) {
  const users = {};
  for (const [taskId, taskData] of Object.entries(json)) {
    const name = taskData.user_name ?? 'unknown';
    if (!users[name]) users[name] = { tasks: [] };
    users[name].tasks.push({
      task_id: taskId,
      task_title: taskData.task_title ?? '',
      mount_directory_path: taskData.mount_directory_path ?? '',
      source: taskData.source ?? '',
      queries: (taskData.queries ?? []).map((q) => ({
        query_id: q.query_id ?? '',
        query: q.query ?? '',
        status: q.status ?? '',
        baidu_cc_model: q.baidu_cc_model ?? '',
        duration_ms: q.duration_ms ?? null,
        error_message: q.error_message ?? null,
        created_at: q.created_at ?? null,
      })),
    });
  }
  return users;
}

/**
 * Convert flat rows to a Markdown table string (table view export, unchanged).
 */
export function rowsToMarkdown(rows) {
  const headers = ['task_id', 'query_id', 'query', 'status', 'baidu_cc_model', 'duration_ms', 'error_message'];
  const escape = (val) => {
    if (val === null || val === undefined) return '';
    return String(val).replace(/\|/g, '\\|').replace(/\n/g, ' ');
  };

  const header = '| ' + headers.join(' | ') + ' |';
  const divider = '| ' + headers.map(() => '---').join(' | ') + ' |';
  const bodyLines = rows.map(
    (row) => '| ' + headers.map((h) => escape(row[h])).join(' | ') + ' |'
  );

  return [header, divider, ...bodyLines].join('\n');
}
