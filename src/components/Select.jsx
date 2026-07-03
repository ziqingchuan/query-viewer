import { useState, useRef, useEffect } from 'react';

/**
 * Custom dropdown select matching the dark theme.
 * Props: value, onChange, options: [{value, label}], placeholder
 *        align: 'left' (default) | 'right'
 */
export default function Select({ value, onChange, options, placeholder, align = 'auto' }) {
  const [open, setOpen] = useState(false);
  const [dropStyle, setDropStyle] = useState({});
  const ref = useRef();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Compute alignment: always right-align if align='right', or auto-detect overflow
  useEffect(() => {
    if (!open || !ref.current) return;
    if (align === 'right') {
      setDropStyle({ left: 'auto', right: 0 });
      return;
    }
    // auto: check if left-aligned would overflow viewport
    const rect = ref.current.getBoundingClientRect();
    const wouldOverflow = rect.left + 200 > window.innerWidth - 16;
    setDropStyle(wouldOverflow ? { left: 'auto', right: 0 } : {});
  }, [open, align]);

  const selected = options.find((o) => o.value === value);
  const label = selected ? selected.label : placeholder;

  return (
    <div className={`custom-select ${open ? 'open' : ''}`} ref={ref}>
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`custom-select-label ${!value ? 'placeholder' : ''}`}>{label}</span>
        <span className="custom-select-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="custom-select-dropdown" style={dropStyle}>
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`custom-select-option ${opt.value === value ? 'active' : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
