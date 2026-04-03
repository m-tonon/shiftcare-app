import { CalendarDays, Plus, Users } from 'lucide-react';
import type { Page } from './BottomNav';

interface Props {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { page: Page; label: string; Icon: typeof CalendarDays }[] = [
  { page: 'schedule', label: 'Schedule', Icon: CalendarDays },
  { page: 'add-schedule', label: 'Add Shifts', Icon: Plus },
  { page: 'team', label: 'Team', Icon: Users },
];

export function SideNav({ activePage, onNavigate }: Props) {
  return (
    <aside className="hidden md:flex flex-col w-56 flex-shrink-0 bg-background border-r border-border">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <CalendarDays size={15} className="text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-foreground leading-tight">
            ShiftCare
          </p>
          <p className="text-[10px] text-subtle truncate">Riverside Medical</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ page, label, Icon }) => {
          const active = activePage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors text-left ${
                active
                  ? 'bg-primary/8 text-primary'
                  : 'text-muted-foreground hover:bg-surface hover:text-foreground'
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border">
        <p className="text-[10px] text-subtle">ShiftCare v1.0</p>
      </div>
    </aside>
  );
}
