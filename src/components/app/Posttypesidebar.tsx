'use client';

import { MessagesSquare, Newspaper, BookOpen, LayoutGrid, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import type { PostType } from '@/lib/types';

const TYPE_OPTIONS: { value: PostType | undefined; label: string; icon: typeof LayoutGrid }[] = [
  { value: undefined, label: 'All posts', icon: LayoutGrid },
  { value: 'discussion', label: 'Discussion', icon: MessagesSquare },
  { value: 'news', label: 'News + Analysis', icon: Newspaper },
  { value: 'article', label: 'Article', icon: BookOpen },
];

interface PostTypeSidebarProps {
  value?: PostType;
  onChange: (type: PostType | undefined) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function PostTypeSidebar({ value, onChange, isCollapsed, onToggleCollapse }: PostTypeSidebarProps) {
  return (
    <nav
      className={`bg-white rounded-2xl border border-black/10 p-2 flex flex-col gap-1 sticky top-24 overflow-hidden transition-[width] duration-300 ease-in-out ${
        isCollapsed ? 'w-[56px]' : 'w-[200px]'
      }`}
    >
      <div className="flex items-center px-1 pt-1 pb-2 justify-between">
        <p
          className={`text-xs font-medium text-black/40 uppercase tracking-wide px-2 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
            isCollapsed ? 'opacity-0 max-w-0 px-0' : 'opacity-100 max-w-[140px]'
          }`}
        >
          Post type
        </p>
        <button
          onClick={onToggleCollapse}
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-black/40 hover:text-black hover:bg-black/5 transition-colors duration-200"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {TYPE_OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const isActive = value === opt.value;
        return (
          <button
            key={opt.label}
            onClick={() => onChange(opt.value)}
            title={isCollapsed ? opt.label : undefined}
            className={`group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-left transition-colors duration-200 ${
              isActive ? 'bg-black text-white shadow-sm' : 'text-black/70 hover:bg-black/5 hover:text-black'
            }`}
          >
            {isActive && (
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 h-5 w-1 rounded-full bg-black transition-opacity duration-300 ${
                  isCollapsed ? 'opacity-0' : 'opacity-100'
                }`}
              />
            )}
            <Icon
              className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                isActive ? '' : 'group-hover:scale-110'
              }`}
            />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[160px]'
              }`}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}