'use client';

/**
 * ComboInput: a text input that also offers a dropdown of suggestions.
 * The admin can pick from `options` OR type a custom value. The committed
 * value is whatever ends up in the text input.
 *
 * Usage:
 *   <ComboInput
 *     value={form.category}
 *     options={['Learning Hub', 'Bootcamp', 'Accelerator']}
 *     onChange={(v) => setForm({ ...form, category: v })}
 *     placeholder="Pick or type a category"
 *   />
 */

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

type Props = {
  value: string;
  options: readonly string[];
  onChange: (next: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
};

export default function ComboInput({
  value,
  options,
  onChange,
  placeholder,
  required,
  className = '',
  inputClassName = '',
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const id = useId();

  // Close when clicking outside.
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Filter suggestions by what the user has typed (case-insensitive).
  const filtered = useMemo(() => {
    const q = (value || '').trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [value, options]);

  const baseInput =
    'w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-brand-400 bg-white pr-10';

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <input
        id={id}
        type="text"
        value={value}
        required={required}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') { setOpen(false); }
          if (e.key === 'Enter' && open) { e.preventDefault(); setOpen(false); }
        }}
        className={`${baseInput} ${inputClassName}`}
        autoComplete="off"
      />
      <button
        type="button"
        aria-label={open ? 'Close suggestions' : 'Show suggestions'}
        onClick={() => setOpen((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        tabIndex={-1}
      >
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && filtered.length > 0 && (
        <div className="absolute z-30 mt-1 left-0 right-0 max-h-56 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {filtered.map((opt) => {
            const selected = opt === value;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${
                  selected ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{opt}</span>
                {selected && <Check className="w-4 h-4 text-brand-500" />}
              </button>
            );
          })}
          {value && !options.some((o) => o.toLowerCase() === value.toLowerCase()) && (
            <div className="px-3 py-2 text-[12px] text-slate-500 border-t border-slate-100 bg-slate-50">
              Press Enter to keep <span className="font-semibold text-slate-800">&ldquo;{value}&rdquo;</span> as a custom value.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
