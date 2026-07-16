'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Baseline,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eraser,
  ChevronDown,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Config                                                                     */
/* -------------------------------------------------------------------------- */

const FONT_FAMILIES: { label: string; value: string }[] = [
  { label: 'Default', value: 'inherit' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Mono', value: '"JetBrains Mono", "SF Mono", Menlo, monospace' },
  { label: 'Rounded', value: '"Poppins", ui-rounded, sans-serif' },
];

const FONT_SIZES: { label: string; value: string }[] = [
  { label: 'S', value: '13px' },
  { label: 'M', value: '16px' },
  { label: 'L', value: '22px' },
  { label: 'XL', value: '30px' },
];

const TEXT_COLORS = [
  '#111111',
  '#DC2626',
  '#EA580C',
  '#CA8A04',
  '#16A34A',
  '#2563EB',
  '#7C3AED',
  '#DB2777',
];

const HIGHLIGHT_COLORS = [
  { label: 'None', value: 'transparent' },
  { label: 'Yellow', value: '#FEF08A' },
  { label: 'Green', value: '#BBF7D0' },
  { label: 'Blue', value: '#BFDBFE' },
  { label: 'Pink', value: '#FBCFE8' },
  { label: 'Orange', value: '#FED7AA' },
];

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                      */
/* -------------------------------------------------------------------------- */

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors duration-150 ${
        active ? 'bg-black text-white' : 'text-black/60 hover:bg-black/5 hover:text-black'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-black/10 mx-1 shrink-0" />;
}

function Dropdown({
  label,
  icon,
  children,
  width = 'w-40',
}: {
  label: string;
  icon?: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  width?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        className="h-8 px-2 flex items-center gap-1 rounded-lg text-sm text-black/60 hover:bg-black/5 hover:text-black transition-colors duration-150"
      >
        {icon}
        <span>{label}</span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <div
          className={`absolute z-20 top-9 left-0 ${width} rounded-xl border border-black/10 bg-white shadow-lg p-2 flex flex-col gap-0.5`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main editor                                                                */
/* -------------------------------------------------------------------------- */

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Share your take…',
  minHeightClass = 'min-h-[260px]',
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeightClass?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeMarks, setActiveMarks] = useState<Set<string>>(new Set());
  const [hint, setHint] = useState<string | null>(null);

  // Sync external value -> DOM only on mount (avoids cursor jumps while typing)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emitChange = useCallback(() => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const refreshActiveMarks = useCallback(() => {
    const marks = new Set<string>();
    try {
      if (document.queryCommandState('bold')) marks.add('bold');
      if (document.queryCommandState('italic')) marks.add('italic');
      if (document.queryCommandState('underline')) marks.add('underline');
      if (document.queryCommandState('strikeThrough')) marks.add('strike');
      if (document.queryCommandState('insertUnorderedList')) marks.add('ul');
      if (document.queryCommandState('insertOrderedList')) marks.add('ol');
      if (document.queryCommandState('justifyLeft')) marks.add('left');
      if (document.queryCommandState('justifyCenter')) marks.add('center');
      if (document.queryCommandState('justifyRight')) marks.add('right');
    } catch {
      // queryCommandState can throw in some environments — safe to ignore
    }
    setActiveMarks(marks);
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', refreshActiveMarks);
    return () => document.removeEventListener('selectionchange', refreshActiveMarks);
  }, [refreshActiveMarks]);

  // Used for commands that are still reliably supported everywhere:
  // bold / italic / underline / strike / lists / quote / align / undo / redo
  function exec(command: string, arg?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    emitChange();
    refreshActiveMarks();
  }

  // Used for font family / size / color / highlight, which execCommand no
  // longer reliably applies in modern browsers. We wrap the selection in a
  // styled <span> directly instead.
  function applyInlineStyle(
    styleProp: 'fontFamily' | 'fontSize' | 'color' | 'backgroundColor',
    value: string
  ) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      setHint('Select some text first, then apply this');
      window.setTimeout(() => setHint(null), 1800);
      return;
    }
    const range = sel.getRangeAt(0);
    if (!editorRef.current || !editorRef.current.contains(range.commonAncestorContainer)) {
      setHint('Click into the editor and select some text first');
      window.setTimeout(() => setHint(null), 1800);
      return;
    }

    const span = document.createElement('span');
    span.style[styleProp] = value;

    try {
      // Works when the selection sits inside a single parent element
      range.surroundContents(span);
    } catch {
      // Selection crosses element boundaries — extract then re-wrap
      const frag = range.extractContents();
      span.appendChild(frag);
      range.insertNode(span);
    }

    // Re-select the newly wrapped text so stacking another style still applies to it
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    sel.removeAllRanges();
    sel.addRange(newRange);

    emitChange();
  }

  function insertLink() {
    const url = window.prompt('Paste a link URL');
    if (!url) return;
    exec('createLink', url);
  }

  const wordCount = (editorRef.current?.innerText || '').trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="rounded-xl border border-black/10 overflow-hidden bg-white focus-within:border-black/30 transition-colors duration-150">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-black/10 bg-black/[0.02] flex-wrap">
        <ToolbarButton title="Bold" active={activeMarks.has('bold')} onClick={() => exec('bold')}>
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={activeMarks.has('italic')} onClick={() => exec('italic')}>
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton title="Underline" active={activeMarks.has('underline')} onClick={() => exec('underline')}>
          <Underline size={15} />
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" active={activeMarks.has('strike')} onClick={() => exec('strikeThrough')}>
          <Strikethrough size={15} />
        </ToolbarButton>

        <Divider />

        <Dropdown label="Font">
          {(close) => (
            <>
              {FONT_FAMILIES.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    applyInlineStyle('fontFamily', f.value);
                    close();
                  }}
                  style={{ fontFamily: f.value }}
                  className="text-left text-sm px-2 py-1.5 rounded-lg hover:bg-black/5"
                >
                  {f.label}
                </button>
              ))}
            </>
          )}
        </Dropdown>

        <Dropdown label="Size">
          {(close) => (
            <div className="grid grid-cols-4 gap-1">
              {FONT_SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    applyInlineStyle('fontSize', s.value);
                    close();
                  }}
                  className="text-sm px-2 py-1.5 rounded-lg hover:bg-black/5 font-medium"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </Dropdown>

        <Divider />

        <Dropdown label="" icon={<Baseline size={15} />} width="w-44">
          {(close) => (
            <div className="grid grid-cols-4 gap-1.5 p-1">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  title={c}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    applyInlineStyle('color', c);
                    close();
                  }}
                  className="h-6 w-6 rounded-full border border-black/10"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}
        </Dropdown>

        <Dropdown label="" icon={<Highlighter size={15} />} width="w-44">
          {(close) => (
            <div className="grid grid-cols-3 gap-1.5 p-1">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    applyInlineStyle('backgroundColor', c.value);
                    close();
                  }}
                  className="h-6 w-6 rounded-full border border-black/10 flex items-center justify-center"
                  style={{ backgroundColor: c.value === 'transparent' ? '#fff' : c.value }}
                >
                  {c.value === 'transparent' && <span className="text-[10px] text-black/40">×</span>}
                </button>
              ))}
            </div>
          )}
        </Dropdown>

        <Divider />

        <ToolbarButton title="Bulleted list" active={activeMarks.has('ul')} onClick={() => exec('insertUnorderedList')}>
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton title="Numbered list" active={activeMarks.has('ol')} onClick={() => exec('insertOrderedList')}>
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton title="Quote" onClick={() => exec('formatBlock', 'blockquote')}>
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton title="Link" onClick={insertLink}>
          <LinkIcon size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Align left" active={activeMarks.has('left')} onClick={() => exec('justifyLeft')}>
          <AlignLeft size={15} />
        </ToolbarButton>
        <ToolbarButton title="Align center" active={activeMarks.has('center')} onClick={() => exec('justifyCenter')}>
          <AlignCenter size={15} />
        </ToolbarButton>
        <ToolbarButton title="Align right" active={activeMarks.has('right')} onClick={() => exec('justifyRight')}>
          <AlignRight size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Undo" onClick={() => exec('undo')}>
          <Undo2 size={15} />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => exec('redo')}>
          <Redo2 size={15} />
        </ToolbarButton>
        <ToolbarButton title="Clear formatting" onClick={() => exec('removeFormat')}>
          <Eraser size={15} />
        </ToolbarButton>
      </div>

      {hint && (
        <div className="px-4 py-1 text-xs text-amber-700 bg-amber-50 border-b border-amber-100">
          {hint}
        </div>
      )}

      {/* Editable surface */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emitChange}
        onBlur={emitChange}
        onMouseUp={refreshActiveMarks}
        onKeyUp={refreshActiveMarks}
        className={`prose-editor ${minHeightClass} px-4 py-3 text-[15px] leading-relaxed text-black/90 outline-none overflow-y-auto`}
      />

      <div className="flex justify-end px-4 py-1.5 border-t border-black/5 bg-black/[0.015]">
        <span className="text-xs text-black/35">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
      </div>

      <style jsx global>{`
        .prose-editor:empty:before {
          content: attr(data-placeholder);
          color: rgba(0, 0, 0, 0.3);
          pointer-events: none;
        }
        .prose-editor blockquote {
          border-left: 3px solid rgba(0, 0, 0, 0.15);
          margin: 0.5em 0;
          padding-left: 1em;
          color: rgba(0, 0, 0, 0.6);
          font-style: italic;
        }
        .prose-editor ul {
          list-style: disc;
          padding-left: 1.4em;
        }
        .prose-editor ol {
          list-style: decimal;
          padding-left: 1.4em;
        }
        .prose-editor a {
          color: #2563eb;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

/** Strip HTML down to plain text — handy for validation / word counts elsewhere. */
export function htmlToPlainText(html: string): string {
  if (typeof window === 'undefined') return html.replace(/<[^>]*>/g, '');
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}