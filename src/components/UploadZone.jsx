import { useState, useRef } from 'react';

export default function UploadZone({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      className={`upload-zone ${dragging ? 'dragging' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
    >
      <div className="upload-icon">⬆</div>
      <p className="upload-title">上传 Query Log JSON</p>
      <p className="upload-sub">拖拽文件到此处，或点击选择文件</p>
      <span className="upload-hint">.json 格式</span>
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
}
